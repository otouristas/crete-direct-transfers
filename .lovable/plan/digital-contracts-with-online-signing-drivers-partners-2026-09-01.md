# Digital contracts with online signing (drivers & partners)

Turn the two uploaded Greek agreements into digital contracts that drivers, hotels and travel agents sign online, with a downloadable PDF afterwards.

## What the user gets

**Driver side**
- During driver onboarding, a new "Contract" step shows the full Greek text of ΣΥΜΦΩΝΗΤΙΚΟ ΣΥΝΕΡΓΑΣΙΑΣ ΜΕ ΟΔΗΓΟ, pre-filled with the driver's name, address, ΑΦΜ, ΔΟΥ and today's date.
- The driver scrolls the text, types their full name, ticks "Έχω διαβάσει και αποδέχομαι", and signs. Approval cannot be granted until the contract is signed.
- A "Τα συμβόλαιά μου" panel in the driver area lists signed contracts with a "Λήψη PDF" button.

**Partner side (hotels, travel agents, advertising partners)**
- Same flow on the partner application: full text of ΣΥΜΦΩΝΗΤΙΚΟ ΣΥΝΕΡΓΑΣΙΑΣ ΜΕ ΣΥΝΕΡΓΑΤΗ including Παραρτήματα Α–Δ, pre-filled with company name, distinctive title, address, ΑΦΜ, partner type and commission.
- Partner portal shows the signed contract with PDF download.

**Ops side**
- New "Συμβόλαια" section: see who has signed, who is pending, download any PDF.
- Issue or re-issue a contract to a specific driver/partner, and before sending, override the Annex A values — commission percentage (default 3%), partnership type, notice period, special terms.
- A signed contract is immutable; changes require issuing a new version.

## Signing model

Simple electronic signature: typed full name + explicit acceptance checkbox, with an audit trail stored on the record — signer name, user id, UTC timestamp, IP address, user agent, contract template version, and a SHA-256 hash of the exact rendered text that was accepted. The PDF footer prints the audit block so the document is self-evidencing.

Everything stays in Greek (the binding language). The PDF uses a Unicode font so Greek renders correctly.

## Technical notes

Database (one migration):
- `contract_templates` — kind (`driver` | `partner`), version, title, body (Greek text with `{{placeholders}}`), active flag. Seeded with both uploaded documents converted to placeholder-bearing text.
- `contracts` — template ref, kind, subject (`driver_id` / `partner_id` / `user_id`), status (`draft` | `pending` | `signed` | `void`), `variables` jsonb (name, ΑΦΜ, address, commission, dates, annex overrides), `rendered_body` text, `body_sha256`, signature fields (`signer_name`, `signed_at`, `signed_ip`, `signed_user_agent`), `company_signer_name`, timestamps.
- Grants + RLS: a signer reads and signs only their own contracts; admins read all and manage templates; `service_role` full. Signing goes through a `SECURITY DEFINER` RPC `sign_contract(p_contract_id, p_signer_name, p_ip, p_user_agent)` that refuses if already signed and freezes `rendered_body`/hash at that moment.
- Driver approval gate: `review_driver_onboarding` rejects approval when no signed driver contract exists.

App:
- `src/lib/contracts.ts` — placeholder rendering + hash helper.
- `src/functions/contracts.functions.ts` — `getMyContract`, `signContract` (reads IP/user-agent server-side from the request), `adminIssueContract`, `adminListContracts`, all under `requireSupabaseAuth`.
- `src/components/contracts/contract-signer.tsx` — scrollable Greek document, typed-name input, acceptance checkbox, submit.
- PDF: generated server-side in a server route `/api/contracts/$id/pdf` using `pdf-lib` with an embedded Greek-capable TTF, returned as a download; authorized to the signer or an admin.
- Onboarding wiring: contract step added to `driver_.apply.tsx` and the partner application; blocked submit until signed.
- Ops: new `ContractsPanel` in `ops.tsx` with issue/override dialog and PDF links.
- i18n: new `contracts` block across all 7 locales (contract text itself stays Greek).
