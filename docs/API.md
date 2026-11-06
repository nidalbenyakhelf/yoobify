## 🎵 Deezer API (Active)

### Overview

Deezer provides a public REST API that allows access to playlist data without authentication. This makes it perfect for our use case, as it allows users to analyze playlists without needing to log in or provide API keys.

### Base URL

```text
https://api.deezer.com
```

### Endpoints Used

#### Get Playlist

```http
GET /playlist/{id}
```

**Parameters:**
- `id` (required) — The numeric Deezer playlist ID.

**Example Request:**
```text
GET https://api.deezer.com/playlist/1313621735
```

**Example Response (Simplified):**
```json
{
  "id": 1313621735,
  "title": "Love Pop",
  "nb_tracks": 50,
  "creator": {
    "id": 123,
    "name": "Deezer Editor"
  },
  "tracks": {
    "data": [
      {
        "id": 123456,
        "title": "Song Title",
        "artist": {
          "name": "Artist Name"
        },
        "album": {
          "cover_medium": "https://..."
        },
        "preview": "https://cdns-preview-...mp3"
      }
    ]
  }
}
```

### Rate Limits

- **50 API calls per 5 seconds per IP address.**
- No authentication required for public endpoints.
- No daily quota limits documented for public data.

### CORS Support

✅ **Enabled** — The API supports Cross-Origin Resource Sharing, allowing direct browser requests without a backend proxy.

### Data We Use

From the playlist endpoint, yoobify extracts:
- `title` — Playlist name
- `nb_tracks` — Number of tracks
- `creator.name` — Playlist creator
- `tracks.data[]` — Array of track objects containing:
  - `title` — Track name
  - `artist.name` — Artist name
  - `album.cover_medium` — Album art (250x250px)
  - `preview` — 30-second MP3 preview URL

### Error Handling

| HTTP Status | Meaning | Our Response |
|-------------|---------|--------------|
| 200 | Success | Display playlist |
| 404 | Not Found | Show "Playlist not found" error |
| 429 | Rate Limited | Show "Too many requests" error |
| 500 | Server Error | Show "Try again later" error |

### Implementation Details

See `public/script.js` → `API.getDeezerPlaylist()` function.

```javascript
async getDeezerPlaylist(playlistId) {
    const url = `${CONFIG.DEEZER_API_BASE}/playlist/${playlistId}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Playlist not found. Please check the URL and try again.');
        }
        throw new Error('Failed to fetch playlist. Please try again later.');
    }
    
    return await response.json();
}
```

---

##  Future APIs

### Spotify Web API

**Status:** Planned

**Challenges:**
- Requires OAuth2 authentication with PKCE flow.
- More complex setup than Deezer.
- May require a backend service for token management.

**Endpoints We'll Need:**
- `GET /v1/playlists/{playlist_id}` — Get playlist details.
- `GET /v1/audio-features/{id}` — Get audio features (BPM, key, energy).

**Documentation:** [Spotify Web API Reference](https://developer.spotify.com/documentation/web-api/reference/)

### Apple Music API

**Status:** Future

**Requirements:**
- Apple Developer account.
- MusicKit JS for web integration.
- More restrictive than Deezer/Spotify.

**Documentation:** [Apple Music API](https://developer.apple.com/documentation/applemusicapi)

### YouTube Music API

**Status:** Future

**Challenges:**
- No official public API for music data.
- May require unofficial APIs or scraping (legal concerns).
- Alternative: Use YouTube Data API v3.

### SoundCloud API

**Status:** Future

**Challenges:**
- API access restricted since 2017.
- Requires approval for new applications.
- Limited functionality compared to Deezer/Spotify.

### Anghami API

**Status:** Future

**Notes:**
- Regional platform (Middle East & North Africa).
- API documentation limited.
- May require direct partnership.

---

##  Security Considerations

### API Keys

Currently, yoobify does **not** use any API keys because:
- Deezer API is public and requires no authentication.
- All data accessed is public (public playlists only).

**Future Considerations:**
- When adding Spotify, we'll need to handle OAuth2 tokens securely.
- API keys should **never** be committed to the repository.
- Use environment variables (`.env` file) for sensitive data.
- See `.env.example` for template.

### Rate Limiting

To prevent hitting Deezer's rate limit (50 calls/5 seconds):
- Implement client-side caching for repeated requests.
- Add debounce/throttle to user input.
- Consider using a backend proxy for high-traffic scenarios.

### CORS

All current API calls are made directly from the browser. This works because:
- Deezer API has CORS enabled.
- GitHub Pages serves over HTTPS (required for some APIs).

---

##  Performance Optimization

### Caching Strategy (Future)

```javascript
// Simple in-memory cache
const cache = new Map();

async function getPlaylist(id) {
    if (cache.has(id)) {
        return cache.get(id);
    }
    
    const data = await fetchFromAPI(id);
    cache.set(id, data);
    
    // Expire cache after 10 minutes
    setTimeout(() => cache.delete(id), 600000);
    
    return data;
}
```

### Lazy Loading

- Album art images use `loading="lazy"` attribute.
- Audio players use `preload="none"` to save bandwidth.
- Only load previews when user clicks play.

---

##  Testing APIs

### Manual Testing

1. **Valid Playlist:**
   ```text
   https://www.deezer.com/playlist/1313621735
   ```

2. **Invalid Playlist (404):**
   ```text
   https://www.deezer.com/playlist/999999999
   ```

3. **Invalid URL Format:**
   ```text
   https://www.deezer.com/album/123
   ```

### Automated Testing (Future)

```javascript
// Example test case
describe('Deezer API Integration', () => {
    it('should fetch playlist data successfully', async () => {
        const playlist = await API.getDeezerPlaylist('1313621735');
        expect(playlist.title).toBeDefined();
        expect(playlist.tracks.data.length).toBeGreaterThan(0);
    });
    
    it('should handle 404 errors gracefully', async () => {
        await expect(API.getDeezerPlaylist('999999999'))
            .rejects.toThrow('Playlist not found');
    });
});
```

---

##  Additional Resources

- [Deezer API Documentation](https://developers.deezer.com/api)
- [Deezer API Playground](https://developers.deezer.com/api/explorer)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Apple Music API](https://developer.apple.com/documentation/applemusicapi)
- [REST API Best Practices](https://restfulapi.net/)
