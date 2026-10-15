import Foundation
import CoreLocation

enum AppRole {
    #if DRIVER
    static let isDriver = true
    static let scheme = "transferaround-driver"
    static let name = "TransferAround Driver"
    static let role = "driver"
    #else
    static let isDriver = false
    static let scheme = "transferaround"
    static let name = "TransferAround"
    static let role = "customer"
    #endif
}

struct Place: Codable, Identifiable, Equatable {
    var id: String
    var label: String
    var lat: Double
    var lng: Double
    var kind: String = "address"
    var countryCode: String?
    var coordinate: CLLocationCoordinate2D { .init(latitude: lat, longitude: lng) }
    static let chaniaAirport = Place(id: "CHQ", label: "Chania Airport (CHQ)", lat: 35.5396, lng: 24.1497, kind: "airport", countryCode: "GR")
    static let chaniaTown = Place(id: "chania", label: "Chania Town", lat: 35.5138, lng: 24.0180, kind: "destination", countryCode: "GR")
    static let heraklionAirport = Place(id: "HER", label: "Heraklion Airport (HER)", lat: 35.3397, lng: 25.1803, kind: "airport", countryCode: "GR")
    static let athensAirport = Place(id: "ATH", label: "Athens Airport (ATH)", lat: 37.9364, lng: 23.9475, kind: "airport", countryCode: "GR")
}

struct Point: Codable, Equatable {
    var lat: Double
    var lng: Double
    var coordinate: CLLocationCoordinate2D { .init(latitude: lat, longitude: lng) }
}

struct Booking: Decodable, Identifiable, Equatable {
    var id: UUID
    var user_id: UUID?
    var driver_id: UUID?
    var status: String
    var journey_stage: String?
    var pickup_at: String
    var pickup_address: String?
    var dropoff_address: String?
    var pickup_point: Point?
    var dropoff_point: Point?
    var customer_name: String?
    var customer_phone: String?
    var flight_number: String?
    var bags_checked: Int?
    var bags_cabin: Int?
    var price_cents: Int
    var vehicle_class: String
    var passengers: Int
    var payment_status: String?
    var market: String?
    var is_test: Bool?
    var isTest: Bool { is_test == true }
    var closed: Bool { ["completed", "cancelled", "no_show", "expired"].contains(status) }
    var price: String { (Double(price_cents) / 100).formatted(.currency(code: "EUR")) }
    var pickupDate: Date? { ISO8601DateFormatter.parse(pickup_at) }
    var pickupTimeZone: TimeZone { TimeZone(identifier: market == "spain" ? "Europe/Madrid" : market == "italy" ? "Europe/Rome" : "Europe/Athens")! }
    var phase: String {
        if status == "completed" { return AppRole.isDriver ? "Transfer completed" : "You’ve arrived" }
        if status == "no_show" { return "Transfer marked as no-show" }
        if status == "cancelled" { return "Transfer cancelled" }
        if status == "expired" { return "No driver accepted" }
        if driver_id == nil { return payment_status == "unpaid" && !isTest ? "Payment needed" : "Finding your driver" }
        if status == "claimed" { return AppRole.isDriver ? "Ready for pickup" : "Your driver is getting ready" }
        switch journey_stage {
        case "on_trip": return AppRole.isDriver ? "Transfer in progress" : "On your way"
        case "at_pickup": return AppRole.isDriver ? "At the pickup" : "Your driver has arrived"
        default: return AppRole.isDriver ? "On your way to pickup" : "Your driver is on the way"
        }
    }
    var nextAction: (title: String, action: String)? {
        guard driver_id != nil, !closed else { return nil }
        if status == "claimed" { return ("Start driving to pickup", "start") }
        guard status == "en_route" else { return nil }
        switch journey_stage {
        case "to_pickup", nil: return ("I’m at the pickup", "arrive")
        case "at_pickup": return ("Traveler is on board", "board")
        case "on_trip": return ("Complete transfer", "complete")
        default: return nil
        }
    }
}

struct DriverPosition: Decodable, Equatable {
    var booking_id: UUID
    var latitude: Double
    var longitude: Double
    var heading: Double?
    var captured_at: String
    var driver_name: String?
    var vehicle_name: String?
    var vehicle_plate: String?
    var coordinate: CLLocationCoordinate2D { .init(latitude: latitude, longitude: longitude) }
    var date: Date? { ISO8601DateFormatter.parse(captured_at) }
}

struct JobOffer: Decodable, Identifiable {
    var offer_id: UUID
    var id: UUID
    var expires_at: String
    var pickup_at: String
    var pickup_address: String?
    var dropoff_address: String?
    var price_cents: Int
    var passengers: Int?
    var vehicle_class: String?
    var is_test: Bool?
    var expiry: Date { ISO8601DateFormatter.parse(expires_at) ?? .distantPast }
    var price: String { (Double(price_cents) / 100).formatted(.currency(code: "EUR")) }
}

struct Profile: Decodable {
    var id: UUID
    var full_name: String?
    var phone: String?
}

struct DriverProfile: Decodable {
    var approval_status: String
    var is_online: Bool
    var vehicle_make_model: String?
    var vehicle_plate: String?
}

struct Fare: Decodable {
    var priceCents: Int?
    var routeSlug: String?
    var distanceKm: Double?
    var durationMin: Double?
}

enum Vehicle: String, CaseIterable, Identifiable {
    case economy = "economy", comfort = "comfort", luxury = "luxury", suv = "suv", group = "minivan", vanFirst = "van-first", minibus12 = "minibus-12", minibus16 = "minibus-16"
    var id: String { rawValue }
    var title: String { switch self { case .economy: "Economy"; case .comfort: "Standard Class"; case .luxury: "First Class"; case .suv: "SUV"; case .group: "Van Standard"; case .vanFirst: "Van First Class"; case .minibus12: "Minibus · 12"; case .minibus16: "Minibus · 16" } }
    var seats: Int { switch self { case .suv, .vanFirst: 6; case .group: 7; case .minibus12: 12; case .minibus16: 16; default: 3 } }
    var bags: Int { seats }
    var image: String { "Fleet-" + rawValue }
    var subtitle: String { "Up to \(seats) travelers · \(bags) large suitcases" }
}

extension ISO8601DateFormatter {
    static var flexible: ISO8601DateFormatter { ISO8601DateFormatter() }
    static func parse(_ value: String) -> Date? {
        let f = ISO8601DateFormatter(); f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f.date(from: value) ?? flexible.date(from: value)
    }
}

extension Date {
    func pickupLabel(in timeZone: TimeZone = TimeZone(identifier: "Europe/Athens")!) -> String {
        let formatter = DateFormatter()
        formatter.locale = .autoupdatingCurrent
        formatter.timeZone = timeZone
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: self) + " · " + (timeZone.identifier.split(separator: "/").last.map(String.init) ?? timeZone.identifier)
    }
}
