##  Current Architecture

yoobify is currently a **static, vanilla JavaScript web application** with no build tools or frameworks required. This keeps the project simple, accessible, and easy for contributors of all levels to understand.

### Tech Stack (Current)

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | HTML5, CSS3, Vanilla JavaScript     |
| Styling      | Custom CSS (Linear Design System)   |
| Icons        | Font Awesome                        |
| Fonts        | Google Fonts (Inter, Tajawal)       |
| Hosting      | GitHub Pages                        |
| Backend      | None yet (planned: Firebase)        |
| APIs         | None yet (planned: Spotify, Deezer) |

### Folder Structure

```text
yoobify/
├── public/              # Static files served to the browser
│   ├── index.html       # Main landing page
│   ├── style.css        # Global styles
│   ├── script.js        # Client-side logic
│   └── assets/          # Images, illustrations, icons
├── src/                 # Source code (for future modularization)
│   ├── components/      # Reusable UI components
│   ├── services/        # API integrations (Spotify, Deezer, etc.)
│   ├── utils/           # Helper functions
│   └── config/          # Configuration files
├── docs/                # Documentation
├── tests/               # Test files (future)
├── .github/             # GitHub templates and workflows
└── [root config files]  # README, LICENSE, CONTRIBUTING, etc.
```

### Data Flow (Current)

```text
User → Opens index.html → Browser renders HTML/CSS/JS
     → JavaScript fetches contributors from GitHub API
     → Displays static content + dynamic contributor list
```

---

##  Future Vision (Roadmap)

This section outlines where we want yoobify to go. If any of these excite you, please contribute!

### Phase 1: Core Functionality
- [ ] Integrate **Spotify Web API** for playlist analysis
- [ ] Integrate **Deezer API** for cross-platform matching
- [ ] Build the **playlist comparison engine** (find common tracks)
- [ ] Display results with song details, artists, and overlap percentage

### Phase 2: Smart Discovery
- [ ] Analyze **audio features** (BPM, key, energy, mood)
- [ ] Build a **similarity algorithm** to recommend songs across languages
- [ ] Support **cultural bridges** (e.g., Arabic pop ↔ Turkish pop ↔ Spanish pop)

### Phase 3: Multi-Language & Accessibility
- [ ] Implement **i18n (internationalization)** system
- [ ] Support **Arabic (RTL)**, English, French, Spanish, Turkish, and more
- [ ] Add **language switcher** in the UI
- [ ] Ensure full **accessibility (a11y)** compliance (WCAG 2.1)

### Phase 4: Mobile Experience
- [ ] Convert to **Progressive Web App (PWA)** with offline support
- [ ] Add **install prompt** for mobile devices
- [ ] Optimize touch interactions and mobile navigation
- [ ] (Long-term) Explore **native mobile app** (React Native or Flutter)

### Phase 5: Backend & User Accounts
- [ ] Integrate **Firebase** for authentication and database
- [ ] Allow users to **save playlists** and discovery history
- [ ] Build a **community features** (share discoveries, follow users)
- [ ] Add **real-time collaboration** on playlists

### Phase 6: Design & UX Improvements
- [ ] Refine the **linear design system** based on user feedback
- [ ] Add **dark mode** support
- [ ] Create **custom illustrations** for each section
- [ ] Improve **animations and micro-interactions**
- [ ] Conduct **user testing** and iterate

### Phase 7: More Platforms
- [ ] Apple Music API integration
- [ ] YouTube Music API integration
- [ ] SoundCloud API integration
- [ ] Anghami API integration
- [ ] Support for **local music files** (upload & analyze)

---

##  API Integrations (Planned)

| Platform      | API Status      | Notes                              |
|---------------|-----------------|------------------------------------|
| Spotify       | Planned         | Requires OAuth2 authentication     |
| Deezer        | Planned         | Public API, easier to integrate    |
| Apple Music   | Future          | Requires developer account         |
| YouTube Music | Future          | Limited official API               |
| SoundCloud    | Future          | API access restricted recently     |
| Anghami       | Future          | Regional API, needs research       |

---

##  How to Contribute to the Architecture

If you want to help shape the future of yoobify:

1. **Open an issue** to discuss a new feature or architectural change
2. **Propose a solution** with technical details
3. **Submit a Pull Request** with your implementation
4. **Update this document** to reflect the changes

We welcome ideas from developers, designers, and music lovers alike!

---

##  Additional Resources

- [Contributing Guide](../CONTRIBUTING.md)
- [Code of Conduct](../CODE_OF_CONDUCT.md)
- [Security Policy](../SECURITY.md)
- [Changelog](../CHANGELOG.md)
