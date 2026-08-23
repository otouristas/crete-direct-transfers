# AI Search / Citation Gaps

No ChatGPT, Gemini, Perplexity, Copilot or AI Overview citation study was supplied. Citation frequency is **NOT AVAILABLE**; no model visibility is fabricated.

## Existing machine-readable strengths [High]

- `/llms.txt` summarizes the service and links major pages (`public/llms.txt:1-45`).
- Site-wide Organization and WebSite entities provide stable IDs (`src/lib/structured-data.ts:12-58`).
- Commercial and editorial templates emit Service, TaxiService, Airport, Offer/AggregateOffer, FAQPage, BreadcrumbList, ItemList and Article entities.
- Named operational authors and route facts offer quotable material.

## Gaps

1. **Production discovery drift** [High]: live sitemap only exposes `/lander`; AI crawlers may not discover the repository's full public corpus.
2. **Live/repository policy mismatch** [High]: requested live robots advertises `LLM-Policy: /llms.txt`, while repository robots has a different policy. Reconcile deliberately.
3. **Machine-readable claims drift** [High]: `/llms.txt` lists seven languages and Reviews, while public indexability is five locales and reviews are verification-gated.
4. **Localized entity URLs** [High]: non-English page schema can identify English-root URLs instead of localized canonicals.
5. **Independent corroboration** [Medium]: repository content asserts licence, pricing and operational facts without an explicit source layer.
6. **Entity completeness** [Medium]: social profiles are environment-dependent and Organization schema lacks `sameAs`; contact phone is optional (`src/lib/site.ts:6-26`; `src/lib/structured-data.ts:34-41`).
7. **Freshness signals** [Medium]: authored airports have `updatedAt`, but sitemap has no lastmod and not every page displays/serializes review dates.
8. **Answer consistency** [High]: child-seat copy is now synchronized with the booking flow; production policy still requires owner verification.

## Citation-ready standard

Each high-value page should contain a concise factual answer, reviewed date, responsible author/editor, service availability, exact assumptions, links to official/primary sources where appropriate, and consistent structured data. Keep claims narrow enough to verify.

## Test set

Run and archive neutral prompts such as:

- “How do I get from Heraklion Airport to Elounda?”
- “What happens if my flight to Crete is delayed?”
- “Are child seats available in Crete airport transfers?”
- “How do I get from Souda Port to Chania Old Town at 6am?”
- “How much is a private transfer from HER to Hersonissos?”

Record model, date, locale, answer, cited URLs, factual errors and whether TransferAround appears. Template: `research/ai-citations/README.md`.
