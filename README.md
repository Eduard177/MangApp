# Manga Reader App 📚

A manga reading application built with **React Native** using **Expo** and the **MangaDex API**, featuring advanced functions like chapter downloads, incognito mode, reading history, and custom filters.

---

## 🚀 Key Features

- 🔍 Browse manga by genre and popularity
- 📥 Full or individual chapter downloads
- 🕵️ Incognito mode that doesn’t save reading history
- 🧠 Smart reading progress tracking
- 📌 View read, unread, downloaded, and in-progress chapters
- ⚙️ Custom filters via dynamic modal
- 🌙 Full support for dark mode
- 📶 Offline access for downloaded manga
- 🔔 Pop-up notifications using `react-native-toast-message`

---

## 🧱 Technologies Used

- **React Native (Expo)**
- **TypeScript**
- **React Navigation**
- **NativeWind** (Tailwind for RN)
- **react-native-modalize** (slide-in modals)
- **react-native-toast-message** (toast notifications)
- **AsyncStorage** for local storage
- **MangaDex API** for content

## ⚙️ Installation & Run

1. Clone this repository:

```bash
git clone https://github.com/Eduard177/MangApp.git
cd mangApp
````

2. Install dependencies:

```bash
npm install
```

3. Start the app:

```bash
npx expo start
```

---

## 📥 Advanced Features

### 🔄 Chapter Downloads

* Supports bulk downloads via `handleDownloadAllChapters`
* Progressive feedback with `Toast`
* Local deletion by manga or chapter

### 🔍 Saved Manga Filters

You can filter saved manga by:

* ✅ Downloaded
* 📖 Unread
* ✔️ Completed
* 🟡 Started

Implemented using `FilterModal.tsx`.

### 🕵️ Incognito Mode

When enabled:

* Reading history is not saved
* No visual markers are applied to read chapters

Managed via the global context `IncognitoContext`.

---

## 🧪 Performance Best Practices

* Efficient `FlatList` with `keyExtractor`
* Avoid unnecessary renders using `React.memo` where needed
* Cache handling during exploration (`AsyncStorage`)
* Prevent unnecessary `setState` calls using `useCallback` and `useRef`

---

## 🧠 Cache Mode

Explored manga is cached locally to reduce API calls. Uses `AsyncStorage` and `Date.now()` to invalidate cache if it surpasses a defined time threshold (e.g., 1 hour).

---

## 📋 Future To-Do

* [ ] Add OAuth login
* [ ] Cloud sync
* [ ] Push notifications for new chapters
* [ ] Support for multiple reading languages

---

## 🧑‍💻 Author

**Eduard José Pichardo Rochet**

* GitHub: [@Eduard177](https://github.com/Eduard177)
* Email: [eduarro2001@gmail.com](mailto:eduarro2001@gmail.com)

---

## 📜 MangaDex API Terms of Use

Usage of our services implies acceptance of the following:

* **You MUST credit us (MangaDex)**
* **You MUST credit scanlation groups if you offer the ability to read chapters**
* **You CANNOT run ads or paid services on your website and/or apps**
* **These terms may change at any time for any or no reason. It is your responsibility to check for updates periodically**

---

## 📄 License

MIT © 2025 - MangApp

