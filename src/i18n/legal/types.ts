export type LegalSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

export type LegalDoc = {
  metaTitle: string;
  metaDescription: string;
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
};

export type LegalDocs = {
  terms: LegalDoc;
  privacy: LegalDoc;
  driverPartnership: LegalDoc;
  kyc: LegalDoc;
  refunds: LegalDoc;
  imprint: LegalDoc;
  cookies: LegalDoc;
};
