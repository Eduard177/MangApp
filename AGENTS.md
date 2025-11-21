# Project Agents (Developer Guide)

## General Description

This repository is a React Native + Expo mobile app (MangApp) — a manga reader built around the MangaDex API. It focuses on a rich reading experience with offline capabilities: chapter downloads, reading progress, saved mangas, incognito mode, and UI features like filters and dark mode.

Primary UX flows:
- Browse, search and filter manga via MangaDex API
- View manga details and chapters
- Read chapters in vertical/horizontal readers
- Offline support: download single chapters or the whole manga
- Save favorite manga to local storage and continue reading carousel
- Incognito mode to avoid persisting reading history

## Architecture Overview

### App Shell
- `App.tsx`: Root component. Initializes navigation, theme, downloaded state, and global providers.
- `main.tsx`: Expo entry registering the app.

### Navigation
- `src/navigation/index.tsx` — uses React Navigation (native stack). Central route definitions live here. Keep `RootStackParamList` typed to ensure safe navigation.

### Screens & UI
- Located under `src/screens/` — `HomeScreen`, `ExploreScreen`, `MangaDetails`, `ChapterReaderScreen`, etc.
- Reusable UI pieces live in `src/components/` (`Navbar`, `MainBar`, `ChaptersTab`, `ContinueReadingCarousel`, `SavedMangas`, readers under `components/reading`).

### Services
- `src/services/mangadexApi.ts` — all calls to MangaDex (search, chapters, pages, tags, authors).
- `src/services/mangaService.ts` — wrapper helpers for core flows (e.g., fetch pages).
- `src/services/favorites.ts` — Save/remove favorites via AsyncStorage.
- `src/services/storage.ts` — Continue reading storage (saved to AsyncStorage).
- `src/services/backgroundDownloadMangaer.ts` — simple download queue for sequential downloads.

### Utilities and Offline
- `src/utils/downloadChapter.ts` and `src/utils/downloadManga.ts` — download and store chapters using Expo FileSystem and cache meta in AsyncStorage.
- `src/utils/readHistory.ts` — read/mark chapters read (AsyncStorage key: `readChapters`).
- `src/utils/getApiLang.ts` — language helper persisted via AsyncStorage `apiLanguage`.

### State Management
- `zustand` stores under `src/store`: filters, continue-reading, downloaded mangas, language, reader mode.
- Filtering uses `zustand/middleware` `persist` with `AsyncStorage`.

### Context
- `src/context/incognito-context.tsx` — simple context to enable/disable incognito mode across the app.

## Key Integration Points

- MangaDex API (HTTPS): `src/services/mangadexApi.ts` interacts directly with the API.
- AsyncStorage (`@react-native-async-storage/async-storage`): used for saving favorites, read history, continue reading, persistent filters, cached chapter metadata.
- Expo FileSystem (`expo-file-system`): used for storing downloaded chapters locally under `documentDirectory` (pattern: `${documentDirectory}/${mangaId}/${chapterId}/`).
- Toasts: `react-native-toast-message` for user feedback during downloads and operations.
- Modal & UI libs: `react-native-modalize`, `@gorhom/bottom-sheet` used for various modal interactions.

## Project Structure (key folders & files)

- App root: `App.tsx`, `main.tsx`, `package.json`
- src/
  - assets/components/ — custom inline SVG/postable icons
  - components/ — shared view components & readers
    - reading/ — `HorizontalPageReader`, `VerticalScrollReader`, `HorizontalPageReaderLTR`
    - loading/ — skeleton components
  - context/ — `incognito-context` provider
  - navigation/ — `index.tsx` (typed navigation stack)
  - screens/ — main screens & flows
  - services/ — network & storage services
  - store/ — Zustand stores (filters/persistence/reading/downloaded)
  - utils/ — download helpers, read history, transform helpers

## Conventions & Best Practices

### Code Style & Formatting
- Uses TypeScript, `nativewind` for Tailwind-like styles on RN, `prettier` and `eslint` for style and linting. Run `npm run format` and `npm run lint` for code style.

### Type Safety & Navigation
- Use `RootStackParamList` in `src/navigation/index.tsx` and in screen types (e.g., `useNavigation<NavigationProp<RootStackParamList>>()`) to keep navigation param typing consistent.

### Services & API
- `mangadexApi.ts` centralizes all API calls; re-use this service across screens and components. The module often performs the language query via `getApiLanguage()`.
- Keep network calls isolated from UI. Prefer calling these services in screens or in small helper functions rather than directly in components.

### Async Storage conventions
- Key constants are defined inline (e.g. `CONTINUE_READING_KEY`, `FAVORITES_KEY`, `CHAPTER_CACHE_KEY`, `READ_CHAPTERS_KEY`). When adding new persistent items, define a descriptive key and persist using AsyncStorage.
- Use `zustand` persist wrapper when you need reactive store + persistence (example: `useFilterStore`).

