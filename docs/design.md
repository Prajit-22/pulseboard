# Design and tradeoffs

A same-origin server route keeps API keys out of client JavaScript. It validates categories, caps query length and uses a fixed provider origin rather than accepting arbitrary fetch URLs. HTTPS-only link normalization blocks dangerous URL protocols in source content.

The Redux thunk sends current interests, hashtags and debounced query. Cleanup aborts the previous request when those inputs change, so old responses do not overwrite a newer search. Provider failures are handled independently so one unavailable source does not erase the other source.

Favorites store full card snapshots, not only IDs. This keeps a saved item visible after preferences change. Storage is browser-local and best effort: denied/quota-limited storage is reported rather than silently pretending persistence succeeded.

Manual ordering uses stable IDs and preserves other pages. Framer Motion Reorder supports one axis, so vertical cross-row pointer movement is supported; same-row precise movement is provided by labeled up/down controls. That constraint is documented rather than claiming a two-dimensional drag system.

Pagination reduces rendered DOM but does not claim unbounded API coverage. Requests are limited to provider response sizes. Genre recommendations are a transparent hand-written mapping, not inferred viewing history.

Sample content and images are original fictional fixtures with no fabricated source links. Real content opens NewsAPI article URLs or TMDB detail URLs. Sample mode and provider failures are visible in the interface.

The initial build deliberately omits bonus authentication, realtime and multiple languages. Its priority is reliable core behavior, reproducible tests and clear boundaries. Production public traffic would benefit from shared provider caching, throttling, hardened response schemas and server-side account persistence.
