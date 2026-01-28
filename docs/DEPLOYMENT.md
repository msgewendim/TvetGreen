# Deployment Guide

**Last Updated:** 2026-01-28
**Deployment Strategy:** Staged Rollout via EAS Updates

## Overview

This project uses EAS Updates for over-the-air (OTA) deployments with staged rollouts. Updates are deployed to a percentage of users, verified, then expanded.

### Rollout Stages

| Stage | Percentage | Duration | Success Criteria |
|-------|------------|----------|------------------|
| Canary | 5% | 24 hours | Crash rate <1%, No critical bugs |
| Beta | 25% | 24-48 hours | Stable metrics, Positive feedback |
| Production | 100% | - | All criteria met |

## Pre-Deployment Checklist

Before any deployment, verify:

### Code Quality
- [ ] `pnpm type-check` passes with no errors
- [ ] `pnpm lint` passes with no errors
- [ ] `pnpm test` passes with all tests green
- [ ] No TODO/FIXME comments in changed files

### Testing
- [ ] Manual testing on iOS simulator
- [ ] Manual testing on Android emulator
- [ ] Critical paths verified:
  - [ ] Course browsing works
  - [ ] Video playback works
  - [ ] Downloads work
  - [ ] Profile/settings work

### Feature Flags
- [ ] New features behind feature flags (disabled by default)
- [ ] Feature flag names documented in changelog

### Documentation
- [ ] CHANGELOG.md updated
- [ ] README updated if necessary
- [ ] API changes documented

## Deployment Process

### Step 1: Create Update

```bash
# Ensure on correct branch
git checkout main
git pull origin main

# Verify build
pnpm type-check
pnpm lint
pnpm test

# Create update for production channel
eas update --branch production --message "v1.x.x: [Brief description]"
```

### Step 2: Configure Staged Rollout (5%)

```bash
# Set initial rollout percentage
eas update:configure --branch production --rollout 5

# Verify configuration
eas update:list --branch production --limit 1
```

### Step 3: Monitor Canary (24 hours)

Monitor these metrics:

| Metric | Target | Source |
|--------|--------|--------|
| Crash Rate | <1% | App Store Connect / Play Console |
| ANR Rate | <0.5% | Play Console |
| User Feedback | No critical issues | Support channels |

### Step 4: Expand to Beta (25%)

If canary successful after 24 hours:

```bash
# Expand rollout
eas update:configure --branch production --rollout 25

# Continue monitoring for 24-48 hours
```

### Step 5: Full Rollout (100%)

If beta successful:

```bash
# Complete rollout
eas update:configure --branch production --rollout 100
```

## Rollback During Deployment

If issues detected at any stage:

```bash
# Pause further rollout
eas update:pause --branch production

# If necessary, rollback
eas update:rollback --branch production
```

See `docs/ROLLBACK.md` for detailed rollback procedures.

## Environment Channels

| Channel | Purpose | Rollout Strategy |
|---------|---------|------------------|
| development | Local testing | Immediate |
| preview | Staging/QA | Immediate |
| production | Live users | Staged (5% → 25% → 100%) |

### Deploying to Preview

```bash
eas update --branch preview --message "Preview: [description]"
```

### Deploying to Development

```bash
eas update --branch development --message "Dev: [description]"
```

## Feature Flag Deployment

For features behind flags:

1. **Deploy code with flag disabled**
   ```typescript
   // src/core/flags/featureFlags.ts
   export const DEFAULT_FLAGS = {
     newFeature: false, // New feature disabled by default
   };
   ```

2. **Deploy update through staged rollout**

3. **Enable flag for small group**
   - Update remote config or push targeted update

4. **Monitor and gradually enable**

5. **Remove flag after stable** (cleanup in future release)

## EAS CLI Commands Reference

```bash
# Login to EAS
eas login

# List recent updates
eas update:list --branch production --limit 10

# Check update status
eas update:view [UPDATE_ID]

# Configure rollout percentage
eas update:configure --branch production --rollout [PERCENTAGE]

# Pause rollout
eas update:pause --branch production

# Resume rollout
eas update:resume --branch production

# Rollback update
eas update:rollback --branch production

# Create new update
eas update --branch [BRANCH] --message "[MESSAGE]"
```

## Troubleshooting

### Update Not Appearing on Device

1. Force-close the app completely
2. Reopen the app
3. Check network connectivity
4. Verify update was published: `eas update:list --branch production`

### Rollout Percentage Not Changing

1. Verify command succeeded: `eas update:configure --branch production --rollout [X]`
2. Check EAS dashboard for status
3. Users may need to restart app to receive change

### Build/Update Mismatch

OTA updates only work when runtime versions match:

1. Check app's runtime version in app.json
2. Verify update targets same runtime version
3. If mismatch, new app binary required (app store submission)

---
*Document created as part of Phase 0: Infrastructure Setup*
