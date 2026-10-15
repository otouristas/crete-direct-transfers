import SwiftUI
import Supabase

@MainActor @Observable final class JourneyStore {
    var bookings: [Booking] = []
    var offers: [JobOffer] = []
    var active: Booking?
    var position: DriverPosition?
    var error: String?
    var connected = false
    var testEnabled = false
    var testOnline = false
    var driverTestMode = false
    var loading = false
    private var channel: RealtimeChannelV2?
    private var streams: [Task<Void, Never>] = []
    private var recovery: Task<Void, Never>?
    private var refreshTask: Task<Void, Never>?
    private var identity: UUID?
    private var generation = 0
    private var readGeneration = 0
    private var testAvailableUntil: Date?

    func connect(user: UUID?) async {
        guard identity != user else { return }
        await disconnect(); identity = user
        guard let user else { bookings = []; offers = []; active = nil; position = nil; return }
        generation += 1; let version = generation
        do {
            let allowed: Bool = try await Backend.client.rpc("is_transfer_tester").execute().value
            testEnabled = allowed
            driverTestMode = allowed && UserDefaults.standard.bool(forKey: "driver-test-mode-\(user)")
            if allowed && AppRole.isDriver {
                let until: String? = try await Backend.client.rpc("get_test_driver_availability").execute().value
                testAvailableUntil = until.flatMap(ISO8601DateFormatter.parse)
                testOnline = (testAvailableUntil ?? .distantPast) > Date()
            }
        } catch { testEnabled = false }
        let c = Backend.client.realtimeV2.channel("native:\(AppRole.role):\(user)")
        channel = c
        streams.append(Task { [weak self] in
            for await status in c.statusChange {
                guard let self, self.generation == version else { return }
                self.connected = status == .subscribed
                if status == .subscribed { await self.refresh() }
            }
        })
        // Register streams before subscribing; the first read follows subscription.
        for table in ["bookings", "trip_locations", "job_offers"] + (testEnabled ? ["test_rides", "test_ride_offers", "test_trip_locations"] : []) {
            let changes = c.postgresChange(AnyAction.self, schema: "public", table: table)
            streams.append(Task { [weak self] in
                for await _ in changes {
                    guard let self, self.generation == version else { return }
                    self.scheduleRefresh()
                }
            })
        }
        do { try await c.subscribeWithError(); connected = true }
        catch { self.error = "The live connection is reconnecting." }
        await refresh()
        recovery = Task { [weak self] in
            while !Task.isCancelled {
                try? await Task.sleep(for: .seconds(15))
                guard !Task.isCancelled, let self, self.generation == version else { return }
                await self.refresh()
            }
        }
    }
    func disconnect() async {
        generation += 1; streams.forEach { $0.cancel() }; streams = []
        recovery?.cancel(); refreshTask?.cancel(); connected = false
        if let channel { await Backend.client.realtimeV2.removeChannel(channel) }
        channel = nil; identity = nil
    }
    private func scheduleRefresh() {
        refreshTask?.cancel()
        refreshTask = Task { try? await Task.sleep(for: .milliseconds(150)); guard !Task.isCancelled else { return }; await refresh() }
    }
    func refresh() async {
        guard let id = identity else { return }
        let version = generation
        readGeneration += 1; let request = readGeneration
        testOnline = (testAvailableUntil ?? .distantPast) > Date()
        do {
            let real: [Booking] = try await Backend.client.from("bookings").select().eq(AppRole.isDriver ? "driver_id" : "user_id", value: id).order("pickup_at", ascending: false).limit(100).execute().value
            let tests: [Booking] = testEnabled ? try await Backend.client.from("test_rides").select().eq(AppRole.isDriver ? "driver_id" : "user_id", value: id).order("pickup_at", ascending: false).limit(50).execute().value : []
            guard identity == id, generation == version, request == readGeneration else { return }
            bookings = (real + tests).sorted { $0.pickup_at > $1.pickup_at }
            if AppRole.isDriver {
                let realOffers: [JobOffer] = try await Backend.client.from("my_job_offers").select().eq("offer_status", value: "pending").execute().value
                let testsOffers: [JobOffer] = testEnabled ? try await Backend.client.rpc("my_test_ride_offers").execute().value : []
                guard generation == version, request == readGeneration else { return }
                offers = (realOffers + testsOffers).filter { $0.expiry > Date() }.sorted { $0.expiry < $1.expiry }
            }
            if let previous = active, let latest = bookings.first(where: { $0.id == previous.id }) {
                active = latest
                if latest.closed {
                    position = nil
                    if LocationService.shared.sharing == latest.id { try await LocationService.shared.stopSharing() }
                } else { await refreshPosition(latest) }
            }
            error = nil
        } catch { if generation == version { self.error = "Couldn’t refresh transfers. \(error.localizedDescription)" } }
    }
    func select(_ booking: Booking) async { active = booking; position = nil; if !booking.closed { await refreshPosition(booking) } }
    func refreshPosition(_ booking: Booking) async {
        do {
            let rows: [DriverPosition] = try await Backend.client.from(booking.isTest ? "test_trip_locations" : "trip_locations").select().eq("booking_id", value: booking.id).execute().value
            guard active?.id == booking.id, active?.closed == false else { return }
            if let next = rows.first {
                if position == nil || (next.date ?? .distantPast) >= (position?.date ?? .distantPast) { position = next }
            } else { position = nil }
        } catch { self.error = "The driver’s location is reconnecting." }
    }
    func accept(_ offer: JobOffer, accept: Bool) async throws {
        if offer.is_test == true {
            let ride: Booking? = try await Backend.client.rpc("respond_to_test_ride", params: ["p_offer_id": AnyJSON.string(offer.offer_id.uuidString), "p_accept": .bool(accept)]).execute().value
            if let ride, accept { await select(ride) }
        } else {
            try await Backend.client.rpc("respond_to_offer", params: ["p_offer_id": AnyJSON.string(offer.offer_id.uuidString), "p_accept": .bool(accept)]).execute()
        }
        await refresh()
        if accept, let booking = bookings.first(where: { $0.id == offer.id }) { await select(booking) }
    }
    func advance(_ booking: Booking) async throws {
        guard let action = booking.nextAction else { return }
        if booking.isTest {
            let updated: Booking = try await Backend.client.rpc("advance_test_ride", params: ["p_ride_id": booking.id.uuidString, "p_action": action.action]).execute().value
            active = updated
        } else if action.action == "start" || action.action == "complete" {
            try await Backend.client.rpc("update_job_status", params: ["p_booking_id": booking.id.uuidString, "p_status": action.action == "start" ? "en_route" : "completed"]).execute()
        } else {
            try await Backend.client.rpc("advance_trip", params: ["p_booking_id": booking.id.uuidString, "p_stage": action.action == "arrive" ? "at_pickup" : "on_trip"]).execute()
        }
        await refresh()
        if action.action == "start", let current = active, current.id == booking.id {
            do { try await LocationService.shared.startSharing(current) }
            catch { self.error = "Transfer started. Enable location to share live GPS with your traveler." }
        }
    }
    func online(_ online: Bool, test: Bool) async throws {
        if test { try await Backend.client.rpc("set_test_driver_online", params: ["p_online": online]).execute(); testAvailableUntil = online ? Date().addingTimeInterval(20*60) : nil; testOnline = online }
        else { try await Backend.client.rpc("set_driver_online", params: ["p_online": online]).execute() }
        await PushService.shared.register(); await refresh()
    }
    func setTestMode(_ value: Bool) {
        driverTestMode = testEnabled && value
        if let identity { UserDefaults.standard.set(driverTestMode, forKey: "driver-test-mode-\(identity)") }
    }
}
