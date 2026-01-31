# Project: Skills Training Platform MVP

## Context
Building a mobile learning platform for East Africa. First deployment: 
Ugandan businesswomen (50 users) learning digital literacy through a 
government-supported organization.

## What Exists
- Content partnership with Campus IL (Israel) for digital literacy courses
- B2B2C model: Organizations enroll groups of learners
- React Native mobile app

## MVP Core Screens Needed
1. **Onboarding/Auth** - Phone number + SMS OTP (already planned)
2. **Home** - My enrolled courses + browse available courses
3. **Enrolled Course Detail** - Lessons list, progress indicator, download option
4. **Browse Courses** - list of courses, categories, enrollment, filters
5. **Video Player** - Play lesson, track completion, works offline
6. **Profile** - Basic user info, overall progress

## Key Requirements
- Offline support: Users download lessons to watch without internet
- Simple, clean UI (reference: Alison.com mobile but simpler)
- Progress tracking syncs when back online
- Works on low-end Android devices

## What I Need Help With
1. Feature prioritization (MoSCoW) for these 6 screens
2. Data flow for offline-first video playback
3. State management approach for downloaded content
4. UI component structure

## Constraints
- Solo developer
- React Native
- Must feel professional but not complicated
- Target devices: 1-2GB RAM Android phones

## Not in MVP Scope
- Voice navigation
- Certification/credentials
- Payment processing
- Multiple languages (English first)
- Community features

Let's start with the Home and Course Detail screens. What are the 
essential vs nice-to-have elements for each?