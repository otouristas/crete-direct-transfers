import SwiftUI

struct DriverHomeView: View {
    @Environment(AccountStore.self) private var account
    @Environment(JourneyStore.self) private var journeys
    @State private var auth = false
    private var test: Bool { journeys.driverTestMode }
    @State private var busy = false
    @State private var error: String?
    private var online: Bool { test ? journeys.testOnline : account.driver?.is_online ?? false }
    private var visibleOffers: [JobOffer] { journeys.offers.filter { ($0.is_test == true) == test } }
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    HStack { Identity(); Spacer(); Circle().fill(online ? Color.green : Color.gray.opacity(0.4)).frame(width: 9, height: 9) }.padding(.top, 10)
                    if visibleOffers.isEmpty {
                        Text(online ? "Ready for\nwhat’s next." : "A good day\nstarts here.").font(.system(size: 40, weight: .bold)).tracking(-1.8).padding(.top, 12)
                        Text(online ? "You’re available. New offers will appear here." : "Go online when you’re ready to take a transfer.").foregroundStyle(.secondary).lineSpacing(4)
                    } else { Text("An offer for you.").font(.system(size: 30, weight: .bold)).tracking(-1) }
                    if account.user == nil { PrimaryButton(title: "Sign in to drive", dark: true) { auth = true } }
                    else {
                        if journeys.testEnabled { Picker("Transfer mode", selection: Binding(get: { test }, set: { journeys.setTestMode($0) })) { Text("Paid transfers").tag(false); Text("Test transfers").tag(true) }.pickerStyle(.segmented) }
                        if test && visibleOffers.isEmpty { Notice(text: "Test transfers only. No fare, payout or charge is created. Turn on availability before the traveler confirms demo payment.") }
                        if !test && account.driver?.approval_status != "approved" {
                            VStack(alignment: .leading, spacing: 14) { Label("Your driver account is being prepared", systemImage: "checkmark.shield").font(.headline); Text("Complete your vehicle and verification details to become eligible for paid transfers.").font(.subheadline).foregroundStyle(.secondary); Link("Continue driver onboarding", destination: PublicConfig.api.appendingPathComponent("driver/apply")).font(.subheadline.bold()) }.padding(22).background(.white, in: RoundedRectangle(cornerRadius: 24))
                        } else if visibleOffers.isEmpty {
                            PrimaryButton(title: online ? "Go offline" : "Go online", systemImage: "power", busy: busy, dark: true) {
                                busy = true; Task { defer { busy = false }; do { try await journeys.online(!online, test: test); await account.refresh() } catch { self.error = error.localizedDescription } }
                            }
                        }
                    }
                    HStack { Text("NEW OFFERS").font(.system(size: 10, weight: .bold)).tracking(1.7).foregroundStyle(.secondary); Spacer(); if journeys.connected { Label("Connected", systemImage: "dot.radiowaves.left.and.right").font(.caption2).foregroundStyle(Brand.blue) } }
                    let offers = visibleOffers
                    if offers.isEmpty { VStack(spacing: 16) { Image(systemName: "sparkle.magnifyingglass").font(.system(size: 32, weight: .light)).foregroundStyle(Brand.blue); Text(online ? "We’ll let you know." : "Your next transfer is ahead.").font(.headline); Text(online ? "Keep notifications on. You can leave the app open or use other apps while you wait." : "Go online to receive available offers.").font(.subheadline).foregroundStyle(.secondary).multilineTextAlignment(.center) }.frame(maxWidth: .infinity).padding(32).background(.white, in: RoundedRectangle(cornerRadius: 26)) }
                    ForEach(offers) { offer in OfferCard(offer: offer) }
                    if let active = journeys.bookings.first(where: { !$0.closed }) { Text("YOUR ACTIVE TRANSFER").font(.system(size: 10, weight: .bold)).tracking(1.7).foregroundStyle(.secondary); Button { Task { await journeys.select(active) } } label: { TripCard(booking: active) }.buttonStyle(.plain) }
                    if let error = error ?? journeys.error { Notice(text: error, error: true) }
                    if let error = PushService.shared.notificationError { Notice(text: error, error: true) }
                }.padding(24)
            }.background(Brand.canvas).sensoryFeedback(.selection, trigger: visibleOffers.count).refreshable { await account.refresh(); await journeys.refresh() }.toolbar(.hidden, for: .navigationBar)
        }.sheet(isPresented: $auth) { AuthView() }
    }
}

struct OfferCard: View {
    var offer: JobOffer
    @Environment(JourneyStore.self) private var journeys
    @State private var busy = false
    @State private var error: String?
    var body: some View {
        TimelineView(.periodic(from: .now, by: 1)) { context in
            let remaining = max(0, Int(offer.expiry.timeIntervalSince(context.date)))
            VStack(alignment: .leading, spacing: 22) {
                HStack { VStack(alignment: .leading, spacing: 4) { if offer.is_test == true { Text("TEST TRANSFER").font(.system(size: 9, weight: .heavy)).tracking(1.3).foregroundStyle(Brand.blue) }; Text(offer.price).font(.system(size: 30, weight: .bold)).tracking(-1) }; Spacer(); Text(remaining > 0 ? "\(remaining)s" : "Expired").monospacedDigit().font(.headline).padding(12).background(remaining < 20 ? Color.orange.opacity(0.1) : Brand.mist, in: Circle()).foregroundStyle(remaining < 20 ? .orange : Brand.blue) }
                RouteRail(from: offer.pickup_address ?? "Pickup", to: offer.dropoff_address ?? "Destination")
                if let date = ISO8601DateFormatter.parse(offer.pickup_at) { Label(date.formatted(date: .abbreviated, time: .shortened), systemImage: "calendar").font(.caption).foregroundStyle(.secondary) }
                HStack(spacing: 14) { Button("Decline") { respond(false) }.font(.subheadline.weight(.semibold)).foregroundStyle(.secondary).frame(width: 75); PrimaryButton(title: "Accept transfer", systemImage: "checkmark", busy: busy, disabled: remaining == 0, dark: true) { respond(true) } }
                if let error { Text(error).font(.caption).foregroundStyle(.red) }
            }.padding(22).background(.white, in: RoundedRectangle(cornerRadius: 25)).overlay(RoundedRectangle(cornerRadius: 25).stroke(Brand.blue.opacity(0.2)))
        }
    }
    private func respond(_ accept: Bool) { busy = true; Task { defer { busy = false }; do { try await journeys.accept(offer, accept: accept) } catch { self.error = error.localizedDescription; await journeys.refresh() } } }
}
