export type Review = {
  quote: string;
  author: string;
  route: string;
  rating: 5 | 4;
  source: "Google" | "Tripadvisor" | "Direct";
  sourceUrl: string;
  month: string;
};

// Publish only reviews whose provenance has been verified. The old design
// examples were not evidence of customer reviews or an aggregate rating.
export const REVIEWS: Review[] = [];
export const AVG_RATING: number | null = null;
