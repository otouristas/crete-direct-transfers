import SwiftUI
import MapKit
import Supabase

@MainActor @Observable final class BookingDraft {
    var from: Place?
    var to: Place?
    var vehicle = Vehicle.economy
    var pickup = Date().addingTimeInterval(3600)
    var passengers = 1
    var bags = 0
    var flightNumber = ""
    var name = ""
    var phone = ""
    var fare: Fare?
    var pricing = false
    var error: String?
    var busy = false
    var test = false
    var requestID = UUID()
    var checkoutToken = AppleNonce.make()
    var priceLabel: String { guard let cents = fare?.priceCents else { return "—" }; return (Double(cents) / 100).formatted(.currency(code: "EUR")) }
    var quoteKey: String { "\(from?.id ?? ""):\(to?.id ?? ""):\(vehicle.rawValue):\(pickup.timeIntervalSince1970)" }
    var routeKey: String { "\(from?.lat ?? 0):\(from?.lng ?? 0):\(to?.lat ?? 0):\(to?.lng ?? 0)" }
    var timeZone: TimeZone { TimeZone(identifier: from?.countryCode == "ES" ? "Europe/Madrid" : from?.countryCode == "IT" ? "Europe/Rome" : "Europe/Athens")! }
    func quote() async {
        fare = nil; error = nil
        guard let from, let to else { return }
        pricing = true; defer { if !Task.isCancelled { pricing = false } }
        do {
            try await Task.sleep(for: .milliseconds(280))
            let result: Fare = try await Backend.post("api/places/quote", body: ["service": "transfer", "from": Backend.dictionary(from), "to": Backend.dictionary(to), "vehicleClass": vehicle.rawValue, "pickupAt": ISO8601DateFormatter().string(from: pickup)])
            guard !Task.isCancelled else { return }; fare = result
        } catch { if !Task.isCancelled { self.error = "Couldn’t calculate this fare. Please try again." } }
    }
    func checkout(email: String) async throws -> (UUID, URL) {
        guard let from, let to, let price = fare?.priceCents else { throw AppError.message("Select a pickup, destination and available fare.") }
        guard name.trimmingCharacters(in: .whitespaces).count >= 2, phone.filter(\.isNumber).count >= 5 else { throw AppError.message("Enter your name and a valid contact phone number.") }
        guard pickup > Date() else { throw AppError.message("Choose a future pickup time.") }
        struct Result: Decodable { var bookingId: UUID; var url: URL }
        let result: Result = try await Backend.post("api/bookings/checkout", body: ["requestId": requestID.uuidString, "checkoutToken": checkoutToken, "service": "transfer", "from": Backend.dictionary(from), "to": Backend.dictionary(to), "vehicleClass": vehicle.rawValue, "passengers": passengers, "bagsChecked": bags, "bagsCabin": 0, "flightNumber": flightNumber, "pickupAt": ISO8601DateFormatter().string(from: pickup), "customerName": name, "customerPhone": phone, "customerEmail": email, "expectedPriceCents": price, "locale": "en"], authenticated: true)
        return (result.bookingId, result.url)
    }
    func testBooking() async throws -> Booking {
        guard let from, let to, let price = fare?.priceCents else { throw AppError.message("Choose your route and wait for the fare.") }
        let params: [String: AnyJSON] = [
            "p_request_id": .string(requestID.uuidString), "p_from": .object(["lat": .double(from.lat), "lng": .double(from.lng)]),
            "p_to": .object(["lat": .double(to.lat), "lng": .double(to.lng)]), "p_pickup_address": .string(from.label), "p_dropoff_address": .string(to.label),
            "p_pickup_at": .string(ISO8601DateFormatter().string(from: pickup)), "p_vehicle_class": .string(vehicle.rawValue),
            "p_passengers": .integer(passengers), "p_price_cents": .integer(price), "p_bags_checked": .integer(bags), "p_flight_number": .string(flightNumber)
        ]
        let ride: Booking = try await Backend.client.rpc("create_test_ride", params: params).execute().value
        // The transfer and per-device outbox are committed first. This wakes the
        // trusted sender; its retry scheduler continues if the request is lost.
        struct Flush: Decodable { var ok: Bool }
        let _: Flush? = try? await Backend.post("api/notifications/flush", body: ["bookingId": ride.id.uuidString, "isTest": true], authenticated: true)
        return ride
    }
}

