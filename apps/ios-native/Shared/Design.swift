import SwiftUI
import MapKit

enum Brand {
    static let blue = Color(red: 36/255, green: 91/255, blue: 235/255)
    static let ink = Color(red: 16/255, green: 17/255, blue: 20/255)
    static let mist = Color(red: 238/255, green: 243/255, blue: 1)
    static let canvas = Color(uiColor: .systemGroupedBackground)
}

struct Identity: View {
    var compact = false
    var body: some View {
        HStack(spacing: 9) {
            Image(AppRole.isDriver ? "IdentityDriver" : "IdentityTraveler").resizable().aspectRatio(contentMode: .fit).frame(width: compact ? 32 : 42, height: compact ? 32 : 42).clipShape(RoundedRectangle(cornerRadius: compact ? 9 : 12))
            VStack(alignment: .leading, spacing: 0) {
                Text("TransferAround").font(.system(size: compact ? 17 : 20, weight: .bold, design: .rounded)).tracking(-0.7)
                if AppRole.isDriver { Text("DRIVER").font(.system(size: 8, weight: .heavy)).tracking(2.8) }
            }.foregroundStyle(Brand.ink)
        }.accessibilityElement(children: .combine)
    }
}

/// Use the artwork itself for small navigation marks. A system glass capsule
/// around the app tile creates a second, mismatched outline on the map.
struct BrandIcon: View {
    var size: CGFloat = 40
    var body: some View {
        Image("IdentityTraveler").resizable().scaledToFit()
            .frame(width: size, height: size)
            .clipShape(RoundedRectangle(cornerRadius: size * 0.27, style: .continuous))
            .accessibilityLabel("TransferAround")
    }
}

struct BrandToolbarItem: ToolbarContent {
    var body: some ToolbarContent {
        if #available(iOS 26.0, *) {
            ToolbarItem(placement: .topBarLeading) { BrandIcon() }
                .sharedBackgroundVisibility(.hidden)
        } else {
            ToolbarItem(placement: .topBarLeading) { BrandIcon() }
        }
    }
}

struct PrimaryButton: View {
    var title: String
    var systemImage = "arrow.right"
    var busy = false
    var disabled = false
    var dark = false
    var action: () -> Void
    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) { Text(title).font(.headline); Spacer(minLength: 0); if busy { ProgressView().tint(.white) } else { Image(systemName: systemImage).font(.headline) } }
                .padding(.horizontal, 22).frame(minHeight: 58).foregroundStyle(.white)
                .background(disabled ? Color.gray.opacity(0.5) : dark ? Brand.ink : Brand.blue, in: RoundedRectangle(cornerRadius: 20))
        }.buttonStyle(.plain).disabled(disabled || busy)
    }
}

struct Notice: View {
    var text: String
    var error = false
    var body: some View {
        Label(text, systemImage: error ? "exclamationmark.circle" : "info.circle")
            .font(.subheadline).foregroundStyle(error ? Color.red : Brand.blue)
            .padding(14).frame(maxWidth: .infinity, alignment: .leading)
            .background(error ? Color.red.opacity(0.06) : Brand.mist, in: RoundedRectangle(cornerRadius: 16))
    }
}

struct RouteRail: View {
    var from: String
    var to: String
    var body: some View {
        HStack(spacing: 14) {
            VStack(spacing: 4) { Circle().fill(Brand.blue).frame(width: 9, height: 9); Rectangle().fill(.quaternary).frame(width: 1, height: 27); RoundedRectangle(cornerRadius: 2).fill(Brand.ink).frame(width: 9, height: 9) }.accessibilityHidden(true)
            VStack(alignment: .leading, spacing: 19) { Text(from).lineLimit(2); Text(to).lineLimit(2) }.font(.subheadline.weight(.medium))
            Spacer(minLength: 0)
        }
    }
}

