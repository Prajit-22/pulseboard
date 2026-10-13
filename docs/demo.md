# 4–6 minute recording outline

Start the app, hide `.env.local`, and record the browser plus your explanation.

1. Introduce Pulseboard and name the stack: Next.js, React, TypeScript, Redux Toolkit.
2. Explain the source badges honestly. With no keys, say "This is labeled demo data; the server-side adapters support NewsAPI and TMDB." With working keys, show live badges and one real source link.
3. Open settings, change interests and name, close it and reload. Explain LocalStorage persistence.
4. Search "cosmos" in demo mode or a returned title in live mode. Explain the 350ms debounce and aborting stale requests.
5. Save a card, visit Favorites, reload, then return to My feed.
6. Drag a card with the grip; use the arrow buttons to show precise and keyboard-accessible ordering. Visit page two.
7. Toggle dark mode. Show the mobile responsive view using browser developer tools.
8. Show Trending and explain the score limitations. Show a no-result search and retry/error test if useful.
9. Briefly open providers.ts, store.ts and the tests. Explain server-only keys, fallback and snapshots.
10. Show `npm test`, `npm run build`, and `npm run test:e2e` output from your own machine if available.

Be ready to explain why there is no login (optional bonus), how each interest maps to movie genres, and why sample cards do not have fake source links.
