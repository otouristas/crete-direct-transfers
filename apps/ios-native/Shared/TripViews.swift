import SwiftUI
import MapKit

struct TripsView: View {
    @Environment(AccountStore.self) private var account
    @Environment(JourneyStore.self) private var journeys
    @State private var past = false
    @State private var auth = false
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 23) {
                    Text(AppRole.isDriver ? "Your transfers." : "Good journeys\nstay with you.").font(.system(size: 34, weight: .bold)).tracking(-1.2).padding(.top, 18)
                    Picker("Transfers", selection: $past) { Text("Upcoming").tag(false); Text("Past").tag(true) }.pickerStyle(.segmented)
                    if account.user == nil { ContentUnavailableView { Label("Your journeys, together", systemImage: "point.topleft.down.to.point.bottomright.curvepath") } description: { Text("Sign in to see your transfers and follow your driver.") } actions: { Button("Sign in") { auth = true }.buttonStyle(.borderedProminent) } }
                    else if journeys.bookings.filter({ $0.closed == past }).isEmpty { ContentUnavailableView(past ? "No past transfers" : "Your next journey awaits", systemImage: "location.circle", description: Text("Your \(past ? "completed" : "upcoming") transfers will appear here.")) }
                    ForEach(journeys.bookings.filter { $0.closed == past }) { booking in
                        Button { Task { await journeys.select(booking) } } label: { TripCard(booking: booking) }.buttonStyle(.plain)
                    }
                    if let error = journeys.error { Notice(text: error, error: true) }
                }.padding(22)
            }.background(Brand.canvas).refreshable { await journeys.refresh() }.navigationBarTitleDisplayMode(.inline).toolbar { BrandToolbarItem() }
        }.sheet(isPresented: $auth) { AuthView() }
    }
}

struct TripCard: View {
    var booking: Booking
    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            HStack { if let date = booking.pickupDate { Text(date.pickupLabel(in: booking.pickupTimeZone)).font(.caption.weight(.semibold)) }; Spacer(); if booking.isTest { Text("TEST").font(.system(size: 9, weight: .heavy)).tracking(1).padding(6).background(Brand.mist, in: Capsule()).foregroundStyle(Brand.blue) }; Image(systemName: "arrow.up.right").font(.subheadline) }
            RouteRail(from: booking.pickup_address ?? "Pickup", to: booking.dropoff_address ?? "Destination")
            Divider()
            HStack { Text(booking.phase).font(.caption.weight(.semibold)).foregroundStyle(booking.closed ? .secondary : Brand.blue); Spacer(); Text(booking.price).font(.headline) }
        }.padding(20).foregroundStyle(Brand.ink).background(.white, in: RoundedRectangle(cornerRadius: 24))
    }
}

