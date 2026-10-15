import XCTest
@testable import TransferAround

final class JourneyTests: XCTestCase {
    func testPastPickupDoesNotCompleteActiveTrip() throws {
        let booking = try JSONDecoder().decode(Booking.self, from: Data(#"{"id":"00000000-0000-0000-0000-000000000001","status":"en_route","pickup_at":"2020-01-01T12:00:00Z","price_cents":3500,"vehicle_class":"sedan","passengers":2,"driver_id":"00000000-0000-0000-0000-000000000002","journey_stage":"at_pickup"}"#.utf8))
        XCTAssertFalse(booking.closed)
        XCTAssertEqual(booking.nextAction?.action, "board")
        XCTAssertEqual(booking.phase, "Your driver has arrived")
    }
    func testCompletedJourneyCannotAdvance() throws {
        let booking = try JSONDecoder().decode(Booking.self, from: Data(#"{"id":"00000000-0000-0000-0000-000000000001","status":"completed","pickup_at":"2020-01-01T12:00:00Z","price_cents":3500,"vehicle_class":"sedan","passengers":2}"#.utf8))
        XCTAssertNil(booking.nextAction)
        XCTAssertTrue(booking.closed)
    }
}
