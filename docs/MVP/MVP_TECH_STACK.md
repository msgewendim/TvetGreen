# Technology Stack
## Skills Training Platform MVP

**Version**: 1.0  
**Last Updated**: January 2025

---

## Stack Summary

| Layer | Technology | Version |
|-------|------------|---------|
| Mobile App | React Native (Expo) | SDK 50+ |
| State Management | Zustand | 4.x |
| Local Database | expo-sqlite | Latest |
| Video Player | expo-av | Latest |
| Backend | Node.js + Express | 20 LTS |
| Database | PostgreSQL | 15+ |
| Auth | SuperTokens | Latest |
| SMS | Africa's Talking | API v2 |
| File Storage | AWS S3 | - |
| CDN | CloudFront | - |

---

## Mobile App

### React Native with Expo

**Choice**: Expo (managed workflow)

**Why Expo over bare React Native**:
- Faster development for solo developer
- OTA updates without Play Store review
- Easier video/offline handling with expo-av and expo-file-system
- EAS Build handles APK generation

**Why React Native over Flutter**:
- You already have React Native experience (from auth work)
- Larger ecosystem for specific needs (offline sync libraries)
- JavaScript/TypeScript consistency with backend

**Key Packages**:
```json
{
  "expo": "~50.0.0",
  "expo-router": "~3.4.0",
  "expo-av": "~13.10.0",
  "expo-file-system": "~16.0.0",
  "expo-sqlite": "~13.2.0",
  "expo-secure-store": "~12.8.0",
  "zustand": "^4.5.0",
  "supertokens-react-native": "^4.0.0"
}
```

### State Management: Zustand

**Why Zustand over Redux/MobX**:
- Minimal boilerplate (critical for solo dev speed)
- Built-in persistence support
- Simple mental model
- Works well with React Native

**Store Structure**:
```typescript
// authStore.ts - handles auth state
// courseStore.ts - courses, lessons, enrollments  
// downloadStore.ts - download queue, status
// syncStore.ts - offline queue, sync status
```

### Local Database: expo-sqlite

**Why SQLite over AsyncStorage/MMKV**:
- Relational queries needed (courses → lessons → progress)
- Better performance for structured data
- Can sync partial data efficiently
- Mature, battle-tested

**Why expo-sqlite over WatermelonDB**:
- Simpler API, less learning curve
- Sufficient for MVP data volumes
- WatermelonDB adds complexity we don't need yet

### Video Player: expo-av

**Why expo-av**:
- Native integration with Expo
- Offline playback support
- Background audio capability
- Playback position tracking built-in

**Alternative Considered**: react-native-video
- More features, but Expo compatibility issues
- expo-av is "good enough" for MVP

### File Downloads: expo-file-system

**Why**:
- Native to Expo
- Resumable downloads
- Storage management APIs
- Works offline

---

## Backend

### Node.js + Express

**Why Node.js**:
- JavaScript consistency (same language as frontend)
- Fast prototyping for MVP
- Large ecosystem for integrations
- Good enough performance for 50-5000 users

**Why Express over Fastify/Hono**:
- Most documentation and examples available
- SuperTokens has first-class Express support
- You likely have Express experience

**Why not serverless (Lambda)**:
- Cold starts hurt mobile UX
- Simpler debugging with traditional server
- Easier to reason about for solo dev
- Can move to serverless later if needed

### PostgreSQL

**Why PostgreSQL over MySQL/SQLite**:
- Better JSON support (useful for flexible schemas)
- JSONB for progress data that varies
- Industry standard, easy to find help
- Scales well beyond MVP

**Why not MongoDB**:
- Relational data (courses → lessons → progress)
- ACID compliance matters for progress tracking
- PostgreSQL JSONB gives flexibility when needed

### SuperTokens (Authentication)

**Why SuperTokens** (already decided):
- Self-hosted option (data sovereignty)
- Passwordless/OTP support out of box
- Session management handled
- Free for your scale

**Integration Notes**:
- Use passwordless recipe with phone
- Custom OTP delivery via Africa's Talking
- Configure refresh token rotation

### Africa's Talking (SMS)

**Why Africa's Talking** (already decided):
- Best coverage in East Africa (Uganda, Kenya, Tanzania)
- Competitive pricing for region
- Reliable delivery rates
- Simple API

