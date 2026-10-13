# Pulseboard

A personalized content dashboard built with Next.js, React, TypeScript and Redux Toolkit. News, movie recommendations and mock social posts share one responsive feed. The app works immediately without credentials, with clearly labeled fictional samples. Add server-side keys to connect NewsAPI and TMDB.

## Run on Windows (PowerShell)

Install Node.js 22 LTS and Git first. Then:

```powershell
git clone https://github.com/Prajit-22/pulseboard.git
cd pulseboard
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000. No Python, database, Ollama or GPU is required. Keep the terminal open. Use Ctrl+C to stop the server.

### Optional real APIs

Edit `.env.local` locally (for example `notepad .env.local`):

```dotenv
NEWS_API_KEY=your_newsapi_key
TMDB_API_KEY=your_tmdb_v3_api_key
```

Restart the server after changing keys. Never commit `.env.local`, share keys in screenshots or prefix them with `NEXT_PUBLIC_`. NewsAPI and TMDB are called only from the Next.js server route. No key is sent in `/api/feed` responses. Failed or rate-limited providers fall back to labeled sample content with a visible notice. Social posts are intentionally mocked.

NewsAPI developer plans have deployment restrictions; check your current provider plan before a public production deployment. Do not claim sample data is live. Live credentials were not available during verification: real-response parsing was tested with mocked HTTP responses, not paid/credentialed provider access.

## User flow

1. Open Settings and select interests (at least one is required). Optionally edit the local display name and social hashtags.
2. Browse the unified My feed. Cards display source, type, category, image and description. Real items link to their source; samples deliberately have no fake external destination.
3. Search across news, films and social posts. Queries debounce for 350ms. Movie search uses TMDB search when configured, news search uses NewsAPI everything, and mock content is searched locally.
4. Save items with the heart button. Favorites preserve snapshots even after preferences change or a provider refresh removes an item.
5. View Trending, which sorts TMDB popularity and demo editorial scores. It is explicitly not a comparable global popularity ranking across sources.
6. Drag a card using its grip to reorder the current page. Framer Motion handles vertical pointer drag. Because the desktop layout is a multi-column grid, use the up/down controls for precise adjacent moves, including same-row ordering. Both routes persist order. Each page has six items.
7. Toggle dark mode and reload to confirm settings, favorites and manual order persist in this browser.

## Features and architecture

- Next.js App Router with a server-side `/api/feed` route.
- Typed Redux Toolkit slice and abortable async thunk for loading/error/content state.
- NewsAPI category headlines and query search; finance maps to the API's business category.
- TMDB discover/search. Interest-to-genre mapping is deliberately simple: technology maps to sci-fi, science to documentary/sci-fi, sports to documentary, finance to drama/documentary, entertainment to comedy/adventure. It is preference-based, not machine-learning recommendations.
- Mock social hashtag filtering, unified interleaved feed, favorites and trending.
- Bounded provider requests (8s), HTTPS-only external links, adult movie filtering, responsive image fallback.
- LocalStorage persistence with schema checks and corrupt-storage recovery.
- Accessible labels, keyboard move buttons, native modal focus handling, empty/error states and reduced-motion CSS.
- Original local SVG illustration assets. External news/movie images load only when live APIs return them.

```text
src/app/api/feed/route.ts  Request validation and JSON response
src/lib/providers.ts      External adapters, fallback and normalization
src/lib/store.ts          Redux state and asynchronous loading
src/lib/storage.ts        Persistence validation and defaults
src/lib/selectors.ts      Filtering, sorting and page reorder
src/components/           Dashboard and card UI
public/art/               Original sample illustrations
```

## Tests and production build

```powershell
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Vitest + React Testing Library cover selectors, preferences, corrupt storage, favorites, provider failures, live-response normalization, invalid responses, fetched content, empty states and errors. Playwright covers debounced search, saved favorites/theme, preferences, pagination, keyboard reorder, real pointer drag and 320/390px layout. The visual test saves desktop/mobile/dark/settings screenshots. GitHub Actions repeats checks on new changes.

For production locally:

```powershell
npm run build
npm start
```

## Deploy

Use a Node-capable Next.js host (for example import this repo into Vercel) with framework preset Next.js. Set server-only environment variables in the host's secret settings if your provider plans allow it. Deploying without keys shows the labeled demo. GitHub Pages does not run the required server API route. No hosted public deployment is included yet; the local run is fully supported.

## Limitations and honest submission notes

- No authentication: profile is local browser personalization, not an account. Optional auth/realtime/i18n bonuses are intentionally omitted.
- No database or cross-device sync. Clearing browser storage removes saved preferences and favorites.
- Pagination covers returned API results; this build does not fetch unlimited provider pages.
- Favorites snapshot persistence can outlast a source URL or image.
- Public deployments should add shared caching/rate limiting before large-scale use. The app does not implement an account-wide provider quota layer.
- Video must demonstrate the mode actually used. Record yourself; do not call sample content real API results.
- The original assignment describes hosting as optional near the top but lists a Live Link in final submission guidelines. Confirm submission expectations rather than treating localhost as a hosted link.

TMDB attribution: This product uses the TMDB API but is not endorsed or certified by TMDB. Movie data and images belong to their respective owners.

See [demo walkthrough](docs/demo.md) for a recording outline and [design notes](docs/design.md) for implementation decisions.
