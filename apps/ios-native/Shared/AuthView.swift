import SwiftUI
import AuthenticationServices
import Supabase

struct AuthView: View {
    @Environment(AccountStore.self) private var account
    @Environment(\.dismiss) private var dismiss
    @State private var email = ""
    @State private var sent = false
    @State private var error: String?
    @State private var nonce = ""
    @State private var busy = false
    @State private var usePassword = false
    @State private var password = ""
    #if DEBUG
    @State private var qaEmail = ""
    @State private var qaPassword = ""
    #endif
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 22) {
                    Identity().padding(.top, 24)
                    Text(AppRole.isDriver ? "Good to have\nyou on board." : "Your next arrival\nstarts here.").font(.system(size: 36, weight: .bold)).tracking(-1.3).padding(.top, 38)
                    Text("Sign in to keep your transfers, details and live journey together.").foregroundStyle(.secondary)
                    if let message = error ?? account.error { Notice(text: message, error: true) }
                    SignInWithAppleButton(.continue) { request in
                        nonce = AppleNonce.make(); request.requestedScopes = [.email, .fullName]; request.nonce = AppleNonce.hash(nonce)
                    } onCompletion: { result in
                        Task {
                            do {
                                let authorization = try result.get()
                                guard let credential = authorization.credential as? ASAuthorizationAppleIDCredential,
                                      let token = credential.identityToken, let text = String(data: token, encoding: .utf8) else { throw AppError.message("Apple didn’t return a sign-in token.") }
                                _ = try await Backend.client.auth.signInWithIdToken(credentials: .init(provider: .apple, idToken: text, nonce: nonce))
                                dismiss()
                            } catch { self.error = error.localizedDescription }
                        }
                    }.signInWithAppleButtonStyle(.black).frame(height: 56).clipShape(RoundedRectangle(cornerRadius: 17))
                    Button { Task { await account.google(); if account.user != nil { dismiss() } } } label: {
                        HStack(spacing: 12) { Text("G").font(.title3.bold()); Text("Continue with Google").font(.headline) }.frame(maxWidth: .infinity, minHeight: 56).foregroundStyle(Brand.ink).background(.white, in: RoundedRectangle(cornerRadius: 17)).overlay(RoundedRectangle(cornerRadius: 17).stroke(.quaternary))
                    }.disabled(account.busy)
                    HStack { Rectangle().frame(height: 1); Text("or use email").font(.caption).fixedSize(); Rectangle().frame(height: 1) }.foregroundStyle(.tertiary).padding(.vertical, 7)
                    TextField("Email address", text: $email).textContentType(.emailAddress).keyboardType(.emailAddress).textInputAutocapitalization(.never).autocorrectionDisabled().padding(18).background(Brand.canvas, in: RoundedRectangle(cornerRadius: 17))
                    if usePassword {
                        SecureField("Password", text: $password).textContentType(.password).padding(18).background(Brand.canvas, in: RoundedRectangle(cornerRadius: 17))
                    }
                    PrimaryButton(title: usePassword ? "Sign in with email" : (sent ? "Send another sign-in link" : "Email me a sign-in link"), busy: busy, disabled: !email.contains("@") || (usePassword && password.isEmpty)) {
                        busy = true; error = nil
                        Task {
                            defer { busy = false }
                            do {
                                if usePassword {
                                    _ = try await Backend.client.auth.signIn(email: email.trimmingCharacters(in: .whitespacesAndNewlines), password: password)
                                    dismiss()
                                } else { try await account.email(email); sent = true }
                            } catch { self.error = error.localizedDescription }
                        }
                    }
                    Button(usePassword ? "Email me a sign-in link instead" : "Already have a password? Sign in") { usePassword.toggle(); error = nil; password = "" }.font(.subheadline).disabled(busy)
                    if sent && !usePassword { Notice(text: "Check your inbox and open the sign-in link on this iPhone.") }
                    Text("By continuing, you agree to our [Terms](https://crete-direct-transfers.gk-3ae.workers.dev/legal/terms) and [Privacy Policy](https://crete-direct-transfers.gk-3ae.workers.dev/legal/privacy).").font(.caption).foregroundStyle(.secondary).padding(.top, 10)
                    #if DEBUG
                    DisclosureGroup("Internal verification") {
                        TextField("Disposable QA email", text: $qaEmail).textInputAutocapitalization(.never).autocorrectionDisabled().keyboardType(.emailAddress)
                        SecureField("Disposable QA password", text: $qaPassword)
                        Button("Sign in disposable fixture") { Task { do { guard qaEmail.hasSuffix("@example.invalid") else { throw AppError.message("Disposable fixture accounts only.") }; _ = try await Backend.client.auth.signIn(email: qaEmail, password: qaPassword); dismiss() } catch { self.error = error.localizedDescription } } }
                    }.font(.caption).padding(.top, 25)
                    #endif
                }.padding(26)
            }.background(.white).toolbar { ToolbarItem(placement: .topBarTrailing) { Button("Close", systemImage: "xmark") { dismiss() }.labelStyle(.iconOnly) } }
        }.onChange(of: account.user?.id) { _, id in if id != nil { dismiss() } }
    }
}
