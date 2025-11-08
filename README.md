# TvetGreen Skill Hub

TVET Green learning platform - Access courses and educational content.

## Features

- 📱 Progressive Web App (PWA) support - Install and use like a native app
- 🎥 Video-based learning with voice guidance
- 🌍 Multilingual support (English, Amharic, Swahili)
- 📚 Category-based courses (Agriculture, Green Energy, Construction, Business)
- 💾 Offline-first course downloads

## Getting Started

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Press `w` to open in web browser, `i` for iOS simulator, or `a` for Android emulator.

### Building for Web

```bash
# Build web app (includes PWA setup)
pnpm run build:web

# Serve the build locally
npx serve dist
```

## Documentation

- [PWA Setup Guide](./docs/PWA_SETUP.md) - Complete guide on Progressive Web App implementation
- [PWA Functionality Guide](./docs/PWA_FUNCTIONALITY.md) - What works in PWA vs web version
- [PWA Quick Reference](./docs/PWA_QUICK_REFERENCE.md) - Quick commands and configuration
- [Architecture Documentation](./docs/Architecture/) - Project architecture and design decisions

## Tech Stack

- **Framework**: Expo SDK 54 with React 19
- **Navigation**: Expo Router v6 (file-based routing)
- **Styling**: React Native StyleSheet with Tailwind CSS
- **State Management**: Zustand, React Query
- **Platforms**: iOS, Android, Web (PWA)

## License

Private project - All rights reserved
