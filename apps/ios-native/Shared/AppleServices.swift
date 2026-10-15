import SwiftUI
import MapKit
import CoreLocation
import UserNotifications
import AuthenticationServices
import CryptoKit
import Supabase

@MainActor @Observable final class LocationService: NSObject, @preconcurrency CLLocationManagerDelegate {
    static let shared = LocationService()
    private let manager = CLLocationManager()
    var position: CLLocation?
    var error: String?
    var sharing: UUID?
    var sharingTest = false
    private var request: CheckedContinuation<CLLocation, Error>?
    private var lastSent = Date.distantPast
    private var publishing: Task<Void, Never>?
    override init() {
        super.init(); manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyBest
        manager.distanceFilter = kCLDistanceFilterNone
        manager.activityType = .automotiveNavigation
        manager.pausesLocationUpdatesAutomatically = false
    }
    func locate() async throws -> CLLocation {
        guard request == nil else { throw AppError.message("Location is already being requested.") }
        if manager.authorizationStatus == .denied || manager.authorizationStatus == .restricted {
            throw AppError.message("Allow location in Settings to use GPS, or choose a pickup address.")
        }
        return try await withCheckedThrowingContinuation { continuation in
            request = continuation
            if manager.authorizationStatus == .notDetermined { manager.requestWhenInUseAuthorization() }
            else { manager.requestLocation() }
        }
    }
    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        if manager.authorizationStatus == .authorizedWhenInUse || manager.authorizationStatus == .authorizedAlways {
            if request != nil { manager.requestLocation() }
        } else if manager.authorizationStatus == .denied || manager.authorizationStatus == .restricted {
            request?.resume(throwing: AppError.message("Location permission was not granted.")); request = nil
        }
    }
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        request?.resume(throwing: error); request = nil; self.error = error.localizedDescription
    }
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let fix = locations.last, fix.horizontalAccuracy >= 0, abs(fix.timestamp.timeIntervalSinceNow) < 60 else { return }
        position = fix; request?.resume(returning: fix); request = nil
        guard let id = sharing, Date().timeIntervalSince(lastSent) >= 3, publishing == nil else { return }
        lastSent = Date(); let test = sharingTest
        publishing = Task {
            defer { publishing = nil }
            do {
                guard sharing == id else { return }
                let user = try await Backend.client.auth.session.user
                guard sharing == id else { return }
                if test {
                    try await Backend.client.rpc("publish_test_trip_location", params: ["p_ride_id": AnyJSON.string(id.uuidString), "p_lat": .double(fix.coordinate.latitude), "p_lng": .double(fix.coordinate.longitude), "p_heading": .double(max(0, fix.course)), "p_captured_at": .string(ISO8601DateFormatter().string(from: fix.timestamp))]).execute()
                } else {
                    try await Backend.client.from("trip_locations").upsert([
                        "booking_id": AnyJSON.string(id.uuidString), "driver_id": .string(user.id.uuidString),
                        "latitude": .double(fix.coordinate.latitude), "longitude": .double(fix.coordinate.longitude),
                        "heading": .double(max(0, fix.course)), "accuracy": .double(fix.horizontalAccuracy),
                        "speed": .double(max(0, fix.speed)), "captured_at": .string(ISO8601DateFormatter().string(from: fix.timestamp))
                    ], onConflict: "booking_id").execute()
                }
                error = nil
            } catch { self.error = "Location couldn’t be shared. \(error.localizedDescription)" }
        }
    }
    func startSharing(_ booking: Booking) async throws {
        guard AppRole.isDriver, !booking.closed else { return }
        _ = try await locate()
        sharing = booking.id; sharingTest = booking.isTest
        manager.allowsBackgroundLocationUpdates = true
        manager.showsBackgroundLocationIndicator = true
        manager.startUpdatingLocation()
        if manager.authorizationStatus == .authorizedWhenInUse { manager.requestAlwaysAuthorization() }
    }
    func stopSharing() async throws {
        let old = sharing; let test = sharingTest
        sharing = nil; manager.stopUpdatingLocation(); manager.allowsBackgroundLocationUpdates = false
        // Drain the last write before deletion so a paused trip cannot reappear.
        await publishing?.value
        if let old {
            if test { try await Backend.client.rpc("stop_test_trip_location", params: ["p_ride_id": old.uuidString]).execute() }
            else { try await Backend.client.from("trip_locations").delete().eq("booking_id", value: old).execute() }
        }
    }
}

