# Keyword Research

This is repository-derived intent mapping, not third-party keyword research. Search volume, difficulty, CPC, rankings and SERP features are **NOT AVAILABLE** (Ahrefs **NOT AVAILABLE**; GSC **NOT AVAILABLE**).

## Intent map

| Cluster | Example query patterns | Best page family | Confidence |
|---|---|---|---|
| Airport transfer | `[airport] transfer`, `[IATA] private transfer` | Airport hub | High |
| Route booking | `[airport] to [resort] taxi/transfer`, `price`, `time` | Airport-route or route page | High |
| Port transfer | `[port] to [city/airport] transfer` | Port + route page | High |
| Destination | `private transfers in [city/resort]` | City hub | Medium |
| Service | `private driver Crete`, `group/minivan transfer`, `hotel transfer` | Service page | High |
| Comparison | `taxi vs transfer Crete`, `bus vs taxi [route]` | Editorial guide | High |
| Logistics | `late arrival`, `child seat`, `luggage`, `flight delay` | Guide + FAQ | High |
| Informational | `how to get from [A] to [B]` | Guide linked to route | High |
| B2B | `hotel airport transfer partner`, `wedding transport Crete` | Partner/service page | Medium |
| Market expansion | `[airport/city] private transfer` outside Greece | Market hub only with supply proof | Low–Medium |

## Priority entities from repository evidence

- Airports: HER, CHQ first; then authored Greek airports and validated live-market hubs.
- Crete destinations: Chania, Rethymno, Elounda, Agios Nikolaos, Hersonissos, Malia, Platanias, Georgioupoli, Kissamos, Matala, Ierapetra.
- Ports: Heraklion Port and Souda Port.
- Modifiers: fixed price, private, airport, port, hotel, minivan, group, family, child seat, late night, flight tracked, door to door.

## Cannibalization rules

- One primary commercial URL per origin/destination intent.
- Airport hub targets airport-level intent; route page targets the exact corridor; guide targets comparison/how-to intent.
- City hub targets destination-wide discovery, not every airport route phrase.
- Do not create locale pages from machine-translated English keyword strings; validate native phrasing.

## Validation backlog

1. Export GSC queries/pages for 16 months — **NOT AVAILABLE**.
2. Pull Ahrefs volume/difficulty/parent topic by locale — **NOT AVAILABLE**.
3. Record actual SERPs for the priority patterns in `research/serp/`.
4. Map PAA questions without inventing frequency.
5. Use GA4 landing-page conversion to prioritize — **NOT AVAILABLE**.

No ranking position is asserted.
