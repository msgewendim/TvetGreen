# Product Requirements Document (PRD)
## Skills Training Platform MVP

**Version**: 1.0  
**Last Updated**: January 2025  
**Status**: MVP Definition

---

## Executive Summary

A mobile learning platform delivering localized skills training to East African learners. The platform's core value is access to high-quality courses from global partners (Campus IL, EU institutions) that are culturally adapted and translated for local contexts.

**MVP Scope**: 50 users (Ugandan businesswomen learning digital literacy through a government-supported organization)

---

## Problem Statement

East African organizations and individuals lack access to quality vocational training that is:
- Relevant to their local context
- Available in accessible formats
- Usable with intermittent internet connectivity
- Affordable for emerging markets

**We solve this by**: Partnering with global content providers and adapting their courses for East African learners, delivered through a simple mobile platform that works offline.

---

## MVP Target Users

### Primary User: Ugandan Businesswomen (50 users)

**Profile**:
- Adult women running small businesses in Uganda
- Part of a government-supported entrepreneurship program
- Literate (can read English)
- Own Android smartphones (typically 1-2GB RAM)
- Variable internet connectivity
- Motivated to learn digital skills for business growth

**Goals**:
- Learn Office tools (Word, Excel, basic computer skills)
- Improve online business presence
- Get recognized certification for completing training

**Frustrations**:
- Limited time between work and family
- Expensive or unreliable internet
- Complex apps that are hard to navigate

### Secondary User: Organization Admin

**Profile**:
- Program coordinator at the supporting organization
- Manages group enrollment and tracks progress
- Reports to government stakeholders

**Goals**:
- Easily enroll learners in courses
- Monitor completion rates
- Generate progress reports

---

## MVP Feature Requirements

### Must Have (MVP Fails Without These)

| Feature | Description | Acceptance Criteria |
|---------|-------------|---------------------|
| Phone Auth | SMS OTP login with phone number | User receives OTP within 30 seconds, can login on first attempt |
| Course Library | Browse available courses | User sees course cards with title, thumbnail, duration, lesson count |
| Course Enrollment | Enroll in a course | One-tap enrollment, course appears in "My Courses" |
| Video Playback | Watch video lessons | Play/pause, seek, playback speed, remembers position |
| Offline Download | Download lessons for offline viewing | Download individual lessons or full course, clear storage indicator |
| Progress Tracking | Track completion per lesson/course | Visual progress bar, lesson checkmarks, syncs when online |
| My Courses | View enrolled courses and progress | Quick access to continue learning |

### Should Have (Important, Not Blocking)

| Feature | Description | Rationale |
|---------|-------------|-----------|
| Course Search | Search by title/keyword | Useful as catalog grows beyond 5 courses |
| Download Queue | Queue multiple downloads | Better UX for batch downloading |
| Profile Screen | View user info, settings | Needed for logout, support contact |
| Push Notifications | Remind users to continue learning | Improves retention |

### Could Have (Nice to Have)

| Feature | Description | Rationale |
|---------|-------------|-----------|
| Completion Certificate | PDF certificate on course completion | Adds perceived value, not blocking MVP |
| Course Categories | Filter by topic | Useful when catalog exceeds 10 courses |
| Bookmarks | Save specific lessons | Power user feature |
| Playback Resume | "Continue where you left off" prompt | UX polish |

### Won't Have (Explicitly Out of Scope)

| Feature | Rationale |
|---------|-----------|
| Voice Navigation | Users are literate; add later for broader market |
| Multi-language UI | English only for MVP; content localization is separate |
| Payment/Subscription | B2B model—organization pays, not individual users |
| Community/Social | Focus on core learning loop first |
| Quizzes/Assessments | Completion-based progress is sufficient for MVP |
| Admin Dashboard | Manual enrollment via database for 50 users |
| Multiple Content Partners | Campus IL only for MVP |

---

## User Stories

### Authentication

**US-1**: As a learner, I want to sign up with my phone number so I don't need an email account.
- Given I'm on the login screen
- When I enter my phone number and tap "Continue"
- Then I receive an SMS with a 6-digit code within 30 seconds

**US-2**: As a learner, I want to stay logged in so I don't have to enter OTP every time.
- Given I've successfully logged in
- When I close and reopen the app within 30 days
- Then I'm still logged in without re-entering OTP

**US-3**: As a returning learner, I want to login on a new device using my phone number.
- Given I've registered previously
- When I enter my phone number on a new device
- Then I can verify via OTP and access my courses/progress

### Course Discovery

