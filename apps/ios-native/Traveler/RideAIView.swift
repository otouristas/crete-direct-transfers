import SwiftUI
import MapKit

struct RideAIResult: Decodable {
    struct Intent: Codable {
        var reply: String
        var pickupDate: String?
        var pickupTime: String?
        var specialRequirements: String?
        var vehiclePreference: String?
        var useCurrentLocation: Bool
        var passengers: Int?
        var bags: Int?
        var flightNumber: String?
        var pickupQuery: String?
        var destinationQuery: String?
    }
    struct Recommendation: Decodable {
        var vehicleClass: String
        var title: String
        var priceCents: Int
        var distanceKm: Double?
        var durationMin: Double?
        var routeSource: String?
        var pickupAt: String
        var timeZone: String
    }
    var reply: String
    var questions: [String]
    var intent: Intent
    var from: Place?
    var to: Place?
    var pickupOptions: [Place]
    var destinationOptions: [Place]
    var recommendation: Recommendation?
}

struct RideAIView: View {
    var apply: (RideAIResult) -> Void
    @Environment(AccountStore.self) private var account
    @Environment(\.dismiss) private var dismiss
    @State private var input = ""
    @State private var messages: [[String: String]] = []
    @State private var result: RideAIResult?
    @State private var busy = false
    @State private var error: String?
    @State private var consent = false
    @State private var auth = false
    @State private var gps: Place?
    @State private var selectedFrom: Place?
    @State private var selectedTo: Place?
    @State private var selectedFromQuery: String?
    @State private var selectedToQuery: String?
    @FocusState private var focused: Bool
    var body: some View {
        NavigationStack {
            ScrollViewReader { proxy in
                ScrollView {
                    VStack(alignment: .leading, spacing: 22) {
                        BrandIcon(size: 52)
                        Text("Your plans.\nOur next move.").font(.system(size: 37, weight: .bold)).tracking(-1.4)
                        Text("Ride with AI").font(.headline).foregroundStyle(Brand.blue)
                        Text("Tell us where you’re landing, when, and who’s coming. We’ll help put your transfer together.").font(.body).foregroundStyle(.secondary)
                        if messages.isEmpty {
                            Button { input = "Tomorrow I’m landing at Heraklion Airport (HER) at 5pm, flight A3306. We’re 2 people with 2 suitcases, going to GDM Megaron hotel in Heraklion."; focused = true } label: {
                                VStack(alignment: .leading, spacing: 9) { Label("TRY A TRIP", systemImage: "airplane").font(.caption.bold()).tracking(1); Text("“Landing in Heraklion tomorrow. Two people, two bags, straight to our hotel.”").font(.subheadline).multilineTextAlignment(.leading) }.padding(19).frame(maxWidth: .infinity, alignment: .leading).foregroundStyle(Brand.ink).background(Brand.canvas, in: RoundedRectangle(cornerRadius: 22))
                            }.buttonStyle(.plain)
                        }
                        ForEach(Array(messages.enumerated()), id: \.offset) { _, message in
                            if message["role"] == "user" { Text(message["content"] ?? "").font(.subheadline).padding(17).frame(maxWidth: .infinity, alignment: .leading).background(Brand.mist, in: RoundedRectangle(cornerRadius: 18)) }
                        }
                        if let result {
                            Text(result.reply).font(.body).textSelection(.enabled)
                            ForEach(result.questions, id: \.self) { question in Label(question, systemImage: "questionmark.circle").font(.subheadline).foregroundStyle(.secondary) }
                            choices(result.pickupOptions, title: "Confirm your pickup", pickup: true)
                            choices(result.destinationOptions, title: "Confirm your destination", pickup: false)
                            if let offer = result.recommendation {
                                VStack(alignment: .leading, spacing: 18) {
                                    Label("YOUR TRANSFER PROPOSAL", systemImage: "checkmark.seal").font(.system(size: 10, weight: .bold)).tracking(1.4).foregroundStyle(Brand.blue)
                                    RouteRail(from: result.from?.label ?? "", to: result.to?.label ?? "")
                                    HStack {
                                        Image(Vehicle(rawValue: offer.vehicleClass)?.image ?? "VehicleSedan").resizable().scaledToFit().frame(width: 120, height: 76)
                                        VStack(alignment: .leading, spacing: 5) { Text(offer.title).font(.headline); Text("\(result.intent.passengers ?? 1) travelers · \(result.intent.bags ?? 0) bags").font(.caption).foregroundStyle(.secondary) }; Spacer()
                                    }
                                    if let date = ISO8601DateFormatter.parse(offer.pickupAt) { Text(date.pickupLabel(in: TimeZone(identifier: offer.timeZone)!)).font(.subheadline) }
                                    HStack { if let km = offer.distanceKm { Text(String(format:"%.1f km",km)) }; if let min = offer.durationMin { Text("~\(Int(ceil(min))) min") }; Spacer(); Text((Double(offer.priceCents)/100).formatted(.currency(code:"EUR"))).font(.title2.bold()) }.font(.subheadline)
                                    Text(offer.routeSource == "estimated" ? "Distance and time are estimates. Review the road route before payment." : "Fare calculated by TransferAround. Driver acceptance follows payment. Flight details have not been verified.").font(.caption).foregroundStyle(.secondary)
                                    PrimaryButton(title: "Review this transfer") { apply(result); dismiss() }
                                }.padding(20).background(.white, in: RoundedRectangle(cornerRadius: 24)).overlay(RoundedRectangle(cornerRadius: 24).stroke(Brand.blue.opacity(0.2), lineWidth: 1))
                            }
                        }
                        if busy { HStack(spacing: 10) { ProgressView(); Text("Putting your journey together…").font(.subheadline).foregroundStyle(.secondary) }.accessibilityElement(children: .combine) }
                        if let error { Notice(text: error, error: true) }
                        Color.clear.frame(height: 1).id("latest")
                    }.padding(24)
                }.scrollDismissesKeyboard(.interactively).onChange(of: busy) { _, _ in withAnimation { proxy.scrollTo("latest", anchor: .bottom) } }
            }
            .background(Brand.canvas.opacity(0.35))
            .safeAreaInset(edge: .bottom, spacing: 0) {
                VStack(alignment: .leading, spacing: 12) {
                    if !consent { Toggle(isOn: $consent) { Text("Send my trip messages to Anthropic to plan this ride. GPS is used by maps and booking; its coordinates aren’t sent to Claude.").font(.caption).foregroundStyle(.secondary) } }
                    HStack(alignment: .bottom, spacing: 12) {
                        TextField("Tell us your plans…", text: $input, axis: .vertical).lineLimit(2...5).focused($focused).padding(14).background(Brand.canvas, in: RoundedRectangle(cornerRadius: 18))
                        Button { Task { await send() } } label: { Image(systemName: "arrow.up").font(.headline).foregroundStyle(.white).frame(width: 48, height: 48).background(Brand.blue, in: Circle()) }.disabled(busy || input.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || !consent).accessibilityLabel("Plan my transfer")
                    }
                    HStack { Button { Task { do { let fix = try await LocationService.shared.locate(); gps = Place(id:"gps",label:"My location",lat:fix.coordinate.latitude,lng:fix.coordinate.longitude); input = input.isEmpty ? "Pick me up at my current location. " : input } catch { self.error = error.localizedDescription } } } label: { Label(gps == nil ? "Add GPS pickup" : "GPS pickup added", systemImage: "location.fill") }.font(.caption.weight(.semibold)); Spacer(); Text("Powered by Claude").font(.caption).foregroundStyle(.secondary) }
                }.padding(18).background(.white)
            }
            .navigationBarTitleDisplayMode(.inline).toolbar { ToolbarItem(placement: .topBarTrailing) { Button("Close", systemImage: "xmark") { dismiss() }.labelStyle(.iconOnly) } }
        }.sheet(isPresented: $auth) { AuthView() }
    }
    @ViewBuilder private func choices(_ options: [Place], title: String, pickup: Bool) -> some View {
        if !options.isEmpty {
            VStack(alignment: .leading, spacing: 10) {
                Text(title).font(.headline)
                ForEach(options) { place in Button { if pickup { selectedFrom = place; selectedFromQuery = result?.intent.pickupQuery } else { selectedTo = place; selectedToQuery = result?.intent.destinationQuery }; Task { await request(selection: true) } } label: { HStack { Image(systemName: "mappin.circle").foregroundStyle(Brand.blue); Text(place.label).font(.subheadline).multilineTextAlignment(.leading); Spacer(); Image(systemName:"chevron.right").font(.caption) }.padding(15).background(.white, in: RoundedRectangle(cornerRadius: 16)).foregroundStyle(Brand.ink) }.buttonStyle(.plain).disabled(busy) }
            }
        }
    }
    private func send() async {
        guard account.user != nil else { auth = true; return }
        let text = input.trimmingCharacters(in: .whitespacesAndNewlines)
        guard consent, !text.isEmpty, !busy else { return }
        guard messages.filter({ $0["role"] == "user" }).count < 5 else { error = "Start a new plan to continue, or review your transfer in the booking form."; return }
        messages.append(["role":"user","content":String(text.prefix(2400))]); input = ""; focused = false
        await request()
    }
    private func request(selection: Bool = false) async {
        guard !busy else { return }; busy = true; error = nil
        defer { busy = false }
        do {
            var body: [String:Any] = ["messages":messages,"locale":"en"]
            if selection, let intent = result?.intent {
                var encoded = try Backend.dictionary(intent)
                for key in ["pickupQuery", "destinationQuery", "pickupDate", "pickupTime", "passengers", "bags", "flightNumber", "specialRequirements", "vehiclePreference"] where encoded[key] == nil { encoded[key] = NSNull() }
                body["mode"] = "selection"; body["intent"] = encoded
            }
            if let gps { body["gps"] = try Backend.dictionary(gps) }
            if let selectedFrom { body["selectedFrom"] = try Backend.dictionary(selectedFrom); body["selectedFromQuery"] = selectedFromQuery }
            if let selectedTo { body["selectedTo"] = try Backend.dictionary(selectedTo); body["selectedToQuery"] = selectedToQuery }
            let next: RideAIResult = try await Backend.post("api/ride-ai", body:body,authenticated:true)
            result = next
            // Keep concise assistant context for follow-up extraction. Choices are
            // explicit traveler input and never become a booking automatically.
            if messages.last?["role"] == "user" { messages.append(["role":"assistant","content":next.reply+" "+next.questions.joined(separator:" ")]) }
        } catch { self.error = error.localizedDescription }
    }
}