struct TravelerHomeView: View {
    @Environment(AccountStore.self) private var account
    @Environment(JourneyStore.self) private var journeys
    @State private var draft = BookingDraft()
    @State private var route = RouteService()
    @State private var searchTarget: PlaceTarget?
    @State private var pinTarget: PlaceTarget?
    @State private var auth = false
    @State private var details = false
    @State private var wallet = false
    @State private var completedDemo: Booking?
    @State private var gpsBusy = false
    @State private var expandedMap = false
    @State private var showAI = false
    @Environment(\.openURL) private var openURL
    var body: some View {
        GeometryReader { geometry in
            VStack(spacing: 0) {
                ZStack(alignment: .top) {
                    TransferMap(from: draft.from.map { Point(lat: $0.lat, lng: $0.lng) }, to: draft.to.map { Point(lat: $0.lat, lng: $0.lng) }, route: route.route, onTap: { coordinate in
                        guard let target = pinTarget else { return }
                        Task { await setPin(coordinate, target: target) }
                    })
                    VStack(spacing: 18) {
                        HStack {
                            BrandIcon(size: 46)
                            Spacer()
                            Button { Task { await useGPS() } } label: { Group { if gpsBusy { ProgressView() } else { Image(systemName: "location.fill").font(.title3) } }.frame(width: 48, height: 48).background(.regularMaterial, in: Circle()) }.accessibilityLabel("Use GPS for pickup").disabled(gpsBusy)
                        }
                        if pinTarget != nil { HStack { Label("Tap the map to set \(pinTarget == .pickup ? "pickup" : "destination")", systemImage: "mappin"); Spacer(); Button { pinTarget = nil } label: { Image(systemName: "xmark") } }.font(.subheadline.weight(.semibold)).foregroundStyle(.white).padding(15).background(Brand.blue, in: RoundedRectangle(cornerRadius: 16)) }
                        Spacer(minLength: 0)
                        if route.route != nil || route.loading { RouteMetrics(route: route).padding(.bottom, 30) }
                    }.padding(.horizontal, 20).padding(.top, 8)
                }.frame(height: max(220, geometry.size.height * (expandedMap ? 0.65 : 0.43)))
                VStack(alignment: .leading, spacing: 0) {
                    Button { withAnimation(.spring(response: 0.42, dampingFraction: 0.88)) { expandedMap.toggle() } } label: { Capsule().fill(.quaternary).frame(width: 36, height: 4).frame(maxWidth: .infinity).padding(.top, 12).padding(.bottom, 17).contentShape(Rectangle()) }
                        .buttonStyle(.plain).accessibilityLabel(expandedMap ? "Expand booking details" : "Expand map")
                        .gesture(DragGesture(minimumDistance: 15).onEnded { value in withAnimation(.spring(response: 0.42, dampingFraction: 0.88)) { expandedMap = value.translation.height > 0 } })
                    ScrollView {
                        VStack(alignment: .leading, spacing: 20) {
                            Text(details ? "Make it yours." : "Where are we taking you?").font(.system(size: 27, weight: .bold)).tracking(-1)
                            if !details {
                                Button { showAI = true } label: {
                                    HStack(spacing: 13) { Image(systemName: "sparkles").font(.title3).foregroundStyle(Brand.blue); VStack(alignment: .leading, spacing: 3) { Text("Ride with AI").font(.headline); Text("Tell us your plans. We’ll find the fit.").font(.caption).foregroundStyle(.secondary) }; Spacer(); Image(systemName: "arrow.up.right").font(.subheadline) }.padding(17).foregroundStyle(Brand.ink).background(Brand.mist, in: RoundedRectangle(cornerRadius: 20))
                                }.buttonStyle(.plain)
                                VStack(spacing: 0) {
                                    placeButton(.pickup, place: draft.from, title: "Pickup location")
                                    Divider().padding(.leading, 48)
                                    placeButton(.destination, place: draft.to, title: "Where to?")
                                }.background(Brand.canvas, in: RoundedRectangle(cornerRadius: 20))
                                HStack(spacing: 12) {
                                    Button { pinTarget = draft.from == nil ? .pickup : .destination } label: { Label("Pin on map", systemImage: "mappin.and.ellipse") }
                                    Button { Task { await useGPS() } } label: { Label("Use my location", systemImage: "location.fill") }
                                }.font(.caption.weight(.semibold)).buttonStyle(.bordered).tint(Brand.blue)
                                if draft.from == nil && draft.to == nil {
                                    Text("START WITH AN AIRPORT").font(.system(size: 10, weight: .bold)).tracking(1.7).foregroundStyle(.secondary).padding(.top, 2)
                                    ForEach([Place.chaniaAirport, .heraklionAirport, .athensAirport]) { place in
                                        Button { draft.from = place; searchTarget = .destination } label: { HStack(spacing: 13) { Image(systemName: "airplane").frame(width: 42, height: 42).background(Brand.canvas, in: Circle()); Text(place.label).font(.subheadline.weight(.medium)); Spacer(); Image(systemName: "chevron.right").font(.caption.bold()).foregroundStyle(.tertiary) }.foregroundStyle(Brand.ink) }.buttonStyle(.plain)
                                    }
                                }
                                if draft.from != nil && draft.to != nil { vehicles }
                            } else { bookingDetails }
                            if let error = route.error { Notice(text: error, error: true) }
                        }.padding(.horizontal, 22).padding(.bottom, 24)
                    }.scrollDismissesKeyboard(.interactively)
                }.background(.white, in: UnevenRoundedRectangle(topLeadingRadius: 30, topTrailingRadius: 30)).padding(.top, -24)
            }
        }
        .background(.white)
        .safeAreaInset(edge: .bottom, spacing: 0) {
            VStack(spacing: 9) {
                if let error = draft.error { Text(error).font(.caption).foregroundStyle(.red).frame(maxWidth: .infinity, alignment: .leading).accessibilityAddTraits(.isStaticText) }
                HStack(spacing: 20) {
                    if draft.from != nil && draft.to != nil { VStack(alignment: .leading, spacing: 2) { Text("Trip total").font(.caption).foregroundStyle(.secondary); Text(draft.priceLabel).font(.title3.bold()) }.fixedSize() }
                    PrimaryButton(title: details ? (draft.test ? "Demo payment" : "Continue to payment") : "Choose your transfer", busy: draft.busy || draft.pricing, disabled: draft.from == nil || draft.to == nil || route.route == nil || draft.fare?.priceCents == nil) {
                        if !details { withAnimation(.smooth) { details = true }; fillContact() }
                        else if account.user == nil { auth = true }
                        else if draft.test { wallet = true }
                        else { pay() }
                    }
                }
            }.padding(.horizontal, 22).padding(.vertical, 12).background(.white.shadow(.drop(color: .black.opacity(0.04), radius: 8, y: -3)))
        }
        .sheet(item: $searchTarget) { target in PlaceSearchView(target: target) { place in if target == .pickup { draft.from = place } else { draft.to = place }; details = false; pinTarget = nil } }
        .sheet(isPresented: $auth) { AuthView() }
        .sheet(isPresented: $showAI) { RideAIView { result in
            guard let offer = result.recommendation, let from = result.from, let to = result.to, let vehicle = Vehicle(rawValue: offer.vehicleClass), let date = ISO8601DateFormatter.parse(offer.pickupAt) else { return }
            draft.from = from; draft.to = to; draft.vehicle = vehicle; draft.pickup = date
            draft.passengers = result.intent.passengers ?? 1; draft.bags = result.intent.bags ?? 0; draft.flightNumber = result.intent.flightNumber ?? ""
            draft.requestID = UUID(); details = true; fillContact()
        } }
        .sheet(isPresented: $wallet, onDismiss: {
            if let ride = completedDemo { completedDemo = nil; Task { await journeys.refresh(); await journeys.select(ride) } }
        }) { DemoWalletView(amount: draft.priceLabel) {
            completedDemo = try await draft.testBooking()
            draft.requestID = UUID(); wallet = false
        } }
        .task(id: draft.quoteKey) { await draft.quote() }
        .task(id: draft.routeKey) { await route.calculate(from: draft.from?.coordinate, to: draft.to?.coordinate) }
        .onChange(of: account.profile?.id) { _, _ in fillContact() }
    }
    private var vehicles: some View {
        VStack(spacing: 10) {
            ForEach(Vehicle.allCases) { vehicle in
                Button { withAnimation(.snappy) { draft.vehicle = vehicle; draft.passengers = min(draft.passengers, vehicle.seats); draft.bags = min(draft.bags, vehicle.bags) } } label: {
                    HStack(spacing: 10) {
                        Image(vehicle.image).resizable().scaledToFit().frame(width: 100, height: 66)
                        VStack(alignment: .leading, spacing: 4) { Text(vehicle.title).font(.headline); Text("Up to \(vehicle.seats) travelers").font(.caption).foregroundStyle(.secondary) }
                        Spacer(minLength: 0)
                        Image(systemName: draft.vehicle == vehicle ? "checkmark.circle.fill" : "circle").foregroundStyle(draft.vehicle == vehicle ? Brand.blue : .gray.opacity(0.4)).font(.title3)
                    }.padding(12).foregroundStyle(Brand.ink).background(draft.vehicle == vehicle ? Brand.mist : .white, in: RoundedRectangle(cornerRadius: 20)).overlay(RoundedRectangle(cornerRadius: 20).stroke(draft.vehicle == vehicle ? Brand.blue : Color.black.opacity(0.08), lineWidth: draft.vehicle == vehicle ? 1.5 : 1))
                }.buttonStyle(.plain)
            }
        }
    }
    private var bookingDetails: some View {
        VStack(alignment: .leading, spacing: 22) {
            Button { withAnimation { details = false } } label: { Label("Edit route & vehicle", systemImage: "arrow.left") }.font(.subheadline.weight(.semibold))
            RouteRail(from: draft.from?.label ?? "Pickup", to: draft.to?.label ?? "Destination")
            HStack { Image(draft.vehicle.image).resizable().scaledToFit().frame(width: 108, height: 65); VStack(alignment: .leading) { Text(draft.vehicle.title).font(.headline); Text(draft.vehicle.subtitle).font(.caption).foregroundStyle(.secondary) }; Spacer() }
            DatePicker("Pickup", selection: $draft.pickup, in: Date()...).datePickerStyle(.compact).environment(\.timeZone, draft.timeZone)
            Text("Pickup time in \(draft.timeZone.identifier.replacingOccurrences(of: "Europe/", with: ""))").font(.caption).foregroundStyle(.secondary)
            Stepper("\(draft.passengers) \(draft.passengers == 1 ? "traveler" : "travelers")", value: $draft.passengers, in: 1...draft.vehicle.seats).font(.headline)
            Stepper("\(draft.bags) large suitcases", value: $draft.bags, in: 0...(draft.vehicle.bags)).font(.subheadline)
            TextField("Flight number (optional)", text: $draft.flightNumber).textInputAutocapitalization(.characters).autocorrectionDisabled().padding(17).background(Brand.canvas, in: RoundedRectangle(cornerRadius: 16))
            VStack(alignment: .leading, spacing: 8) { Text("Your name").font(.caption.weight(.medium)).foregroundStyle(.secondary); TextField("Full name", text: $draft.name).textContentType(.name).padding(17).background(Brand.canvas, in: RoundedRectangle(cornerRadius: 16)) }
            VStack(alignment: .leading, spacing: 8) { Text("Contact phone").font(.caption.weight(.medium)).foregroundStyle(.secondary); TextField("+30 …", text: $draft.phone).textContentType(.telephoneNumber).keyboardType(.phonePad).padding(17).background(Brand.canvas, in: RoundedRectangle(cornerRadius: 16)) }
            if journeys.testEnabled { Toggle(isOn: $draft.test) { VStack(alignment: .leading, spacing: 4) { Text("Test this transfer").font(.subheadline.bold()); Text("Demo payment · test driver offers · no charge").font(.caption).foregroundStyle(.secondary) } }.padding(16).background(Brand.mist, in: RoundedRectangle(cornerRadius: 18)) }
            Text(draft.test ? "A clearly marked test transfer will be sent to online test drivers. No money is collected." : "Pay securely online. Your transfer is sent to eligible drivers after payment is confirmed.").font(.caption).foregroundStyle(.secondary)
        }
    }
    private func placeButton(_ target: PlaceTarget, place: Place?, title: String) -> some View {
        Button { searchTarget = target } label: { HStack(spacing: 14) { Image(systemName: target == .pickup ? "circle.fill" : "square.fill").font(.system(size: 10)).foregroundStyle(target == .pickup ? Brand.blue : Brand.ink).frame(width: 15); Text(place?.label ?? title).foregroundStyle(place == nil ? .secondary : Brand.ink).lineLimit(2).multilineTextAlignment(.leading); Spacer(minLength: 0); Image(systemName: "chevron.right").font(.caption).foregroundStyle(.tertiary) }.font(.subheadline.weight(.medium)).padding(.horizontal, 17).frame(minHeight: 62) }.buttonStyle(.plain)
    }
    private func fillContact() { if draft.name.isEmpty { draft.name = account.profile?.full_name ?? "" }; if draft.phone.isEmpty { draft.phone = account.profile?.phone ?? "" } }
    private func useGPS() async {
        gpsBusy = true; defer { gpsBusy = false }
        do { let fix = try await LocationService.shared.locate(); await setPin(fix.coordinate, target: .pickup) }
        catch { draft.error = error.localizedDescription }
    }
    private func setPin(_ coordinate: CLLocationCoordinate2D, target: PlaceTarget) async {
        let locations = try? await CLGeocoder().reverseGeocodeLocation(.init(latitude: coordinate.latitude, longitude: coordinate.longitude))
        let p = locations?.first
        let label = [p?.name, p?.locality].compactMap { $0 }.joined(separator: ", ")
        let place = Place(id: "pin:\(coordinate.latitude),\(coordinate.longitude)", label: label.isEmpty ? "Pinned location" : label, lat: coordinate.latitude, lng: coordinate.longitude, countryCode: p?.isoCountryCode)
        if target == .pickup { draft.from = place } else { draft.to = place }; pinTarget = nil; details = false
    }
    private func pay() {
        draft.busy = true; draft.error = nil
        Task { defer { draft.busy = false }; do { let (_, url) = try await draft.checkout(email: account.user?.email ?? ""); guard url.scheme == "https" else { throw AppError.message("The payment link was invalid.") }; openURL(url) } catch { draft.error = error.localizedDescription } }
    }
}

