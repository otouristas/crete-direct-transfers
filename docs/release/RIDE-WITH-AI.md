# Ride with AI

Traveler's SwiftUI sheet and the website planner call POST /api/ride-ai. Claude Sonnet 5.5 extracts a strictly validated trip intent. The API authenticates the Supabase user before paid inference and enforces 10 requests/hour, 30/day per user and 200/day globally, using atomic server-only counters. The dedicated TransferAround Anthropic workspace has a verified $10 monthly cap. The API credential is stored only as a protected server secret; it is never bundled in the website or iOS apps.

The model extracts pickup, destination, local date/time, passengers, luggage, optional flight and vehicle preference. Missing facts produce questions. Airport codes resolve against the airport catalog; hotels/addresses require a traveler choice. The booking service computes the road estimate and fare. Vehicles must fit both travelers and large suitcases, using the canonical eight-class web catalog and matching Swift capacities. Special requirements such as accessible vehicles, child seats, pets, multiple stops or return trips require confirmation rather than being silently discarded.

Review transfers the actual places, party, bags, pickup time/country, flight and vehicle into normal booking. The fare is recalculated there and again by checkout. No AI response can charge a card, create a financial booking, assign a driver or skip payment. Driver availability and flight status are not verified by this feature. Route/time estimates are labeled as estimates.

Selecting a suggested address preserves the already validated intent and does not make another model call. The server still validates the selection and recalculates the proposal through the normal places/pricing service. Pickup time is shown in its local time zone, independent of the device's clock setting.

Users explicitly consent before submitting messages to Anthropic. GPS-button coordinates are used by mapping/booking and are not included in the model request. Text a traveler chooses to type is sent to Anthropic, including any details they include. The application does not persist conversation text in its booking database. Provider retention follows Anthropic's applicable commercial data policies. The privacy page includes this operational disclosure in seven languages.

The interface uses the exact approved Interchange icon, cobalt and native SF typography on iOS. Conversation-to-card design references were inspected in [Mindtrip on Mobbin](https://mobbin.com/flows/5ddb58cb-818c-481e-b71d-3f44a56d4735) and its [trip conversation flow](https://mobbin.com/flows/6550dd5d-3df1-42f3-a74c-6b717afbe486). No Mobbin screenshots are packaged as product assets.

Verification includes live Claude extraction of missing/complete requests, actual place choice, destination-local pickup time, canonical capacity boundaries, rejected price/booking injection fields and handoff into booking. No real purchase is needed for these tests.