**Pricing** (Uganda):
- ~$0.02 per SMS
- 50 users × 2 OTPs average = $2/month

---

## Infrastructure

### AWS Services

| Service | Purpose | Why |
|---------|---------|-----|
| EC2 | API hosting | Simple, predictable pricing |
| RDS | PostgreSQL | Managed backups, easy scaling |
| S3 | Video storage | Cheap, reliable, signed URLs |
| CloudFront | Video delivery | Faster downloads, reduced S3 costs |

**Why AWS over alternatives**:
- Most mature, best documentation
- Free tier covers early development
- Africa edge locations (for CDN)

**Alternative for cost savings**: DigitalOcean or Hetzner
- Could reduce costs by 40-50%
- Trade-off: less managed services, more ops work

### Cost Estimate (MVP)

| Service | Monthly Cost |
|---------|--------------|
| EC2 t3.small | $15 |
| RDS t3.micro | $15 |
| S3 (50GB) | $1 |
| CloudFront | $5-10 |
| Domain | $1 |
| **Total** | **~$40/month** |

---

## Development Tools

### IDE & Extensions
- **VS Code** with:
  - ESLint
  - Prettier
  - TypeScript
  - React Native Tools
  - Thunder Client (API testing)

### Version Control
- **GitHub** (free private repos)
- Branch strategy: `main` → `staging` → feature branches

### CI/CD
- **GitHub Actions** (free tier sufficient)
  - Build checks on PR
  - Deploy to staging on merge
  - Manual production deploy

### Testing
| Type | Tool | Priority |
|------|------|----------|
| Unit (backend) | Jest | High |
| API | Supertest | High |
| Mobile | Jest + React Native Testing Library | Medium |
| E2E | Detox (later) | Low (post-MVP) |

### Monitoring
| Tool | Purpose | Cost |
|------|---------|------|
| Sentry | Error tracking | Free tier |
| CloudWatch | Server logs | AWS included |
| Expo Analytics | Crash reports | Free |

---

## Package Decisions

### Explicitly Avoided

| Package | Reason |
|---------|--------|
| Redux | Overkill for MVP, Zustand simpler |
| GraphQL | REST sufficient, adds complexity |
| TypeORM/Prisma | Raw SQL + pg library faster to set up |
| Firebase | Vendor lock-in, Africa's Talking better for SMS |
| MongoDB | Relational data fits PostgreSQL |

### Consider Post-MVP

| Package | When to Add |
|---------|-------------|
| React Query | When API calls get complex |
| WatermelonDB | If SQLite performance becomes issue |
| Bull/BullMQ | If need background job queue |
| Redis | When need caching layer |

---

## Learning Resources

### React Native / Expo
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Express](https://www.reactnative.express/)
- [Expo offline-first patterns](https://docs.expo.dev/guides/offline-support/)

### SuperTokens
- [Passwordless Guide](https://supertokens.com/docs/passwordless/introduction)
- [React Native SDK](https://supertokens.com/docs/passwordless/pre-built-ui/setup/react-native)

### Africa's Talking
- [SMS API Docs](https://developers.africastalking.com/docs/sms/sending)
- [Node.js SDK](https://github.com/AfricasTalkingLtd/africastalking-node.js)

### Offline-First Architecture
- [Offline-First Web Apps](https://www.oreilly.com/library/view/offline-first-web/9781492054474/) (concepts apply to mobile)
- [Local-First Software](https://www.inkandswitch.com/local-first/)

---

## Configuration Files

### React Native (package.json essentials)
```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "expo-router": "~3.4.0",
    "expo-av": "~13.10.0",
    "expo-file-system": "~16.0.0",
    "expo-sqlite": "~13.2.0",
    "expo-secure-store": "~12.8.0",
    "zustand": "^4.5.0",
    "supertokens-react-native": "^4.0.0",
    "@react-native-community/netinfo": "^11.0.0"
  }
}
```

### Backend (package.json essentials)
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "supertokens-node": "^17.0.0",
    "pg": "^8.11.0",
    "africastalking": "^0.6.0",
    "@aws-sdk/client-s3": "^3.0.0",
    "@aws-sdk/s3-request-presigner": "^3.0.0",
    "helmet": "^7.0.0",
    "cors": "^2.8.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "jest": "^29.0.0",
    "supertest": "^6.0.0"
  }
}
```

### TypeScript (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```
