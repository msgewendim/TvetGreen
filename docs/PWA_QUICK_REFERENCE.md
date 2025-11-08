# PWA Quick Reference Guide

Quick reference for common PWA tasks and configurations.

## Quick Commands

```bash
# Build web app with PWA support
pnpm run build:web

# Serve build locally for testing
npx serve dist

# Customize HTML template (if needed)
npx expo customize public/index.html
```

## File Locations

| File | Location | Purpose |
|------|----------|---------|
| PWA Config | `app.json` → `web` section | App metadata, display mode, colors |
| HTML Template | `public/index.html` | HTML template with PWA meta tags |
| Manifest | `public/manifest.json` | PWA manifest file |
| Icons | `public/logo192.png`, `public/logo512.png` | App icons for installation |
| Build Script | `scripts/add-pwa-manifest.js` | Post-build file copying |

## Key Configuration Values

### app.json (web section)
```json
{
  "display": "standalone",        // standalone | fullscreen | minimal-ui
  "themeColor": "#000000",        // Browser UI color
  "backgroundColor": "#ffffff",   // Splash screen color
  "startUrl": "/",                // Entry point URL
  "scope": "/"                    // PWA scope
}
```

### manifest.json
```json
{
  "short_name": "TvetGreen",     // Home screen name (short)
  "name": "TvetGreen Skill Hub",  // Full app name
  "display": "standalone",        // Must match app.json
  "start_url": ".",              // Entry point (relative)
  "theme_color": "#000000",       // Must match app.json
  "background_color": "#ffffff"  // Must match app.json
}
```

## Testing Checklist

- [ ] Build completes without errors
- [ ] `dist/manifest.json` exists and is valid JSON
- [ ] `dist/index.html` includes manifest link
- [ ] Icons load correctly (`logo192.png`, `logo512.png`)
- [ ] Install prompt appears in Chrome/Edge
- [ ] App installs successfully
- [ ] App opens in standalone mode
- [ ] Theme color matches browser UI

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Manifest 404 | Check `public/manifest.json` exists and was copied to `dist/` |
| Icons broken | Verify icon files exist in `public/` and were copied to `dist/` |
| No install button | Ensure HTTPS (or localhost), check manifest is valid JSON |
| Opens in browser | Verify `display: "standalone"` in both app.json and manifest.json |
| Wrong theme color | Ensure `themeColor` in app.json matches `theme_color` in manifest |

## Browser DevTools

**Chrome DevTools → Application Tab:**
- **Manifest**: View manifest details and errors
- **Service Workers**: Check SW registration (if implemented)
- **Storage**: View cached data

**Test Installation:**
1. Open DevTools (F12)
2. Application → Manifest
3. Check for errors
4. Verify icons load
5. Test "Add to Home Screen" button

## Icon Sizes

| File | Size | Purpose |
|------|------|---------|
| `favicon.ico` | 16x16, 32x32 | Browser tab icon |
| `logo192.png` | 192x192 | Minimum PWA icon |
| `logo512.png` | 512x512 | High-DPI displays |

## Display Modes

| Mode | Description |
|------|-------------|
| `standalone` | No browser UI, app-like experience |
| `fullscreen` | Full screen, no system UI |
| `minimal-ui` | Minimal browser UI |
| `browser` | Standard browser (default) |

## Related Documentation

- [Full PWA Setup Guide](./PWA_SETUP.md) - Complete implementation details
- [Expo PWA Docs](https://docs.expo.dev/guides/progressive-web-apps/) - Official Expo guide

