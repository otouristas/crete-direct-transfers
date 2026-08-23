# Route-family overlap inventory

Status: **CONFIRMED in repository** · Search-performance data: **NOT AVAILABLE**

These 22 Crete corridors have both a planning URL under `/routes/` and an airport-arrival URL under `/airports/{airport}/`. They are not being redirected or canonicalized without GSC, backlink and conversion evidence.

The implemented distinction is:

- `/routes/{slug}`: corridor planning, local access, vehicle comparison and full booking choices.
- `/airports/{airport}/{route}`: airport meeting process, flight context, arrival facts and sibling airport transfers.
- Each pair now links to its counterpart with a descriptive, locale-preserving anchor.

## Heraklion Airport pairs

| Corridor URL | Airport-arrival URL |
|---|---|
| `/routes/heraklion-airport-to-elounda` | `/airports/crete-heraklion-airport-transfers-her/transfer-from-heraklion-airport-to-elounda` |
| `/routes/heraklion-airport-to-agios-nikolaos` | `/airports/crete-heraklion-airport-transfers-her/transfer-from-heraklion-airport-to-agios-nikolaos` |
| `/routes/heraklion-airport-to-hersonissos` | `/airports/crete-heraklion-airport-transfers-her/transfer-from-heraklion-airport-to-hersonissos` |
| `/routes/heraklion-airport-to-malia` | `/airports/crete-heraklion-airport-transfers-her/transfer-from-heraklion-airport-to-malia` |
| `/routes/heraklion-airport-to-stalis` | `/airports/crete-heraklion-airport-transfers-her/transfer-from-heraklion-airport-to-stalis` |
| `/routes/heraklion-airport-to-rethymno` | `/airports/crete-heraklion-airport-transfers-her/transfer-from-heraklion-airport-to-rethymno` |
| `/routes/heraklion-airport-to-chania` | `/airports/crete-heraklion-airport-transfers-her/transfer-from-heraklion-airport-to-chania` |
| `/routes/heraklion-airport-to-matala` | `/airports/crete-heraklion-airport-transfers-her/transfer-from-heraklion-airport-to-matala` |
| `/routes/heraklion-airport-to-bali` | `/airports/crete-heraklion-airport-transfers-her/transfer-from-heraklion-airport-to-bali` |
| `/routes/heraklion-airport-to-anissaras` | `/airports/crete-heraklion-airport-transfers-her/transfer-from-heraklion-airport-to-anissaras` |
| `/routes/heraklion-airport-to-analipsi` | `/airports/crete-heraklion-airport-transfers-her/transfer-from-heraklion-airport-to-analipsi` |
| `/routes/heraklion-airport-to-ierapetra` | `/airports/crete-heraklion-airport-transfers-her/transfer-from-heraklion-airport-to-ierapetra` |

## Chania Airport pairs

| Corridor URL | Airport-arrival URL |
|---|---|
| `/routes/chania-airport-to-chania-old-town` | `/airports/chania-international-airport-transfers-chq/transfer-from-chania-airport-to-chania-old-town` |
| `/routes/chania-airport-to-rethymno` | `/airports/chania-international-airport-transfers-chq/transfer-from-chania-airport-to-rethymno` |
| `/routes/chania-airport-to-kissamos` | `/airports/chania-international-airport-transfers-chq/transfer-from-chania-airport-to-kissamos` |
| `/routes/chania-airport-to-platanias` | `/airports/chania-international-airport-transfers-chq/transfer-from-chania-airport-to-platanias` |
| `/routes/chania-airport-to-georgioupoli` | `/airports/chania-international-airport-transfers-chq/transfer-from-chania-airport-to-georgioupoli` |
| `/routes/chania-airport-to-kolymbari` | `/airports/chania-international-airport-transfers-chq/transfer-from-chania-airport-to-kolymbari` |
| `/routes/chania-airport-to-almyrida` | `/airports/chania-international-airport-transfers-chq/transfer-from-chania-airport-to-almyrida` |
| `/routes/chania-airport-to-falasarna` | `/airports/chania-international-airport-transfers-chq/transfer-from-chania-airport-to-falasarna` |
| `/routes/chania-airport-to-sougia` | `/airports/chania-international-airport-transfers-chq/transfer-from-chania-airport-to-sougia` |
| `/routes/chania-airport-to-paleochora` | `/airports/chania-international-airport-transfers-chq/transfer-from-chania-airport-to-paleochora` |

## Decision gate

After deployment, compare both URLs in each pair using shared GSC queries, ranking-URL stability, backlinks, assisted bookings and landing-page conversion. Only then choose `differentiate`, `merge + redirect`, or `leave unchanged`.
