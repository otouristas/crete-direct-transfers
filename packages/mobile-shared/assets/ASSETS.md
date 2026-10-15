# Native vehicle graphics, revision 2

Created with the built-in image-generation tool on 15 October 2026. All three PNGs preserve real alpha transparency. These are illustrative vehicle-class graphics, not representations of a specific assigned driver's vehicle.

- `sedan-v2.png`: graphite sedan, elevated front three-quarter view, nose lower left; used for onboarding, authentication and ride classes.
- `van-v2.png`: silver executive passenger van in the same view and lighting; used for group transfers.
- `car-marker-v2.png`: orthographic overhead graphite sedan, nose north; the tracking marker is positioned only from received GPS samples and rotated using device heading.

## Prompt set

Sedan: “Premium ride booking app vehicle product render, transparent PNG cutout. One beautiful graphite black luxury electric sedan, generic unbranded design, elevated front three-quarter angle, nose lower left, fully visible and centered. Studio-quality realistic 3D render, soft lighting, crisp glass, metallic reflections, fine headlights, black alloy wheels, cool blue edge highlights. Subtle contact shadow. Genuine transparent background. No text, logos, UI, road or scenery. Clear at thumbnail size.”

Van: “Premium ride booking app vehicle render, transparent PNG cutout. One pearl silver executive six-seat passenger minivan, generic unbranded European luxury shuttle, dark windows, elegant alloy wheels. Elevated front three-quarter view, nose lower left, centered and fully visible. Realistic 3D studio render matching the graphite sedan: soft light, crisp glass, metallic reflections, cool blue highlights, subtle contact shadow. Genuine transparency. No text, logos, UI, scenery or road.”

Marker: “Tiny map vehicle marker. One unbranded graphite black executive sedan viewed exactly from overhead, orthographic top down, centered vertically with front hood straight north. Full vehicle, realistic clean 3D render, silver highlights outlining roof and body, blue-gray windshield and rear window, small mirrors, clear silhouette readable at 24 pixels wide. Generous horizontal transparent space, subtle shadow. No perspective tilt, road, text or logos. One vehicle only.”

# Approved Interchange identity, revision 3

Approved by the product owner on 15 October 2026. Keep this exact artwork: no car, taxi symbol, pin or refresh arrow. The two broad complementary routes form a distinctive interchange and a hidden T through negative space.

- `identity-rider-v3.png`: white Interchange mark on cobalt, shared Traveler identity.
- `identity-driver-v3.png`: the same geometry on near-black, companion Driver identity.
- Source artwork: built-in image generation, `exec-417a798b-aadd-42a7-a7ed-42268364ca17.png`; companion edit `exec-bf862587-52fd-4889-b283-94b85437febb.png`. Platform assets were exported with Expo image utilities at 1024px without transparency.
- Palette: cobalt #245BEB, deep cobalt #1B49C6, white #FFFFFF, charcoal #101114, pale blue #EEF3FF. Native navigation, selections, actions and tracking share these tokens.
- Website exports are in `public/brand/`; app icons are `apps/{rider,driver}/assets/icon-v3.png`. Use the supplied raster files rather than redrawing the symbol.

Creative brief: “A remarkable abstract TransferAround mobility identity, no car or taxi, no text. Two broad complementary bent routes create a compact interchange with a hidden T in negative space. White mark, saturated cobalt field, precise balanced geometry, premium and immediately recognizable at app-icon size.”

Companion edit brief: “Preserve the exact accepted Interchange geometry and white symbol; change only the cobalt field to near-black for the companion Driver app.”

Mobbin references were reviewed for recognizable icon silhouettes and restrained mobility identity; no third-party marks or screenshots are included in these assets.