struct TransferMap: View {
    var from: Point?
    var to: Point?
    var route: MKRoute?
    var driver: DriverPosition?
    var follow = false
    var onTap: ((CLLocationCoordinate2D) -> Void)?
    @State private var camera: MapCameraPosition = .region(.init(center: .init(latitude: 35.44, longitude: 24.50), span: .init(latitudeDelta: 0.65, longitudeDelta: 1.6)))
    @Environment(\.accessibilityReduceMotion) private var reducedMotion
    var body: some View {
        MapReader { proxy in
            Map(position: $camera) {
                UserAnnotation()
                if let route { MapPolyline(route.polyline).stroke(Brand.blue, style: StrokeStyle(lineWidth: 6, lineCap: .round, lineJoin: .round)) }
                if let from { Annotation("Pickup", coordinate: from.coordinate, anchor: .bottom) { mapPin(pickup: true) } }
                if let to { Annotation("Destination", coordinate: to.coordinate, anchor: .bottom) { mapPin(pickup: false) } }
                if let driver {
                    Annotation("Your driver", coordinate: driver.coordinate) {
                        Image("DriverCar").resizable().aspectRatio(contentMode: .fit).frame(width: 42, height: 68)
                            .rotationEffect(.degrees(driver.heading ?? 0)).shadow(color: .black.opacity(0.2), radius: 4, y: 2)
                            .opacity((driver.date?.timeIntervalSinceNow ?? -100) > -20 ? 1 : 0.45)
                    }.annotationTitles(.hidden)
                }
            }
            .mapStyle(.standard(elevation: .realistic, pointsOfInterest: .excludingAll, showsTraffic: false))
            .mapControlVisibility(.hidden)
            .animation(reducedMotion ? nil : .linear(duration: 0.9), value: driver)
            .onTapGesture { point in if let c = proxy.convert(point, from: .local) { onTap?(c) } }
            .onChange(of: route?.distance) { _, _ in fit() }
            .onChange(of: from) { _, _ in fit() }
            .onChange(of: to) { _, _ in fit() }
            .onChange(of: driver) { _, position in if follow, let position { move(.region(.init(center: position.coordinate, span: .init(latitudeDelta: 0.012, longitudeDelta: 0.012)))) } }
            .onChange(of: follow) { _, value in if !value { fit() } }
            .onAppear { fit() }
        }
    }
    private func mapPin(pickup: Bool) -> some View {
        VStack(spacing: 0) { Image(systemName: pickup ? "circle.fill" : "square.fill").font(.system(size: 11, weight: .bold)).foregroundStyle(.white).frame(width: 30, height: 30).background(pickup ? Brand.blue : Brand.ink, in: Circle()).overlay(Circle().stroke(.white, lineWidth: 3)); Rectangle().fill(Brand.ink).frame(width: 2, height: 10) }.shadow(color: .black.opacity(0.16), radius: 4, y: 2)
    }
    private func move(_ position: MapCameraPosition) {
        if reducedMotion { camera = position } else { withAnimation(.easeInOut(duration: 0.8)) { camera = position } }
    }
    private func fit() {
        if follow { return }
        if let route { move(.rect(route.polyline.boundingMapRect.insetBy(dx: -route.polyline.boundingMapRect.width * 0.30, dy: -route.polyline.boundingMapRect.height * 0.45))) }
        else if let p = from ?? to { move(.region(.init(center: p.coordinate, span: .init(latitudeDelta: 0.06, longitudeDelta: 0.06)))) }
    }
}

struct RouteMetrics: View {
    var route: RouteService
    var body: some View {
        HStack(spacing: 18) {
            Label(route.loading ? "Calculating…" : route.duration, systemImage: "clock")
            if route.route != nil { Rectangle().fill(.quaternary).frame(width: 1, height: 15); Label(route.distance, systemImage: "point.topleft.down.to.point.bottomright.curvepath") }
        }.font(.subheadline.weight(.semibold)).padding(.horizontal, 16).padding(.vertical, 12).background(.regularMaterial, in: Capsule()).accessibilityElement(children: .combine)
    }
}