**US-4**: As a learner, I want to see available courses so I can choose what to learn.
- Given I'm on the Home screen
- When I look at the "Available Courses" section
- Then I see course cards showing: thumbnail, title, duration, lesson count

**US-5**: As a learner, I want to see course details before enrolling.
- Given I'm browsing courses
- When I tap on a course card
- Then I see: full description, lesson list, total duration, "Enroll" button

### Enrollment & Progress

**US-6**: As a learner, I want to enroll in a course with one tap.
- Given I'm on a course detail screen
- When I tap "Enroll"
- Then the course appears in "My Courses" and I can start the first lesson

**US-7**: As a learner, I want to see my enrolled courses on the home screen.
- Given I've enrolled in courses
- When I open the app
- Then I see "My Courses" section with progress indicators for each

**US-8**: As a learner, I want to continue where I left off.
- Given I've partially completed a course
- When I tap on that course
- Then I'm taken to the next unwatched lesson (or last incomplete lesson)

### Video Playback

**US-9**: As a learner, I want standard video controls.
- Given I'm watching a lesson
- When I interact with the video player
- Then I can: play/pause, seek forward/back, adjust playback speed (0.5x-2x)

**US-10**: As a learner, I want my video position saved if I leave mid-lesson.
- Given I'm watching a lesson and close the app
- When I return to that lesson
- Then playback resumes from where I stopped

**US-11**: As a learner, I want a lesson marked complete when I finish it.
- Given I'm watching a lesson
- When the video reaches the end (or 90% completion)
- Then the lesson is marked as complete with a checkmark

### Offline Access

**US-12**: As a learner, I want to download lessons for offline viewing.
- Given I'm on a course detail screen
- When I tap the download icon on a lesson
- Then the lesson downloads and shows a "downloaded" indicator

**US-13**: As a learner, I want to download an entire course at once.
- Given I'm on a course detail screen
- When I tap "Download All"
- Then all lessons queue for download with progress indicator

**US-14**: As a learner, I want to watch downloaded lessons without internet.
- Given I've downloaded lessons and have no internet
- When I open the app and navigate to a downloaded lesson
- Then the video plays from local storage

**US-15**: As a learner, I want to see how much storage my downloads use.
- Given I've downloaded content
- When I go to Profile/Settings
- Then I see total storage used and can delete downloads

**US-16**: As a learner, I want my offline progress to sync when I reconnect.
- Given I completed lessons while offline
- When my device regains internet connection
- Then my progress syncs automatically to the server

---

## Success Metrics

### Primary Metrics (MVP Validation)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Activation Rate | 80% of enrolled users complete at least 1 lesson | Analytics |
| Weekly Active Users | 60% return weekly during course duration | Analytics |
| Course Completion | 40% complete at least 1 full course | Analytics |
| Offline Usage | 50%+ of video playback happens offline | Analytics |

### Secondary Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| App Store Rating | 4.0+ stars | Play Store |
| Support Requests | <10% of users need support | Support tickets |
| Download Success | 95%+ downloads complete successfully | Analytics |
| Sync Reliability | <1% sync failures | Error logs |

### Qualitative Validation

- User interviews (10 users minimum) after 4 weeks
- Focus: ease of use, content relevance, offline experience
- Key question: "Would you recommend this to a colleague?"

---

## Technical Constraints

| Constraint | Requirement |
|------------|-------------|
| Target Devices | Android 8.0+, 1-2GB RAM, 16GB storage |
| Offline Duration | Support 30 days without internet |
| Video Size | Optimize for <50MB per 10-minute lesson |
| Network | Handle 2G/3G speeds gracefully |
| Auth Provider | Africa's Talking SMS (best Uganda coverage) |

---

## Dependencies

| Dependency | Status | Risk |
|------------|--------|------|
| Campus IL Content | Partnership confirmed | Low |
| Africa's Talking SMS | API access ready | Low |
| Organization Enrollment List | Need list of 50 users | Medium |
| Content Localization | Courses need adaptation | Medium |

---

## Out of Scope Clarifications

**Why no admin dashboard?**  
With 50 users, manual database operations are faster than building admin UI. Revisit at 500+ users.

**Why no quizzes?**  
Digital literacy is skill-based. Watching and practicing is the assessment. Completion tracking is sufficient validation for this cohort.

**Why English only?**  
MVP users are literate English speakers. Luganda/Swahili UI comes with market expansion.

**Why no payment?**  
B2B model—the organization pays a flat fee. Individual billing adds complexity without value for MVP.