### Downloading & Offline
- Use the `downloadChapter` and `downloadManga` helpers. Files saved under `FileSystem.documentDirectory` follow the pattern: `/{mangaId}/{chapterId}/{fileName}`.
- For multiple downloads or heavy operations, queue tasks via `queueDownload` to avoid IO collisions.
- Keep metadata in AsyncStorage (e.g., `offline_chapters`). Prefer concise maps keyed by `chapterId`.

### Continue Reading
- The app stores an array of recent entries under `continue_reading` and maintains a small list (max ~100). Each entry: { mangaId, title, cover, lastReadChapterId, page, timestamp, chapter }.
- When reading (in the readers), code saves page positions via `saveMangaToContinueReading`.

### Incognito Mode
- `useIncognito()` provides `incognito` boolean and `toggleIncognito`. When `incognito` is true, reading progress should not be persisted.

### Favorites & Saved Manga
- Stored via `getSavedMangas` / `saveManga` / `removeManga` using `AsyncStorage` key `saved_manga` (max saved count currently 20). These stores contain `manga` object, `title` and `cover` for quick UI.

### Read Tracking
- `readHistory.ts` includes functions to mark chapters as read and fetch read chapters arrays. Screens use these to evaluate continue reading and progress indicators.

## Component & Screen Patterns

- Favor small single-purpose components.
- Use `FlatList` for lists and pass `keyExtractor` and `getItemLayout` when possible.
- For readers: `HorizontalPageReader` uses `FlatList` with paging and `inverted` property to display pages (and updates continue reading upon momentum end). `VerticalScrollReader` uses scroll view
- Keep UI logic in components; delegate business logic to service helpers.

## Error Handling & UX

- The project generally logs errors using `console.error()` and surfaces important notifications using `Toast`. When adding new integrations, prefer consistent logging and UI notifications for critical errors.

## Testing & Debugging

- There are no test frameworks installed by default. If you add unit or integration tests, prefer jest + react-native-testing-library and mock network and AsyncStorage.
- For `zustand` stores, tests can use direct access to the store with `store.getState()` and reset store between tests.

## Performance & Optimization Tips

- Use `FlatList` props (keyExtractor, getItemLayout, initialNumToRender) and `React.memo` to prevent unnecessary rerenders.
- For heavy tasks (downloads), be careful to queue requests and avoid parallel downloads beyond what the device can handle.
- Persist minimal state for offline; avoid saving large objects repeatedly in AsyncStorage.

## Recipes & Examples

### Download a Manga (sample flow)
```tsx
// Inside MangaDetails or any button handler
import { fetchAllChapters } from '../services/mangadexApi';
import { queueDownload } from '../services/backgroundDownloadMangaer';
import { downloadManga } from '../utils/downloadManga';

const allChapters = await fetchAllChapters(manga.id);
queueDownload(async () => {
  await downloadManga(manga.id, allChapters, (completed) => {
    // show progress via Toast or state
  });
});
```

### Mark a Chapter as Read
```ts
import { markChapterAsRead } from '../utils/readHistory';

await markChapterAsRead(chapterId);
```

### Save Continue Reading
```ts
import { saveMangaToContinueReading } from '../services/storage';

await saveMangaToContinueReading(manga, chapterId, pageIndex);
```

### Check If Chapter Downloaded
```ts
import { isChapterDownloaded } from '../utils/downloadChapter';

const isDownloaded = await isChapterDownloaded(mangaId, chapterId);
```

## Dev Commands
```bash
npm install
npm run start       # expo start
npm run android      # run on device/emulator (Android)
npm run ios          # run iOS (macOS + configured env)
npm run web          # run RM on web
npm run format       # prettier
npm run lint         # eslint
```

## Potential Improvements & TODOs
- Add a formal API abstraction layer that supports retries, cancellations, and stronger error types.
- Add unit/integration testing support (Jest) with mocked FileSystem and AsyncStorage.
- Provide typed DTOs/interfaces for Manga Dex responses to keep TypeScript safety stronger across code.
- Implement a global error UI and structured logger for easier debugging.
- Add optional background tasks using `expo-task-manager` for downloads if needed.

## Concluding notes

This project is a well-structured small-to-medium React Native app with a clear separation of concerns: screens, components, services, utils, and persisted state. Use the described patterns when adding features — keep services side-effect free, use `zustand` for simple state, and AsyncStorage for persistence. If you need help expanding or refactoring modules (e.g., converting to a repository pattern or adding a cloud sync), ask and I'll propose a migration plan.

---
Manga Reader App — Developer Agent Guide • 2025
