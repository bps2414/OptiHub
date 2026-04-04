## 1. Library-first navigation flow

- [x] 1.1 Refactor the game flow so Library becomes the single primary navigation surface for browsing and detail access.
- [x] 1.2 Remove `Games` from the sidebar and convert the legacy route into a compatibility redirect or alias that no longer reads as a competing hub.
- [x] 1.3 Update the relevant route, sidebar, and i18n copy so the new single-surface game flow is clear and consistent.

## 2. Artwork pipeline and metadata hydration

- [x] 2.1 Refine the metadata pipeline to model library portrait art separately from detail hero art and to avoid rendering letterboxed landscape headers inside portrait card slots.
- [x] 2.2 Implement an explicit library hydration path so card artwork updates in Library when background metadata refresh completes, without requiring a detail-page visit first.
- [x] 2.3 Make metadata caching locale-aware so card and detail descriptions respect the active app language when localized provider content exists.

## 3. Fallback and presentation quality

- [x] 3.1 Implement SteamGridDB as the approved 600x900-style portrait fallback when Steam-family sources do not provide a good vertical asset for the library card.
- [x] 3.2 Add the provider-selection logic and cache rules needed to rank Steam-family portrait art, SteamGridDB fallback art, and local placeholders.
- [x] 3.3 Tune the library card and in-flow detail presentation so portrait art stays visually consistent while preserving Steam/manual provenance treatment.

## 4. Validation

- [x] 4.1 Add or update frontend and backend tests covering library hydration, locale-aware metadata caching, and the Library-first detail flow.
- [x] 4.2 Verify the previously reported edge cases, including landscape-header titles that produced black bars and Portuguese users receiving English metadata.
- [x] 4.3 Run the relevant verification suite (`pnpm test`, `pnpm lint`, `pnpm build`, and targeted or full `cargo test`) before closing the change.
