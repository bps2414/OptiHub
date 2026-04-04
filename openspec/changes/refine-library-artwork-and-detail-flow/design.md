## Context

Phase 4 is implemented, but user validation exposed three concrete issues:

- Library artwork hydration is unreliable: some cards stay without cover art until the user opens a game's detail and returns.
- Artwork presentation is inconsistent: landscape assets are being shown inside portrait card frames, which creates black bars or awkward composition.
- The product flow is confusing: users experience `Library` and `Games` as two competing top-level destinations when they really want one game hub with a built-in detail experience.

This refinement therefore needs to adjust the product flow, the metadata pipeline, and the artwork presentation rules without undoing the useful Phase 4 work already shipped:

- Phase 3 provenance rules still stand.
- Phase 4 rich browsing still stands.
- Offline-first behavior still stands.
- Compliance and official-source bias still stand.

## Goals / Non-Goals

**Goals:**

- Make Library the single primary game surface and move detail into that same flow.
- Remove `Games` from the sidebar and treat any legacy `/games` route only as a compatibility path, not a first-class destination.
- Ensure library cards hydrate portrait-friendly artwork without requiring a prior detail visit.
- Make metadata caches locale-aware so `pt-BR` users do not default to English metadata when localized content is available.
- Prefer portrait artwork for cards and avoid letterboxing landscape headers in portrait slots.
- Split library-card artwork from detail-hero artwork so each surface can use the right asset shape.
- Preserve separate Steam/manual entries and compliant source handling.

**Non-Goals:**

- Reworking the broader product information architecture outside the game flow.
- Removing provenance distinctions between Steam and Manual entries.
- Automatically adopting a third-party artwork provider as the default without compliance review.
- Pulling recommendation, preset, or tool-state content into this refinement.

## Decisions

### 1. Collapse the user-facing game flow into Library-first navigation and remove `Games` from the sidebar

Library will become the sole top-level game destination for normal browsing and detail access. Detail should open within the library flow, such as a nested route like `/library/:gameId`, rather than requiring the user to conceptually switch to a separate Games section. The legacy `Games` route may remain only as a redirect or compatibility alias, but it should no longer appear as a primary sidebar destination.

Alternatives considered:

- Keep `Games` as a second top-level destination: rejected because the user explicitly found the split confusing.
- Replace detail with a modal only: rejected because deep linking and back/forward navigation remain useful.

### 2. Model library-card art and detail-hero art as separate metadata concerns

Browse cards need consistent portrait-oriented assets, while detail views can tolerate a wider variety of aspect ratios. The artwork pipeline should therefore expose separate concepts such as `libraryPortraitArt` and `detailHeroArt`, rather than trying to make one `coverArtAssetUrl` work for both surfaces.

Alternatives considered:

- Reuse the same image payload for cards and detail everywhere: rejected because it directly caused the letterboxing/cropping issues seen in testing.
- Stretch or contain landscape headers inside portrait cards: rejected because it produces poor visual quality.

### 3. Use SteamGridDB as the approved portrait fallback for library cards

The metadata pipeline should first exhaust portrait-capable Steam-family assets. If those do not exist for a title, the system should use SteamGridDB as the approved portrait fallback for 600x900-style library card art. The fallback is for library portrait assets specifically, not a blanket replacement for all metadata.

Alternatives considered:

- Use any available landscape header as the card image: rejected because it creates black bars and low-quality presentation.
- Switch immediately to a third-party provider for all titles: rejected because it would bypass the existing compliance and official-source rules.

### 4. Make library hydration explicit instead of incidental

Library cards should update when pending artwork or localized metadata finishes hydrating, without depending on a detail-page visit. This should be driven by an explicit cache refresh or event-driven state update keyed to the current locale and pending app ids.

Alternatives considered:

- Keep the current passive behavior and trust later refreshes: rejected because the bug was already visible in user testing.
- Fetch everything synchronously before showing Library: rejected because it would harm perceived performance and offline resilience.

### 5. Localize cached metadata by locale key

Metadata cache records should be stored and read per locale so Portuguese users can receive Portuguese metadata when the provider offers it, while still falling back gracefully if only English content exists.

Alternatives considered:

- Keep one shared cache for all locales: rejected because it makes the first fetched language leak into later sessions regardless of user preference.

## Risks / Trade-offs

- [Risk] Removing `Games` from the sidebar could leave stale deep links or navigation expectations. -> Mitigation: keep a compatibility redirect while making Library the only visible destination.
- [Risk] Portrait-art selection may vary across providers and titles. -> Mitigation: define a strict provider-precedence and fallback rule rather than ad hoc image use.
- [Risk] Splitting artwork into card and detail variants increases metadata complexity. -> Mitigation: keep the split limited to two explicit asset roles instead of a broad asset taxonomy.
- [Risk] Locale-aware caches can duplicate metadata storage. -> Mitigation: cache only the fields needed for browse/detail and reuse shared identifiers where possible.
- [Risk] Event-driven or follow-up hydration may introduce state complexity in the games store. -> Mitigation: keep hydration status keyed to explicit app ids and locale rather than adding a generic reactive cache system everywhere.

## Migration Plan

1. Refine `app-shell-ui`, `game-library`, and `metadata-cache` specs around the validated UX issues.
2. Rework the navigation/route model so Library owns both browse and detail, and `Games` leaves the sidebar.
3. Tighten the metadata contract so library portrait art and detail hero art are selected independently.
4. Add SteamGridDB as the approved portrait fallback path for library cards when Steam-family art is insufficient.
5. Update the library UI so hydrated artwork appears without requiring a detail detour.
6. Re-validate the Death Stranding-style landscape-header case and the localized metadata case before closing the change.

Rollback strategy:

- If the single-surface library flow regresses navigation, keep the old route behind a redirect while preserving the new card-art and locale-cache fixes.
- If portrait fallback sourcing proves too risky or non-compliant, keep the stricter placeholder rule and defer third-party fallback to a separate approved change.

## Open Questions

- Should the legacy `/games` route redirect to `/library` root or to the currently selected `/library/:gameId` detail when enough state exists to infer it?
- If both Steam and SteamGridDB offer portrait assets, how should the app rank official-but-weaker art against community-but-better-composed art for the library card?
