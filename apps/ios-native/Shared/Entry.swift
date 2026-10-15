import SwiftUI

@main struct TransferAroundApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate
    @State private var account = AccountStore()
    @State private var journeys = JourneyStore()
    @AppStorage("swift-onboarding-v1") private var onboarded = false
    @Environment(\.scenePhase) private var scenePhase
    var body: some Scene {
        WindowGroup {
            Group {
                if !onboarded { OnboardingView { withAnimation { onboarded = true } } }
                else { RootView() }
            }
            .environment(account).environment(journeys).tint(Brand.blue).preferredColorScheme(.light)
            .task { PushService.shared.configure(); account.start() }
            .task(id: account.user?.id) { await journeys.connect(user: account.user?.id) }
            .onOpenURL { url in Task {
                do {
                    if url.host == "auth" { try await Backend.client.auth.session(from: url) }
                    await journeys.refresh()
                    if url.host == "bookings", let id = UUID(uuidString: url.lastPathComponent), let ride = journeys.bookings.first(where: { $0.id == id }) { await journeys.select(ride) }
                } catch { account.error = error.localizedDescription }
            } }
            .onChange(of: scenePhase) { _, phase in if phase == .active { Task { await journeys.refresh() } } }
        }
    }
}

struct RootView: View {
    @Environment(AccountStore.self) private var account
    @Environment(JourneyStore.self) private var journeys
    @State private var tab = 0
    @State private var showAuth = false
    var body: some View {
        TabView(selection: $tab) {
            Group {
                #if DRIVER
                DriverHomeView()
                #else
                TravelerHomeView()
                #endif
            }
                .tabItem { Label(AppRole.isDriver ? "Drive" : "Book", systemImage: "location.fill") }.tag(0)
            TripsView().tabItem { Label(AppRole.isDriver ? "Transfers" : "Trips", systemImage: "point.topleft.down.to.point.bottomright.curvepath") }.tag(1)
            AccountView().tabItem { Label("Account", systemImage: "person.crop.circle") }.tag(2)
        }
        .sheet(item: Binding(get: { journeys.active }, set: { journeys.active = $0 })) { booking in JourneyView(id: booking.id) }
        .onChange(of: PushService.shared.selectedBooking) { _, id in
            guard let id else { return }; tab = AppRole.isDriver ? 0 : 1
            if AppRole.isDriver { journeys.setTestMode(PushService.shared.selectedTest) }
            Task { await journeys.refresh(); if let ride = journeys.bookings.first(where: { $0.id == id }) { await journeys.select(ride) }; PushService.shared.selectedBooking = nil }
        }
    }
}

struct OnboardingView: View {
    var complete: () -> Void
    @State private var page = 0
    @State private var appeared = false
    @Environment(\.accessibilityReduceMotion) private var reducedMotion
    private var titles: [String] { AppRole.isDriver ? ["Your next chapter.\nIn motion.", "The right transfer.\nAt the right time.", "A smoother arrival.\nTogether."] : ["Land. Breathe.\nWe’ll take it from here.", "Your journey.\nBeautifully simple.", "Every turn.\nRight there with you."] }
    private var subtitles: [String] { AppRole.isDriver ? ["A calmer way to manage your transfers, from the first offer to the final arrival.", "Clear pickup details, transparent offers and one tap to accept an available transfer.", "Share your live position during the trip. Your traveler knows when you’re arriving."] : ["Private transfers that make arriving feel like part of the holiday.", "Choose your pickup, see the road ahead and find the right ride for your people.", "Follow your assigned driver on a live map, from pickup to your destination."] }
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack { Identity(); Spacer(); Button("Skip", action: complete).font(.subheadline.weight(.medium)).foregroundStyle(.secondary) }.padding(.horizontal, 26).padding(.top, 18)
            ZStack {
                Circle().fill(Brand.mist).frame(width: 290, height: 290).scaleEffect(appeared ? 1 : 0.88)
                Circle().stroke(Brand.blue.opacity(0.12), style: StrokeStyle(lineWidth: 1, dash: [4, 7])).frame(width: 330, height: 330).rotationEffect(.degrees(appeared ? 20 : 0))
                Image(AppRole.isDriver ? "IdentityDriver" : "IdentityTraveler").resizable().scaledToFit().frame(width: 156, height: 156).clipShape(RoundedRectangle(cornerRadius: 43)).rotationEffect(.degrees(page == 1 ? -8 : 0)).shadow(color: Brand.blue.opacity(0.12), radius: 30, y: 20)
                Label(page == 0 ? "You’re in good hands" : page == 1 ? "A little less effort" : "Connected, all the way", systemImage: page == 2 ? "location.fill" : "checkmark.circle.fill").font(.caption.weight(.semibold)).padding(13).background(.white, in: Capsule()).offset(y: 130).shadow(color: .black.opacity(0.05), radius: 10, y: 4)
            }.frame(maxWidth: .infinity, maxHeight: .infinity).accessibilityHidden(true)
            VStack(alignment: .leading, spacing: 18) {
                HStack(spacing: 6) { ForEach(0..<3) { index in Capsule().fill(index == page ? Brand.blue : Color.black.opacity(0.12)).frame(width: index == page ? 27 : 6, height: 6) } }.padding(.bottom, 5)
                Text(titles[page]).font(.system(size: 37, weight: .bold)).tracking(-1.6).fixedSize(horizontal: false, vertical: true).id("title\(page)").transition(.opacity)
                Text(subtitles[page]).font(.body).foregroundStyle(.secondary).lineSpacing(4).fixedSize(horizontal: false, vertical: true)
                PrimaryButton(title: page == 2 ? "Let’s go" : "Continue", dark: AppRole.isDriver) { if page == 2 { complete() } else { withAnimation(reducedMotion ? nil : .smooth) { page += 1 } } }.padding(.top, 17)
            }.padding(.horizontal, 26).padding(.bottom, 30)
        }.background(.white).onAppear { withAnimation(reducedMotion ? nil : .easeOut(duration: 0.9)) { appeared = true } }
    }
}
