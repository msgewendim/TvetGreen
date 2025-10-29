# Skills Platform Architecture Documentation

## Overview

This repository contains comprehensive architecture and design diagrams for the Skills Platform for East African Development - a voice-first, offline-capable mobile platform delivering practical vocational training in native languages (Amharic and Swahili).

## Table of Contents

1. [System Architecture](#system-architecture)
2. [User Flow](#user-flow)
3. [Data Flow](#data-flow)
4. [Mobile App Architecture](#mobile-app-architecture)
5. [Deployment Architecture](#deployment-architecture)
6. [Offline-First Architecture](#offline-first-architecture)
7. [How to View Diagrams](#how-to-view-diagrams)
8. [Technology Stack](#technology-stack)

---

## System Architecture

**File:** `architecture_diagram.mermaid`

### Purpose
High-level system architecture showing all major components and their interactions.

### Key Components

#### Client Layer
- **Mobile App (Android)**: Primary interface for users
- **Voice Interface**: Voice commands for non-literate users - (in future)
- **Offline Storage**: Local caching for intermittent connectivity
- **Video Player**: Optimized for low-end devices
- **Progress Tracker**: Learning progress management

#### API Gateway Layer
- **Authentication Service**: JWT-based auth
- **Rate Limiting**: API protection
- **Load Balancer**: Traffic distribution

#### Application Layer
- **User Service**: User management and profiles
- **Content Service**: Course catalog and video delivery
- **Progress Service**: Learning progress tracking
- **Download Service**: Offline content management
- **Analytics Service**: Usage metrics and insights
- **Voice Service**: Voice command processing
- **Translation Service**: Language localization

#### Data Layer
- **User Database (PostgreSQL)**: User accounts, profiles, preferences
- **Content Database (MongoDB)**: Course metadata, video references
- **Progress Database (PostgreSQL)**: Learning progress, achievements
- **Analytics Database (ClickHouse)**: Event tracking, metrics

#### Storage Layer
- **Video Storage CDN**: Cloudflare/AWS for video delivery
- **Audio Storage**: S3 buckets for dubbed audio files
- **Edge Cache Servers**: Regional caching for faster access

#### External Services
- **Video Transcoding**: Converting and compressing videos
- **Speech-to-Text**: Voice command processing
- **Text-to-Speech**: Voice feedback
- **Translation API**: Content localization
- **Payment Gateway**: M-Pesa, Stripe integration

---

## User Flow

**File:** `user_flow_diagram.mermaid`

### Purpose
Detailed user journey through the application, showing all possible paths and interactions.

### Main User Journeys

#### 1. First-Time User
```
App Open → Authentication Check → Onboarding → Language Selection → 
Voice Setup → Home Screen
```

#### 2. Learning Flow
```
Home → Continue Learning → Course Detail → Video Lesson → 
Progress Update → Achievements → Home
```

#### 3. Content Discovery
```
Quick Actions → Category Selection → Course Library → Apply Filters → 
Browse Courses → Course Detail → Download for Offline → Video Player
```

#### 4. Offline Learning
```
Home → Downloads → Play Offline Course → Video Player → 
Progress Tracking (Queued) → Sync When Online
```

#### 5. Profile Management
```
Profile → View Stats → Manage Goals → View Achievements → 
Settings → Language/Voice/Download Preferences
```

#### 6. Voice Interaction (Available Anywhere)
```
Voice Command → Voice Processing → Action Execution → 
Voice Feedback → Continue Task
```

### Key Decision Points
- **Authentication**: New vs returning users
- **Download**: WiFi vs mobile data
- **Content**: Online vs offline mode
- **Goals**: Add, edit, or view learning goals

---

## Data Flow

**File:** `data_flow_diagram.mermaid`

### Purpose
Shows how data moves through the system from user interactions to storage and back.

### Key Data Flows

#### User Registration Flow
1. User submits credentials
2. API validates and creates account
3. User data stored in database
4. JWT token generated and returned
5. Token stored locally on device

#### Content Download Flow
1. User requests course catalog
2. API queries content database
3. Course metadata returned
4. User selects content to download
5. Videos/audio streamed from CDN
6. Content cached locally
7. Offline availability confirmed

#### Video Watching Flow
1. User plays video from cache
2. Progress tracked locally
3. Progress updates sent to API
4. Statistics calculated and stored
5. Analytics events logged

#### Voice Command Flow
1. User speaks command
2. Audio captured locally
3. Sent to voice API
4. Speech-to-Text conversion
5. Command interpreted and executed
6. Response generated via Text-to-Speech
7. Audio feedback played

#### Offline Sync Flow
1. Operations queued while offline
2. Network connectivity monitored
3. When online, sync manager triggered
4. Queued operations processed
5. Local and server data reconciled
6. Conflicts resolved (last-write-wins)

---

## Mobile App Architecture

**File:** `mobile_app_architecture.mermaid`

### Purpose
Internal structure of the mobile application showing component interactions.

### Architecture Layers

#### Presentation Layer (UI)
- React Native or Flutter components
- Screens: Home, Library, Player, Profile, Downloads
- Voice interface components

#### State Management
- Redux or MobX for global state
- Separate stores for:
  - User state (auth, profile)
  - Course state (catalog, current course)
  - Progress state (completion, achievements)
  - Download state (queue, cache)
  - Voice state (commands, feedback)

#### Business Logic Layer
- Services encapsulating business rules:
  - **Auth Service**: Login, logout, token refresh
  - **Course Service**: Fetch, filter, search courses
  - **Progress Service**: Track, calculate, update progress
  - **Download Manager**: Queue, prioritize, manage downloads
  - **Voice Service**: Process commands, generate responses
  - **Sync Service**: Handle offline-online transitions
  - **Analytics Service**: Track events, generate insights

#### Data Layer
- **SQLite Database**: Structured data (users, courses, progress)
- **Video Cache**: File system storage for videos
- **Audio Cache**: File system storage for audio
- **Preferences**: SharedPreferences/AsyncStorage for settings

#### Network Layer
- **HTTP Client**: Axios/Fetch for API calls
- **WebSocket**: Real-time updates and notifications
- **Offline Queue**: Retry failed requests
- **Retry Logic**: Exponential backoff

#### Native Modules
- **Voice Recognition**: Platform-specific speech APIs
- **Text-to-Speech**: Platform-specific TTS
- **File System Access**: Native file operations
- **Network Monitor**: Connectivity state tracking
- **Media Player**: ExoPlayer (Android) / AVPlayer (iOS)

---

## Deployment Architecture

**File:** `deployment_architecture.mermaid`

### Purpose
Production infrastructure showing how the system is deployed and scaled.

### Infrastructure Components

#### CDN Layer (Cloudflare)
- Global content delivery network
- Edge servers in:
  - Nairobi, Kenya
  - Addis Ababa, Ethiopia
  - Dar es Salaam, Tanzania
- Video content caching
- DDoS protection

#### Load Balancer (AWS/Azure)
- Application load balancer
- Health checks on backend services
- SSL/TLS termination
- Auto-scaling trigger (CPU > 70%)

#### Application Servers
- Auto-scaling group (3-20 instances)
- Node.js/Python backend
- Containerized microservices

#### Database Cluster
- **Primary PostgreSQL**: Write operations
- **Read Replicas (2)**: Read operations
- **Backup Database**: Daily snapshots
- **MongoDB Atlas**: Content metadata

#### Cache Layer (Redis)
- Session cache
- API response cache
- User data cache

#### Object Storage (AWS S3)
- Original quality videos
- Compressed quality videos
- Amharic audio dubs
- Swahili audio dubs
- Static assets

#### Message Queue (RabbitMQ/SQS)
- Video processing queue
- Translation queue
- Analytics queue
- Notification queue

#### Background Workers
- Video transcoding (FFmpeg)
- Translation processing (ML models)
- Analytics aggregation
- Notification delivery

#### External Services
- AWS Transcribe (Speech-to-Text)
- AWS Polly (Text-to-Speech)
- AWS Translate (Machine Translation)
- M-Pesa/Stripe (Payments)
- Twilio/Africa's Talking (SMS)
- SendGrid/AWS SES (Email)

#### Monitoring & Logging
- Prometheus (metrics collection)
- Grafana (dashboards)
- ELK Stack (log analysis)
- Sentry (error tracking)
- CloudWatch (AWS metrics)

---

## Offline-First Architecture

**File:** `offline_architecture.mermaid`

### Purpose
Critical design for handling intermittent connectivity in East African regions.

### Key Strategies

#### 1. Pre-downloading Content
- Users download courses over WiFi
- Content stored in local file system
- Compressed videos (H.264/H.265)
- Multiple quality options

#### 2. Smart Caching
- Predict next lesson based on current progress
- Pre-fetch upcoming content
- Adaptive quality based on storage

#### 3. Offline Operations
- Watch videos from cache
- Track progress locally
- Voice commands (offline STT)
- Browse cached metadata
- View local statistics

#### 4. Sync Engine
- **Bidirectional sync**: Upload and download
- **Conflict resolution**: Last-write-wins strategy
- **Delta sync**: Only changed data transferred
- **Batch operations**: Reduce API calls
- **Exponential backoff**: Retry failed syncs

#### 5. Queue Management
- Pending progress updates
- Pending course completions
- Pending achievements
- Pending analytics events
- Pending content requests

#### 6. Network Detection
- Check connectivity every 30 seconds
- WiFi availability check
- Mobile data availability check
- Connection quality test

#### 7. Sync Triggers
- Manual sync (user-initiated)
- Auto sync (WiFi connected)
- Background sync (app in background)
- Scheduled sync (every 6 hours)

#### 8. Storage Management
- Monitor available storage
- Low storage warning (< 500MB)
- Delete old/unused content
- Prioritize recently accessed content

---

## How to View Diagrams

### Option 1: Online Mermaid Editor
1. Visit https://mermaid.live/
2. Copy the contents of any `.mermaid` file
3. Paste into the editor
4. View the rendered diagram

### Option 2: VS Code Extension
1. Install "Markdown Preview Mermaid Support" extension
2. Open any `.mermaid` file
3. Use Command Palette: "Markdown: Open Preview"

### Option 3: Local HTML Viewer
1. Open `diagram_viewer.html` in your browser
2. All diagrams will be rendered automatically

### Option 4: GitHub
1. Push to GitHub repository
2. GitHub automatically renders Mermaid diagrams in Markdown files

---

## Technology Stack

### Mobile App
- **Framework**: React Native or Flutter
- **State Management**: Redux or MobX
- **Local Database**: SQLite
- **Caching**: React Native MMKV or Flutter Hive
- **Video Player**: react-native-video or video_player
- **Voice**: @react-native-voice/voice or speech_to_text
- **Offline**: NetInfo + AsyncStorage

### Backend
- **API**: Node.js (Express) or Python (FastAPI)
- **Authentication**: JWT + OAuth 2.0
- **Databases**: 
  - PostgreSQL (relational data)
  - MongoDB (content metadata)
  - Redis (caching)
  - ClickHouse (analytics)
- **Storage**: AWS S3 or Azure Blob Storage
- **CDN**: Cloudflare
- **Message Queue**: RabbitMQ or AWS SQS

### DevOps
- **CI/CD**: GitHub Actions or GitLab CI
- **Containerization**: Docker
- **Orchestration**: Kubernetes or AWS ECS
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Error Tracking**: Sentry

### External APIs
- **Speech Services**: AWS Transcribe, AWS Polly
- **Translation**: AWS Translate, Google Translate API
- **Payments**: M-Pesa, Stripe, Flutterwave
- **SMS**: Africa's Talking, Twilio
- **Email**: SendGrid, AWS SES

---

## Best Practices

### Performance
- Optimize video compression (H.265 where supported)
- Use adaptive bitrate streaming
- Implement lazy loading for course lists
- Cache API responses appropriately
- Minimize database queries with proper indexing

### Security
- Implement JWT with refresh tokens
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement rate limiting on APIs
- Regular security audits and penetration testing

### Scalability
- Design for horizontal scaling
- Use microservices architecture
- Implement database sharding for large datasets
- Use CDN for static content delivery
- Implement caching strategies at multiple layers

### Offline-First
- Store all essential data locally
- Queue operations for later sync
- Provide clear offline indicators
- Handle conflicts gracefully
- Test thoroughly with intermittent connectivity

### Localization
- Support RTL languages if needed
- Use professional translators for UI text
- Test voice commands in target languages
- Adapt cultural references in content
- Support local payment methods

---

## Contact & Support

For questions or contributions to this architecture documentation:
- Create an issue in the repository
- Submit a pull request with improvements
- Contact the development team

---

## License

[Specify your license here]

---

## Version History

- **v1.0** (Current): Initial architecture documentation
  - System architecture diagram
  - User flow diagram
  - Data flow diagram
  - Mobile app architecture
  - Deployment architecture
  - Offline-first architecture

---

*Last updated: October 2025*