enum PlaceTarget: String, Identifiable { case pickup, destination; var id: String { rawValue } }

struct PlaceSearchView: View {
    var target: PlaceTarget
    var choose: (Place) -> Void
    @Environment(\.dismiss) private var dismiss
    @State private var query = ""
    @State private var results: [Place] = []
    @State private var loading = false
    @State private var error: String?
    @FocusState private var focused: Bool
    var body: some View {
        NavigationStack {
            List {
                if loading { HStack { ProgressView(); Text("Searching places…").foregroundStyle(.secondary) } }
                if let error { Text(error).foregroundStyle(.secondary) }
                ForEach(query.isEmpty ? [Place.chaniaAirport, .heraklionAirport, .athensAirport, .chaniaTown] : results) { place in
                    Button { choose(place); dismiss() } label: { Label { VStack(alignment: .leading, spacing: 5) { Text(place.label).foregroundStyle(Brand.ink); Text(place.kind == "airport" ? "Airport" : "Address").font(.caption).foregroundStyle(.secondary) } } icon: { Image(systemName: place.kind == "airport" ? "airplane" : "mappin.circle").foregroundStyle(Brand.blue).frame(width: 28) }.padding(.vertical, 6) }
                }
                if !query.isEmpty && !loading && results.isEmpty && error == nil { ContentUnavailableView.search(text: query) }
            }.listStyle(.plain).searchable(text: $query, prompt: target == .pickup ? "Airport, hotel or pickup address" : "Where are you going?")
                .navigationTitle(target == .pickup ? "Your pickup" : "Your destination").navigationBarTitleDisplayMode(.inline)
                .toolbar { ToolbarItem(placement: .topBarTrailing) { Button("Done") { dismiss() } } }
        }
        .task(id: query) {
            guard query.count >= 2 else { results = []; return }
            loading = true; error = nil
            do {
                try await Task.sleep(for: .milliseconds(300))
                let request = MKLocalSearch.Request(); request.naturalLanguageQuery = query
                request.region = .init(center: LocationService.shared.position?.coordinate ?? .init(latitude: 35.44, longitude: 24.5), span: .init(latitudeDelta: 3, longitudeDelta: 5))
                let response = try await MKLocalSearch(request: request).start()
                guard !Task.isCancelled else { return }
                results = response.mapItems.map { item in let p = item.placemark; return Place(id: "apple:\(p.coordinate.latitude),\(p.coordinate.longitude):\(item.name ?? "")", label: [item.name, p.locality].compactMap { $0 }.joined(separator: ", "), lat: p.coordinate.latitude, lng: p.coordinate.longitude, countryCode: p.isoCountryCode) }
            } catch { if !Task.isCancelled { self.error = "Places couldn’t be loaded. Try a more specific address." } }
            if !Task.isCancelled { loading = false }
        }
    }
}

