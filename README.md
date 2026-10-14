# Pulseboard

**Live demo:** https://pulseboard-phi-blush.vercel.app/

A personalized content dashboard built with Next.js, React, TypeScript and Redux Toolkit. News, movie recommendations and public community posts share one responsive feed. The app works immediately without credentials, with clearly labeled fictional samples. Public Hacker News technology stories and Mastodon hashtag posts load without keys. Add server-side TMDB and optional Guardian keys for movies and wider news coverage.

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
TMDB_API_KEY=your_tmdb_v3_api_key
GUARDIAN_API_KEY=your_guardian_developer_key
```

Restart the server after changing keys. Never commit `.env.local`, share keys in screenshots or prefix them with `NEXT_PUBLIC_`. All external providers are called only from the Next.js server route. No key is sent in `/api/feed` responses. Failed or rate-limited providers fall back to labeled sample content with a visible notice. Public Mastodon posts are live when the public API succeeds, with labeled samples on failures.

NewsAPI's free Developer plan is development-only, not for this public deployment. The retained adapter requires BOTH `NEWS_PROVIDER=newsapi` and `NEWS_API_KEY`; only select it with a production-eligible plan. A key alone does not enable it. Guardian Developer keys support non-commercial student/demo sites, subject to registration for this website, 1 request/sec and 500/day. Register at https://open-platform.theguardian.com/access/ and set `GUARDIAN_API_KEY` server-side in Vercel, then redeploy. Guardian attribution appears adjacent to its cards. Do not claim sample data is live. Credentialed Guardian access is tested with mocked HTTP responses until a user key is configured; do not claim all-category real news without checking Source transparency.

## User flow

1. Open Settings and select interests (at least one is required). Optionally edit the local display name and social hashtags.
2. Browse the unified My feed. Cards display source, type, category, image and description. Real items link to their source; samples deliberately have no fake external destination.
3. Search across news, films and social posts. Queries debounce for 350ms. Movie search uses TMDB search when configured; Guardian supports news search; HN and Mastodon search filters the bounded fetched results locally. This is not exhaustive social/news search.
4. Save items with the heart button. Favorites preserve snapshots even after preferences change or a provider refresh removes an item.
5. View Trending, which sorts TMDB popularity, HN points, Mastodon reactions and demo editorial scores. It is explicitly not a comparable global popularity ranking across sources.
6. Drag a card using its grip to reorder the current page. Framer Motion handles vertical pointer drag. Because the desktop layout is a multi-column grid, use the up/down controls for precise adjacent moves, including same-row ordering. Both routes persist order. Each page has six items.
7. Toggle dark mode and reload to confirm settings, favorites and manual order persist in this browser.

## Features and architecture

- Next.js App Router with a server-side `/api/feed` route.
- Typed Redux Toolkit slice and abortable async thunk for loading/error/content state.
- Default keyless HN stories cover Technology only. Science, Sports, Finance and Entertainment use optional Guardian sections (science, sport, business, film/music/culture/tvandradio); without that key these news categories remain labeled samples. The retained opt-in NewsAPI adapter supports headlines/search.
- TMDB discover/search. Interest-to-genre mapping is deliberately simple: technology maps to sci-fi, science to documentary/sci-fi, sports to documentary, finance to drama/documentary, entertainment to comedy/adventure. It is preference-based, not machine-learning recommendations.
- Mastodon public hashtag timelines, unified interleaved feed, favorites and trending.
- Bounded provider requests (8s), HTTPS-only external links, adult movie filtering, responsive image fallback.
- LocalStorage persistence with schema checks and corrupt-storage recovery.
- Accessible labels, keyboard move buttons, native modal focus handling, empty/error states and reduced-motion CSS.
- Original local SVG illustration assets for sample, HN, Guardian and Mastodon cards. Real movie posters load from TMDB. Illustrations on real news/social cards are not source photographs.

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

Use a Node-capable Next.js host (for example import this repo into Vercel) with framework preset Next.js. Set server-only environment variables in the host's secret settings if your provider plans allow it. Deploying without keys shows the labeled demo. GitHub Pages does not run the required server API route. The public demo is hosted on Vercel: https://pulseboard-phi-blush.vercel.app/. Provider modes are shown in Source transparency; Source transparency reports each provider separately, including mixed news coverage. To use live movies, add the server-only `TMDB_API_KEY` in Vercel and redeploy.

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

## Provider credits

The About & credits section includes the approved TMDB logo and the required attribution notice. The logo in `public/brand/tmdb.svg` is the unmodified blue short SVG from [TMDB's official brand assets](https://www.themoviedb.org/about/logos-attribution). It links to TMDB and is smaller than the Pulseboard mark. See the [API FAQ](https://developer.themoviedb.org/docs/faq) and [API terms](https://www.themoviedb.org/api-terms-of-use?language=). Free API use is for non-commercial projects with attribution; commercial use requires a separate agreement.

## Public provider scope and terms

- Hacker News: https://github.com/HackerNews/API publishes public near-real-time data, currently with no published rate limit. This app reads the first 18 top stories and labels them Technology; it does not pretend HN covers all five interests. Titles link to originals, with HN submitter/points attribution.
- Mastodon: https://docs.joinmastodon.org/methods/timelines/ documents public hashtag reads; some instances require authentication. Verified mastodon.social accepts public reads. Default documented and observed quota is 300 requests/5 minutes (https://docs.joinmastodon.org/api/rate-limits/). Server-side requests avoid depending on browser CORS. One timeline request combines up to five hashtags; reads are cached for five minutes. This is a limited public discovery feed, not a user's private/home timeline and not all of Mastodon. Terms: https://mastodon.social/terms . Authors retain content rights. No media is copied; text is stripped to plain text, original authors/posts are linked, and sensitive/content-warning/private/boosted posts are excluded. Public posts are user-generated, not verified reporting; moderation is not guaranteed.
- Guardian: non-commercial developer usage is permitted subject to its website-specific key and terms: https://open-platform.theguardian.com/access/ and https://www.theguardian.com/open-platform/terms-and-conditions . One multi-section request returns metadata/trail text with full headline, byline, copyright and original link; approved Powered by The Guardian branding is shown only beside Guardian content (https://www.theguardian.com/open-platform/logos). No full article bodies are republished. Before commercial use obtain the appropriate license.
- All upstream requests have an 8-second timeout. Keyless HN/Mastodon and optional Guardian reads cache for five minutes. This reduces repeated calls but is not an account-wide quota guarantee across concurrent Vercel instances; monitor limits before large-scale use. Failed providers fall back visibly, never silently claim live data. A successful empty search remains empty.
- Assignment deviation: the public default uses HN/optional Guardian instead of NewsAPI to avoid its free production restriction; the NewsAPI implementation remains available with an eligible plan. TMDB is retained. Social is real public Mastodon rather than mock data, not Twitter/Instagram or a login-based social feed. Say these choices honestly in the recording.