struct JourneyView: View {
    var id: UUID
    @Environment(JourneyStore.self) private var journeys
    @Environment(\.dismiss) private var dismiss
    @State private var route = RouteService()
    @State private var follow = false
    @State private var error: String?
    @State private var busy = false
    @State private var confirmComplete = false
    private var booking: Booking? { journeys.active?.id == id ? journeys.active : journeys.bookings.first { $0.id == id } }
    private var routingOrigin: CLLocationCoordinate2D? { if let p = journeys.position, booking?.closed == false { return p.coordinate }; return booking?.pickup_point?.coordinate }
    private var routingDestination: CLLocationCoordinate2D? { if journeys.position != nil, booking?.closed == false, booking?.journey_stage != "on_trip" { return booking?.pickup_point?.coordinate }; return booking?.dropoff_point?.coordinate }
    private var routeKey: String { "\(booking?.journey_stage ?? ""):\(booking?.pickup_point?.lat ?? 0):\(booking?.dropoff_point?.lng ?? 0):\(Int((journeys.position?.date?.timeIntervalSince1970 ?? 0) / 30))" }
    var body: some View {
        NavigationStack {
            if let booking {
                GeometryReader { geo in
                    VStack(spacing: 0) {
                        ZStack(alignment: .bottom) {
                            TransferMap(from: booking.pickup_point, to: booking.dropoff_point, route: route.route, driver: booking.closed ? nil : journeys.position, follow: follow)
                            HStack { if route.route != nil || route.loading { RouteMetrics(route: route) }; Spacer(); if journeys.position != nil { Button { follow.toggle() } label: { Image(systemName: follow ? "arrow.up.left.and.arrow.down.right" : "location.fill").font(.headline).frame(width: 44, height: 44).background(.regularMaterial, in: Circle()) }.accessibilityLabel(follow ? "Show full route" : "Follow driver") } }.padding(20).padding(.bottom, 15)
                        }.frame(height: max(210, geo.size.height * 0.44))
                        ScrollView {
                            VStack(alignment: .leading, spacing: 22) {
                                HStack { VStack(alignment: .leading, spacing: 6) { if booking.isTest { Text("TEST TRANSFER · NO CHARGE").font(.system(size: 9, weight: .heavy)).tracking(1.3).foregroundStyle(Brand.blue) }; Text(booking.phase).font(.system(size: 28, weight: .bold)).tracking(-0.9) }; Spacer() }.padding(.top, 25)
                                if !booking.closed { liveStatus }
                                RouteRail(from: booking.pickup_address ?? "Pickup", to: booking.dropoff_address ?? "Destination")
                                if let flight = booking.flight_number, !flight.isEmpty { Label("Flight \(flight)", systemImage: "airplane").font(.subheadline).foregroundStyle(.secondary) }
                                if let bags = booking.bags_checked { Label("\(bags) large suitcases · \(booking.bags_cabin ?? 0) cabin bags", systemImage: "suitcase.rolling").font(.subheadline).foregroundStyle(.secondary) }
                                if let pos = journeys.position, !booking.closed {
                                    HStack(spacing: 16) { Image(systemName: "person.crop.circle.fill").font(.system(size: 42)).foregroundStyle(Brand.blue.opacity(0.6)); VStack(alignment: .leading, spacing: 4) { Text(pos.driver_name ?? "Your driver").font(.headline); Text([pos.vehicle_name, pos.vehicle_plate].compactMap { $0 }.joined(separator: " · ")).font(.subheadline).foregroundStyle(.secondary) } }
                                }
                                HStack { Text("\(booking.passengers) \(booking.passengers == 1 ? "traveler" : "travelers") · \(booking.vehicle_class.capitalized)").font(.subheadline).foregroundStyle(.secondary); Spacer(); Text(booking.price).font(.title3.bold()) }
                                if let date = booking.pickupDate { Label(date.pickupLabel(in: booking.pickupTimeZone), systemImage: "calendar").font(.subheadline).foregroundStyle(.secondary) }
                                if booking.isTest, !booking.closed {
                                    Button("Cancel test transfer", role: .destructive) {
                                        busy = true
                                        Task { defer { busy = false }; do { try await Backend.client.rpc("cancel_test_ride", params: ["p_ride_id": booking.id.uuidString]).execute(); await journeys.refresh() } catch { self.error = error.localizedDescription } }
                                    }.font(.subheadline).disabled(busy)
                                }
                                if AppRole.isDriver, !booking.closed {
                                    if let phone = booking.customer_phone, let url = URL(string: "tel:\(phone.filter { $0.isNumber || $0 == "+" })"), !phone.isEmpty { Link(destination: url) { Label("Call \(booking.customer_name ?? "traveler")", systemImage: "phone") }.font(.headline) }
                                    HStack(spacing: 14) {
                                        Button { Task { do { if LocationService.shared.sharing == id { try await LocationService.shared.stopSharing() } else { try await LocationService.shared.startSharing(booking) } } catch { self.error = error.localizedDescription } } } label: { Label(LocationService.shared.sharing == id ? "Pause GPS" : "Share live GPS", systemImage: "location.fill") }.buttonStyle(.bordered)
                                        Button("Navigate", systemImage: "arrow.triangle.turn.up.right.diamond") { let point = booking.journey_stage == "on_trip" ? booking.dropoff_point : booking.pickup_point; if let point { MKMapItem(placemark: MKPlacemark(coordinate: point.coordinate)).openInMaps(launchOptions: [MKLaunchOptionsDirectionsModeKey: MKLaunchOptionsDirectionsModeDriving]) } }.buttonStyle(.bordered)
                                    }.font(.caption.weight(.semibold))
                                    if let message = LocationService.shared.error { Notice(text: message, error: true) }
                                    if let action = booking.nextAction { PrimaryButton(title: action.title, busy: busy, dark: true) { if action.action == "complete" { confirmComplete = true } else { advance(booking) } } }
                                }
                                if let error = error ?? journeys.error ?? route.error { Notice(text: error, error: true) }
                            }.padding(.horizontal, 24).padding(.bottom, 25)
                        }.background(.white, in: UnevenRoundedRectangle(topLeadingRadius: 28, topTrailingRadius: 28)).padding(.top, -18)
                    }
                }
                .task(id: routeKey) { await route.calculate(from: routingOrigin, to: routingDestination, allowShortRoute: true) }
                .confirmationDialog("Complete this transfer?", isPresented: $confirmComplete, titleVisibility: .visible) { Button("Complete transfer") { advance(booking) } }
                .toolbar { BrandToolbarItem(); ToolbarItem(placement: .topBarTrailing) { Button("Close", systemImage: "xmark") { dismiss() }.labelStyle(.iconOnly) } }
            } else { ContentUnavailableView("Transfer unavailable", systemImage: "exclamationmark.circle", description: Text("Refresh your transfers and try again.")) }
        }
    }
    private var liveStatus: some View {
        TimelineView(.periodic(from: .now, by: 1)) { context in
            let age = journeys.position?.date.map { context.date.timeIntervalSince($0) }
            let fresh = age != nil && age! < 20 && journeys.connected
            Label(fresh ? "Live driver location" : journeys.position == nil ? "Waiting for driver location" : "Last location · \(max(0, Int(age ?? 0)))s ago", systemImage: fresh ? "dot.radiowaves.left.and.right" : "clock").font(.caption.weight(.medium)).foregroundStyle(fresh ? Brand.blue : .secondary)
        }
    }
    private func advance(_ booking: Booking) { busy = true; Task { defer { busy = false }; do { try await journeys.advance(booking) } catch { self.error = error.localizedDescription } } }
}

