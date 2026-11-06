# Architecture

This document describes the technical structure of yoobify, both as it is today and as we envision it for the future.

---

##  Current Architecture (v0.2.0)

yoobify is a **static, vanilla JavaScript web application** with no build tools or frameworks required. This keeps the project simple, accessible, and easy for contributors of all levels to understand.

### Tech Stack (Current)

| Layer        | Technology                          | Status      |
|--------------|-------------------------------------|-------------|
| Frontend     | HTML5, CSS3, Vanilla JavaScript     | ✅ Active   |
| Styling      | Custom CSS (Linear Design System)   | ✅ Active   |
| Icons        | Font Awesome                        | ✅ Active   |
| Fonts        | Google Fonts (Inter, Tajawal)       | ✅ Active   |
| Hosting      | GitHub Pages                        | ✅ Active   |
| CI/CD        | GitHub Actions                      | ✅ Active   |
| APIs         | Deezer API (public)                 | ✅ Active   |
| Backend      | None (client-side only)             | —           |

### Folder Structure
