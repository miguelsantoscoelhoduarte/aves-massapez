# Catalog Workbook Schema
This project now treats the public `catalog.xlsx` file as a bird-level dataset instead of a per-species summary. Each row represents one available bird (or a batch of identical birds) and carries all the information required to build the storefront product catalogue.

| Column | Required | Description |
| --- | --- | --- |
| `SpeciesID` | yes | Stable identifier used to group birds into a storefront product. Lowercase letters, numbers and dashes only. |
| `SpeciesName_PT` | yes | Species display name in Portuguese. |
| `SpeciesName_EN` | yes | Species display name in English. |
| `SpeciesBasePrice` | yes | Reference adult price for the species. Used as the default price shown in the grid and as the baseline when computing modifiers. |
| `SpeciesEggPrice` | no | Optional reference price for an egg. Leave blank if the species is not sold as eggs. |
| `SpeciesImage` | yes | Relative path to the main image for the species (e.g. `./assets/images/papagaio.jpeg`). |
| `SpeciesDescription_PT` | no | Portuguese description. |
| `SpeciesDescription_EN` | no | English description. |
| `SpeciesStock` | yes | Overall stock flag for the species (`in`, `low`, `out`). |
| `ColorID` | yes | Stable identifier for the colour variant (lowercase with dashes). |
| `ColorName_PT` | yes | Colour name in Portuguese. |
| `ColorName_EN` | yes | Colour name in English. |
| `BirthDate` | yes | Bird birth date in ISO format (`YYYY-MM-DD`). Used to derive the age bucket. |
| `AgeCategoryOverride` | no | Optional manual age bucket (`egg`, `1week`, `2weeks`, …). Leave blank to let the loader infer it from the birth date. |
| `VariantPrice` | yes | Final price for birds that match this row (after colour/age adjustments). |
| `Quantity` | yes | How many identical birds this row represents. Must be a positive integer. |
| `Sold` | no | When set to `true`, the row is ignored (treat the birds as unavailable) without deleting its data. |
| `VariantImage` | no | Optional specific image for this variant. Falls back to the species image when blank. |
| `Notes` | no | Free-text notes that stay internal. |

### Data semantics

- Multiple rows may share the same species, colour, age and price. They are aggregated via the `Quantity` column.
- Set `Sold` to `true` to temporarily hide a batch while keeping the rest of its information for later reuse.
- The loader groups rows by `SpeciesID` and builds colour and age options from the combinations that exist. Options that do not have a matching row become unavailable in the UI, which blocks invalid species/colour/age combinations automatically.
- Age buckets are inferred with the following defaults (in days):
  - `egg`: explicit override only
  - `1week`: 0–6 days
  - `2weeks`: 7–13 days
  - `3weeks`: 14–20 days
  - `1month`: 21–44 days
  - `2months`: 45–74 days
  - `3months`: 75–104 days
  - `4months`: 105–134 days
  - `5months`: 135–164 days
  - `6months`: 165–194 days
  - `7months`: 195–224 days
  - `8months`: 225–254 days
  - `9months`: 255–284 days
  - `10months`: 285–314 days
  - `11months`: 315–344 days
  - `12months`: 345–374 days
  - `adult`: 375+ days

  These buckets can be refined later; for now they mirror the age options already exposed in the storefront.

- Variant prices are left as absolutes. When the customer chooses a colour and an age the application looks up the matching row and uses its price and availability. The legacy `priceModifier` fields are derived on the fly for backward compatibility but are no longer the source of truth.

### CSV export

The fallback `catalog.csv` uses the same column order and header names. Keep both files in sync when regenerating the catalog.
