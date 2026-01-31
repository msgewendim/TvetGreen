# Skills Training Platform MVP
## Technical Documentation

**Status**: Ready for Development  
**Target**: 50 pilot users (Uganda)  
**Timeline**: 8 weeks

---

## Quick Summary

**What we're building**: A mobile learning app that delivers localized skills courses to East African learners, starting with a pilot of 50 Ugandan businesswomen learning digital literacy.

**Core value**: Access to quality courses from global partners (Campus IL), not the technology itself. The platform should be simple, reliable, and get out of the way.

**Key constraints**:
- Offline-first (unreliable connectivity)
- Low-end Android devices (1-2GB RAM)
- Phone-based identity (no email)
- Solo developer (simplicity over cleverness)

---

## Documentation Index

| Document | Purpose |
|----------|---------|
| [MVP_PRD.md](./MVP_PRD.md) | Product requirements, user stories, success metrics |
| [MVP_ARCHITECTURE.md](./MVP_ARCHITECTURE.md) | System design, data flows, infrastructure |
| [MVP_TECH_STACK.md](./MVP_TECH_STACK.md) | Technology choices and rationale |
| [MVP_DATABASE.md](./MVP_DATABASE.md) | PostgreSQL + SQLite schemas |
| [MVP_FEATURES.md](./MVP_FEATURES.md) | Screen specs, UI details, MoSCoW prioritization |
| [MVP_API.md](./MVP_API.md) | API endpoints, request/response formats |
| [MVP_ROADMAP.md](./MVP_ROADMAP.md) | 8-week development plan |

---

## MVP Scope (What We're Building)

### Included
- ✅ Phone + OTP authentication
- ✅ Course browsing and enrollment
- ✅ Video playback with progress tracking
- ✅ Offline video downloads
- ✅ Automatic sync when online
- ✅ Basic profile and storage management

### Explicitly Excluded
- ❌ Voice navigation (future: non-literate users)
- ❌ Multiple languages UI (future: Luganda, Swahili)
- ❌ Quizzes/assessments
- ❌ Completion certificates
- ❌ Payments
- ❌ Admin dashboard
- ❌ Community features

---

## Tech Stack Summary

| Layer | Choice |
|-------|--------|
| Mobile | React Native (Expo) |
| State | Zustand |
| Local DB | expo-sqlite |
| Video | expo-av |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Auth | SuperTokens |
| SMS | Africa's Talking |
| Storage | AWS S3 + CloudFront |

---

## Getting Started

### Prerequisites
```bash
node >= 20
npm >= 10
expo-cli
postgresql (local or RDS)
```

### Backend Setup
```bash
cd server
npm install
cp .env.example .env  # Configure DB, Africa's Talking, etc.
npm run db:migrate
npm run dev
```

### Mobile Setup
```bash
cd app
npm install
npx expo start
```

### Environment Variables

**Server (.env)**:
```
DATABASE_URL=postgresql://...
SUPERTOKENS_CONNECTION_URI=...
AFRICASTALKING_API_KEY=...
AFRICASTALKING_USERNAME=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET=...
```

**Mobile (app.config.js)**:
```javascript
export default {
  extra: {
    apiUrl: process.env.API_URL || 'http://localhost:3000',
  },
};
```

---

## Key Decisions Made

| Decision | Rationale |
|----------|-----------|
| Expo managed workflow | Faster dev, OTA updates, solo developer |
| SQLite for offline | Relational queries, mature, simple |
| SuperTokens self-hosted | Data sovereignty, OTP support built-in |
| Africa's Talking | Best SMS coverage in East Africa |
| Last-write-wins sync | Simple, predictable, good enough for MVP |
| No quizzes | Completion tracking sufficient for digital literacy |

---

## Questions to Resolve

| Question | Owner | Status |
|----------|-------|--------|
| Final list of 50 pilot users | Co-founder | Pending |
| Campus IL course access | Co-founder | Confirmed |
| Uganda org contact info | Co-founder | Pending |
| Video hosting budget approval | You | Pending |

---

## Success Metrics (Pilot)

| Metric | Target |
|--------|--------|
| Login success rate | 90% |
| Week 1 retention | 70% |
| Course completion | 40% |
| Crash-free sessions | 99% |

---

## Changelog

| Date | Change |
|------|--------|
| Jan 2025 | Initial MVP documentation |
