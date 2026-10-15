import Foundation
import Supabase
import AuthenticationServices

enum PublicConfig {
    private static let values = NSDictionary(contentsOf: Bundle.main.url(forResource: "PublicConfig", withExtension: "plist")!)!
    static let supabaseURL = URL(string: values["SupabaseURL"] as! String)!
    static let key = values["SupabasePublishableKey"] as! String
    static let api = URL(string: values["APIBaseURL"] as! String)!
}

enum Backend {
    static let client = SupabaseClient(supabaseURL: PublicConfig.supabaseURL, supabaseKey: PublicConfig.key,
                                      options: .init(auth: .init(redirectToURL: URL(string: "\(AppRole.scheme)://auth/callback")!)))

    static func post<T: Decodable>(_ path: String, body: [String: Any], authenticated: Bool = false) async throws -> T {
        var request = URLRequest(url: PublicConfig.api.appendingPathComponent(path))
        request.httpMethod = "POST"; request.timeoutInterval = path == "api/ride-ai" ? 45 : 20
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if authenticated {
            let session = try await client.auth.session
            request.setValue("Bearer \(session.accessToken)", forHTTPHeaderField: "Authorization")
        }
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let response = response as? HTTPURLResponse, (200..<300).contains(response.statusCode) else {
            let payload = try? JSONSerialization.jsonObject(with: data) as? [String: Any]
            throw AppError.message(payload?["error"] as? String ?? "The booking service couldn’t be reached. Please try again.")
        }
        return try JSONDecoder().decode(T.self, from: data)
    }

    static func dictionary<T: Encodable>(_ value: T) throws -> [String: Any] {
        try JSONSerialization.jsonObject(with: JSONEncoder().encode(value)) as! [String: Any]
    }
}

enum AppError: LocalizedError {
    case message(String)
    var errorDescription: String? { switch self { case .message(let text): text } }
}

@MainActor @Observable final class AccountStore {
    var user: User?
    var profile: Profile?
    var driver: DriverProfile?
    var error: String?
    var busy = false
    var restored = false
    private var listener: Task<Void, Never>?

    func start() {
        guard listener == nil else { return }
        listener = Task {
            for await (_, session) in Backend.client.auth.authStateChanges {
                user = session?.user; restored = true
                if user != nil { await refresh(); await PushService.shared.register() }
                else { profile = nil; driver = nil }
            }
        }
    }
    func refresh() async {
        guard let id = user?.id else { return }
        #if DEBUG
        if user?.email?.hasSuffix("@example.invalid") == true { await diagnostic() }
        #endif
        do {
            profile = try await Backend.client.from("profiles").select().eq("id", value: id).single().execute().value
            if AppRole.isDriver {
                let rows: [DriverProfile] = try await Backend.client.from("driver_profiles").select().eq("id", value: id).execute().value
                driver = rows.first
            }
        } catch { self.error = "Your account could not be refreshed. \(error.localizedDescription)" }
    }
    func google() async {
        busy = true; error = nil; defer { busy = false }
        do { _ = try await Backend.client.auth.signInWithOAuth(provider: .google, redirectTo: URL(string: "\(AppRole.scheme)://auth/callback")!) }
        catch {
            if (error as? ASWebAuthenticationSessionError)?.code == .canceledLogin { self.error = nil }
            else { self.error = "Google sign-in couldn’t finish. Please try again or use Apple or email." }
        }
    }
    func email(_ email: String) async throws {
        try await Backend.client.auth.signInWithOTP(email: email.trimmingCharacters(in: .whitespacesAndNewlines), redirectTo: URL(string: "\(AppRole.scheme)://auth/callback")!)
    }
    func signOut() async {
        // Stop Core Location before network cleanup. A failed token deletion
        // must never leave the device signed in or continue publishing GPS.
        try? await LocationService.shared.stopSharing()
        if AppRole.isDriver {
            try? await Backend.client.rpc("set_driver_online", params: ["p_online": false]).execute()
            try? await Backend.client.rpc("set_test_driver_online", params: ["p_online": false]).execute()
        }
        try? await PushService.shared.unregister()
        do { try await Backend.client.auth.signOut(scope: .local) }
        catch { self.error = "Signed out on this device. The server could not be reached to finish session cleanup." }
    }
    #if DEBUG
    private func diagnostic() async {
        var lines: [String] = []
        do {
            let session = try await Backend.client.auth.session
            lines.append("session_user_role=\(session.user.role ?? "none")")
            var request = URLRequest(url: PublicConfig.supabaseURL.appendingPathComponent("rest/v1/bookings").appending(queryItems: [URLQueryItem(name: "select", value: "id"), URLQueryItem(name: "limit", value: "0")]))
            request.setValue("Bearer \(session.accessToken)", forHTTPHeaderField: "Authorization")
            request.setValue(PublicConfig.key, forHTTPHeaderField: "apikey")
            let (_, response) = try await URLSession.shared.data(for: request)
            lines.append("direct_status=\((response as? HTTPURLResponse)?.statusCode ?? 0)")
        } catch { lines.append("diagnostic=\(error.localizedDescription)") }
        let path = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("qa-auth-diagnostic.txt")
        try? lines.joined(separator: "\n").write(to: path, atomically: true, encoding: .utf8)
    }
    #endif
}