@MainActor @Observable final class RouteService {
    var route: MKRoute?
    var loading = false
    var error: String?
    private var directions: MKDirections?
    private var generation = 0
    func calculate(from: CLLocationCoordinate2D?, to: CLLocationCoordinate2D?, allowShortRoute: Bool = false) async {
        generation += 1; let revision = generation
        directions?.cancel(); route = nil; error = nil
        guard let from, let to else { loading = false; return }
        guard CLLocation(latitude: from.latitude, longitude: from.longitude).distance(from: .init(latitude: to.latitude, longitude: to.longitude)) >= 50 else {
            error = allowShortRoute ? nil : "Choose a different destination, at least 50 meters from pickup."; loading = false; return
        }
        loading = true
        let request = MKDirections.Request()
        request.source = MKMapItem(placemark: MKPlacemark(coordinate: from))
        request.destination = MKMapItem(placemark: MKPlacemark(coordinate: to))
        request.transportType = .automobile; request.requestsAlternateRoutes = false
        let task = MKDirections(request: request); directions = task
        do {
            let response = try await task.calculate()
            guard revision == generation else { return }
            route = response.routes.first
            if route == nil { error = "A driving route isn’t available for these points." }
        } catch { if revision == generation { self.error = "Couldn’t load the road route. Try again." } }
        if revision == generation { loading = false }
    }
    var distance: String { guard let route else { return "—" }; return (route.distance / 1000).formatted(.number.precision(.fractionLength(1))) + " km" }
    var duration: String { guard let route else { return "—" }; return "~\(max(1, Int(ceil(route.expectedTravelTime / 60)))) min" }
}

@MainActor @Observable final class PushService: NSObject, UNUserNotificationCenterDelegate {
    static let shared = PushService()
    var selectedBooking: UUID?
    var selectedTest = false
    var notificationError: String?
    var status = "Notifications not enabled"
    private var token: String?
    func configure() {
        let center = UNUserNotificationCenter.current(); center.delegate = self
        let accept = UNNotificationAction(identifier: "ACCEPT_RIDE", title: "Accept transfer", options: [.foreground, .authenticationRequired])
        let view = UNNotificationAction(identifier: "VIEW_RIDE", title: "View offer", options: .foreground)
        center.setNotificationCategories([UNNotificationCategory(identifier: "TRANSFER_OFFER", actions: [accept, view], intentIdentifiers: [], options: [])])
    }
    func register() async {
        do {
            guard try await UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) else { status = "Enable notifications in Settings to receive offers"; return }
            UIApplication.shared.registerForRemoteNotifications()
        } catch { status = error.localizedDescription }
    }
    func receivedToken(_ data: Data) async {
        let value = data.map { String(format: "%02x", $0) }.joined(); token = value
        do {
            let user = try await Backend.client.auth.session.user
            #if DEBUG
            let environment = "sandbox"
            #else
            let environment = "production"
            #endif
            try await Backend.client.from("native_device_tokens").upsert([
                "user_id": user.id.uuidString, "token": value, "topic": Bundle.main.bundleIdentifier!,
                "environment": environment, "role": AppRole.role
            ], onConflict: "token,topic").execute()
            status = "Apple notifications enabled"
        } catch {
            status = "Notification registration needs a retry"
            #if DEBUG
            let message = (error as? PostgrestError).map { "\($0.code ?? "unknown"): \($0.message)" } ?? String(describing: type(of: error))
            let path = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("qa-push-diagnostic.txt")
            try? "token_length=\(value.count)\n\(message)".write(to: path, atomically: true, encoding: .utf8)
            #endif
        }
    }
    func unregister() async throws {
        if let token { try await Backend.client.from("native_device_tokens").delete().eq("token", value: token).eq("topic", value: Bundle.main.bundleIdentifier!).execute() }
        token = nil
    }
    nonisolated func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification) async -> UNNotificationPresentationOptions { [.banner, .sound, .list] }
    nonisolated func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse) async {
        let info = response.notification.request.content.userInfo
        let id = (info["bookingId"] as? String).flatMap(UUID.init(uuidString:))
        let test = info["isTest"] as? Bool ?? false
        if response.actionIdentifier == "ACCEPT_RIDE", let raw = info["offerId"] as? String, let offer = UUID(uuidString: raw) {
            do {
                if test { try await Backend.client.rpc("respond_to_test_ride", params: ["p_offer_id": AnyJSON.string(offer.uuidString), "p_accept": .bool(true)]).execute() }
                else { try await Backend.client.rpc("respond_to_offer", params: ["p_offer_id": AnyJSON.string(offer.uuidString), "p_accept": .bool(true)]).execute() }
                await MainActor.run { self.notificationError = nil }
            } catch { await MainActor.run { self.notificationError = "This offer could not be accepted. It may have expired or another driver accepted it." } }
        }
        await MainActor.run { self.selectedBooking = id; self.selectedTest = test }
    }
}

final class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) { Task { await PushService.shared.receivedToken(deviceToken) } }
    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) { Task { @MainActor in PushService.shared.status = "Apple notification registration failed. Try again from Account." } }
}

enum AppleNonce {
    static func make() -> String {
        var bytes = [UInt8](repeating: 0, count: 32)
        precondition(SecRandomCopyBytes(kSecRandomDefault, bytes.count, &bytes) == errSecSuccess)
        return bytes.map { String(format: "%02x", $0) }.joined()
    }
    static func hash(_ raw: String) -> String { SHA256.hash(data: Data(raw.utf8)).map { String(format: "%02x", $0) }.joined() }
}