struct DemoWalletView: View {
    var amount: String
    var authorize: () async throws -> Void
    @Environment(\.dismiss) private var dismiss
    @State private var busy = false
    @State private var error: String?
    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 25) {
                Text("A real test.\nNo real charge.").font(.system(size: 32, weight: .bold)).tracking(-1)
                Notice(text: "Apple Pay demo · simulated payment. This does not open Wallet or charge a card.")
                VStack(alignment: .leading, spacing: 40) { HStack { Text("TRANSFERAROUND").font(.caption.bold()).tracking(2); Spacer(); Image(systemName: "wave.3.right") }; HStack { Text("Demo card •••• 4242").font(.subheadline); Spacer(); Text(amount).font(.title2.bold()) } }.foregroundStyle(.white).padding(25).background(Brand.ink, in: RoundedRectangle(cornerRadius: 25))
                Text("Your test transfer will appear in online test drivers’ offer lists. The first driver to accept gets the transfer.").foregroundStyle(.secondary)
                if let error { Notice(text: error, error: true) }
                Spacer()
                PrimaryButton(title: "Confirm demo payment", systemImage: "checkmark", busy: busy) { busy = true; Task { defer { busy = false }; do { try await authorize(); dismiss() } catch { self.error = error.localizedDescription } } }
            }.padding(26).navigationTitle("Demo payment").navigationBarTitleDisplayMode(.inline).toolbar { ToolbarItem(placement: .topBarTrailing) { Button("Cancel") { dismiss() }.disabled(busy) } }
        }
    }
}
