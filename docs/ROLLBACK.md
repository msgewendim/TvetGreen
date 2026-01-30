# Rollback Procedures

**Last Updated:** 2026-01-28
**Target Recovery Time:** 30 minutes or less

## Quick Reference

| Scenario | Action | Time |
|----------|--------|------|
| Crash rate >1% | EAS rollback to previous update | 15 min |
| ANR rate >0.5% | Feature flag disable | 5 min |
| Critical bug reported | Feature flag disable first | 5 min |
| Security vulnerability | EAS rollback + feature flag | 20 min |

## Rollback Triggers

### Automatic Rollback Triggers

Execute immediate rollback when any threshold is exceeded:

| Metric | Threshold | Source | Action |
|--------|-----------|--------|--------|
| Crash Rate | >1% | App Store Connect / Google Play Console | EAS Rollback |
| ANR Rate | >0.5% | Google Play Console | Feature Flag Disable |
| Error Rate (Sentry) | >5% | Sentry Dashboard | Feature Flag Disable |
| User Reports | >10 same issue in 1 hour | Support channels | Investigate + Flag Disable |

### Manual Rollback Triggers

Consider rollback when:
- Performance regression >30% in key metrics
- Critical user flow broken (cannot browse courses, play videos, or access downloads)
- Security vulnerability discovered post-deployment
- Data corruption or loss reported

## Rollback Procedures

### Procedure 1: Feature Flag Disable (5 minutes)

Use when a specific feature is causing issues but the app is otherwise stable.

**Prerequisites:**
- Access to development environment
- Feature flag system configured (see `src/core/flags/featureFlags.ts`)

**Steps:**

1. **Identify the problematic feature flag**
   ```typescript
   // Feature flags available:
   // secureStorage, inputValidation, errorBoundaries, httpsEnforcement
   // flashListEnabled, expoImageEnabled, debouncedInputs
   // networkErrorHandling, offlineIndicators, skeletonLoading
   ```

2. **Disable via remote config** (if configured)
   - Update remote config to set flag to `false`
   - Users receive update on next app launch

3. **Verify flag is disabled**
   - Open app on test device
   - Navigate to affected feature
   - Confirm previous behavior restored

4. **Document the disable**
   - Create issue in issue tracker
   - Note timestamp, flag disabled, and reason
   - Assign investigation task

### Procedure 2: EAS Update Rollback (15 minutes)

Use when the entire update is problematic and feature flag disable is insufficient.

**Prerequisites:**
- EAS CLI installed: `npm install -g eas-cli`
- Authenticated: `eas login`
- Know the previous update ID

**Steps:**

1. **Identify current and previous updates**
   ```bash
   # List recent updates
   eas update:list --branch production --limit 5
   ```

2. **Rollback to previous update**
   ```bash
   # Option A: Republish previous commit
   git checkout <previous-commit>
   eas update --branch production --message "Rollback: reverting to previous version"

   # Option B: Create rollback update
   eas update:rollback --branch production
   ```

3. **Verify rollback succeeded**
   ```bash
   # Check update status
   eas update:list --branch production --limit 2
   ```

4. **Test on device**
   - Force-close app
   - Reopen app (update downloads automatically)
   - Verify previous behavior restored

5. **Document the rollback**
   - Create incident report
   - Note: timestamp, update IDs, reason
   - Link to root cause investigation

### Procedure 3: Full Rollback (20 minutes)

Use for security vulnerabilities or critical issues affecting all users.

**Steps:**

1. **Disable all new feature flags immediately**
   ```typescript
   import { resetFlags } from 'src/core/flags';
   await resetFlags(); // Resets all flags to defaults (false)
   ```

2. **Execute EAS rollback** (see Procedure 2)

3. **Notify users if necessary**
   - In-app notification (if feature available)
   - Social media / support channels

4. **Post-incident review**
   - Schedule review within 24 hours
   - Document root cause
   - Create prevention tasks

## Staged Rollout Recovery

When using staged rollouts (5% → 25% → 100%):

### Pause Rollout
```bash
# Stop further rollout progression
eas update:pause --branch production
```

### Resume Rollout
```bash
# Continue rollout after fixes verified
eas update:resume --branch production
```

### Rollback Staged Update
```bash
# Rollback affects only users who received the update
eas update:rollback --branch production
```

## Verification Checklist

After any rollback, verify:

- [ ] App launches without crash
- [ ] Course browsing works
- [ ] Video playback works
- [ ] Downloads accessible offline
- [ ] User data intact (enrollments, progress)
- [ ] No error messages in normal flows

## Contacts

| Role | Responsibility | Contact |
|------|----------------|---------|
| On-call Engineer | Execute rollback | [TBD] |
| Product Owner | Approve rollback decision | [TBD] |
| Support Lead | User communication | [TBD] |

## Post-Incident Template

```markdown
## Incident Report: [Title]

**Date:** [Date]
**Duration:** [Start - End]
**Severity:** [P1/P2/P3]
**Impact:** [Number of users affected]

### Timeline
- [Time]: Issue detected
- [Time]: Rollback initiated
- [Time]: Rollback complete
- [Time]: Verified recovery

### Root Cause
[Description]

### Resolution
[What was done]

### Prevention
- [ ] [Action item 1]
- [ ] [Action item 2]

### Lessons Learned
[What we learned]
```

---
*Document created as part of Phase 0: Infrastructure Setup*