struct AccountView: View {
    @Environment(AccountStore.self) private var account
    @Environment(JourneyStore.self) private var journeys
    @AppStorage("swift-onboarding-v1") private var onboarded = true
    @State private var auth = false
    var body: some View {
        NavigationStack {
            List {
                Section { VStack(alignment: .leading, spacing: 18) { Identity(); Text(account.profile?.full_name ?? "Make yourself at home.").font(.system(size: 28, weight: .bold)).tracking(-0.8); if let email = account.user?.email { Text(email).font(.subheadline).foregroundStyle(.secondary) } else { Button("Sign in to TransferAround") { auth = true }.buttonStyle(.borderedProminent) } }.padding(.vertical, 20) }.listRowBackground(Color.clear)
                if account.user != nil { Section("Notifications") { Label(PushService.shared.status, systemImage: "bell.badge").font(.subheadline); Button("Enable Apple notifications") { Task { await PushService.shared.register() } } } }
                if AppRole.isDriver { Section("Driver account") { LabeledContent("Approval", value: account.driver?.approval_status.capitalized ?? "Not submitted"); if account.driver?.approval_status != "approved" { Link("Complete driver onboarding", destination: PublicConfig.api.appendingPathComponent("driver/apply")) }; if journeys.testEnabled { Text("Test transfers are available for this testing account. Paid jobs still require driver approval.").font(.caption).foregroundStyle(.secondary) } } }
                Section { Button("Show introduction again") { onboarded = false }; Link("Privacy policy", destination: PublicConfig.api.appendingPathComponent("legal/privacy")); Link("Terms of service", destination: PublicConfig.api.appendingPathComponent("legal/terms")); Link("Contact support", destination: URL(string: "mailto:hello@transferaround.com")!) }
                if let error = account.error { Section { Text(error).foregroundStyle(.red).font(.caption) } }
                if account.user != nil { Section { Button("Sign out", role: .destructive) { Task { await account.signOut() } } } }
                Section { Text("\(AppRole.name)\nVersion \(Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "") (\(Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String ?? ""))").font(.caption).foregroundStyle(.secondary).frame(maxWidth: .infinity) }.listRowBackground(Color.clear)
            }.navigationTitle("Account").navigationBarTitleDisplayMode(.inline)
        }.sheet(isPresented: $auth) { AuthView() }
    }
}
