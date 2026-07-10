export type FaqItem = { q: string; a: string };
export type FaqGroup = { title: string; items: FaqItem[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: "Booking & pricing",
    items: [
      {
        q: "Is the price really fixed?",
        a: "Yes. The price you see when you book is the price you pay — no bidding, no surge pricing, no post-trip surcharges. The only exceptions are extras you tick yourself (child seat, extra stop, meet-and-greet with sign) and the automatic 15% night surcharge for pickups between 22:00 and 06:00, both shown before you confirm.",
      },
      {
        q: "How far in advance should I book?",
        a: "48 hours before your pickup is comfortable. In peak August we recommend a week ahead to guarantee your preferred vehicle class. Same-day bookings are possible but subject to availability.",
      },
      {
        q: "Can I book a return transfer at the same time?",
        a: "Yes — book two separate transfers with the same customer details. We're building a combined round-trip booking flow for a future update.",
      },
    ],
  },
  {
    title: "Payment",
    items: [
      {
        q: "When do I pay?",
        a: "Right now, we operate on a reserve-then-confirm model: you reserve online with no card required, we confirm within a few hours, and you pay the driver in cash or by card on arrival. Online payment via Stripe is coming shortly.",
      },
      {
        q: "Do you accept cards?",
        a: "Every driver carries a card terminal that accepts Visa, Mastercard and Amex. Cash in EUR is also fine.",
      },
      {
        q: "Do you charge a booking fee?",
        a: "No. The price you see is the full price. No booking fees, no fuel surcharges, no airport-pickup fees.",
      },
    ],
  },
  {
    title: "Cancellation & changes",
    items: [
      {
        q: "What's your cancellation policy?",
        a: "Free cancellation up to 24 hours before your pickup time. Inside 24 hours, a 50% fee applies. No-shows are charged in full.",
      },
      {
        q: "Can I change my pickup time?",
        a: "Yes — reply to your booking confirmation email or WhatsApp your driver directly. Changes are free up to 4 hours before pickup.",
      },
      {
        q: "What if my flight is cancelled?",
        a: "Send us the airline notification and we'll rebook or refund in full, whichever you prefer.",
      },
    ],
  },
  {
    title: "Meeting your driver",
    items: [
      {
        q: "Where does the driver meet me at the airport?",
        a: "Inside the arrivals hall, past the baggage claim, holding a sign with your name. Add the meet-and-greet extra (+€10) for a physical sign — otherwise the driver identifies you by name from your booking.",
      },
      {
        q: "Where does the driver meet me at the port?",
        a: "At the exit of the car deck for arriving ferries, or directly at your assigned hotel/villa gate for onward transfers.",
      },
      {
        q: "What if I can't find my driver?",
        a: "You'll have the driver's mobile and WhatsApp the day before pickup. Our 24/7 dispatch line is also on your booking confirmation.",
      },
    ],
  },
  {
    title: "Luggage, kids, and vehicles",
    items: [
      {
        q: "How much luggage can I bring?",
        a: "Economy and Comfort vehicles fit 3 standard suitcases plus hand luggage for 3 passengers. Minivans fit 7 suitcases for 7 passengers. Extra bags, surfboards or bikes — just tell us in the notes.",
      },
      {
        q: "Can I bring a child seat?",
        a: "Yes. Add the child seat extra when booking (+€10). We supply infant (0–13 kg), toddler (9–18 kg) and booster (15–36 kg) — mention which in the notes.",
      },
      {
        q: "Are all vehicles air-conditioned?",
        a: "Every vehicle in the fleet has climate control, and every driver runs it. Water bottles come standard on Comfort, Minivan and Luxury.",
      },
    ],
  },
  {
    title: "Flight delays & waiting",
    items: [
      {
        q: "What if my flight is late?",
        a: "We track your flight number automatically. The driver adjusts pickup — no extra charge, no time limit for late flights.",
      },
      {
        q: "How long will the driver wait?",
        a: "60 minutes of free waiting from the scheduled arrival for flights, unlimited waiting if the flight itself is delayed. For hotel pickups, 15 minutes free waiting.",
      },
    ],
  },
  {
    title: "Tipping & etiquette",
    items: [
      {
        q: "Is tipping expected?",
        a: "Not required, always appreciated. If your driver was great, 10% cash is a warm gesture in Greek culture.",
      },
      {
        q: "Can the driver stop for a coffee or a photo?",
        a: "On long-distance transfers, yes — just ask. It's built into the experience.",
      },
    ],
  },
];
