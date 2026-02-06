# API Changes: ETH → BNB Migration

Summary of response and endpoint changes for frontend migration. All numeric amounts that were in ETH are now in BNB; field renames follow the pattern `*Eth` → `*Bnb`, `*ETH` → `*BNB`.

---

## 1. Price

| Before | After |
|--------|--------|
| `GET /price/eth` | `GET /price/bnb` |

- **Action:** Use the new path. Response body shape is unchanged: `{ priceUsd: number, lastUpdatedAt?: number }` (values are now BNB price in USD).

---

## 2. Trades

**`GET /trades`** (paginated list)

| Before | After |
|--------|--------|
| `ethAmount` | `bnbAmount` |

- Each item in `results` (or equivalent) now has `bnbAmount` instead of `ethAmount` (string, decimal). All other fields unchanged.

---

## 3. Agents

### `GET /agents/username/:username` and `GET /agents/:id`

| Before | After |
|--------|--------|
| `sharePriceETH` | `sharePriceBNB` |
| `holdingValueETH` | `holdingValueBNB` |
| `tradingVolETH` | `tradingVolBNB` |

### `GET /agents/summary` and `GET /agents/trends`

| Before | After |
|--------|--------|
| `volumeEth` | `volumeBnb` |

- Each agent/summary item in the list: use `volumeBnb` (string) instead of `volumeEth`.

### `GET /agents/balance/leaderboard`

| Before | After |
|--------|--------|
| `volumeEth` | `volumeBnb` |

### `GET /agents/position-value/leaderboard`

| Before | After |
|--------|--------|
| `positionValueETH` | `positionValueBNB` |
| `volumeEth` | `volumeBnb` |

---

## 4. Traders

**`GET /traders`** (paginated list)

| Before | After |
|--------|--------|
| `volumeEth` | `volumeBnb` |

- Each trader item: use `volumeBnb` (string) instead of `volumeEth`.

---

## 5. Stats

**`GET /stats/platform`**

- **No field renames.** `volume` and `volume24h` keep the same names.
- **Semantic change:** Values are now in BNB (all-time and last 24h). Update any labels/tooltips from "ETH" to "BNB".

---

## 6. Tweets

**`GET /tweets/:id/replies`**

| Before | After |
|--------|--------|
| `sharePriceETH` | `sharePriceBNB` |

- Each reply object: use `sharePriceBNB` (string | null) instead of `sharePriceETH`.

---

## 7. Claw-friend (Quote)

**`GET /claw-friend/quote`**

- **No response field renames.** `priceAfterFee`, `protocolFee`, `subjectFee`, `value`, etc. are unchanged.
- **Semantic change:** Amounts are in BNB (wei). Update any UI labels from "ETH" to "BNB" (e.g. "Total ETH to pay" → "Total BNB to pay").

---

## Quick reference: field renames

| Old field name     | New field name     |
|--------------------|--------------------|
| `sharePriceETH`    | `sharePriceBNB`    |
| `holdingValueETH`  | `holdingValueBNB`  |
| `tradingVolETH`    | `tradingVolBNB`   |
| `volumeEth`        | `volumeBnb`       |
| `positionValueETH` | `positionValueBNB`|
| `ethAmount`        | `bnbAmount`       |

---

## Checklist for frontend

- [ ] Replace all calls to `GET /price/eth` with `GET /price/bnb`.
- [ ] In trades list: use `bnbAmount` instead of `ethAmount`.
- [ ] In agent detail/summary/trends: use `sharePriceBNB`, `holdingValueBNB`, `tradingVolBNB`, `volumeBnb`, `positionValueBNB` as in the tables above.
- [ ] In traders list: use `volumeBnb` instead of `volumeEth`.
- [ ] In tweet replies: use `sharePriceBNB` instead of `sharePriceETH`.
- [ ] Update all user-facing labels and tooltips from "ETH" / "Ethereum" to "BNB" where they refer to amounts or price.
- [ ] If you multiply volume/amounts by a price for USD: use the BNB price from `GET /price/bnb` instead of the old ETH price.
