## Auth Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REGISTRATION FLOW (First Time)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌────────┐ │
│  │  Phone   │───▶│ SMS OTP  │───▶│  Create  │───▶│  Set     │───▶│ Issue  │ │ 
│  │  Number  │    │  Verify  │    │  Profile │    │Local PIN │    │ Token  │ │
│  │  Input   │    │          │    │ (voice)  │    │(4 digit) │    │        │ │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘    └────────┘ │
│       │                                               │                     │
│       ▼                                               ▼                     │
│  [Voice prompt:                                 [Voice prompt:              │
│   "Enter your                                   "Choose 4 numbers           │
│   phone number"]                                 to unlock app"]            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         DAILY LOGIN FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                        ┌─────────────────┐                                  │
│                        │   Open App      │                                  │
│                        └────────┬────────┘                                  │
│                                 │                                           │
│                                 ▼                                           │
│                        ┌─────────────────┐                                  │
│                        │  Check Network  │                                  │
│                        └────────┬────────┘                                  │
│                                 │                                           │
│              ┌──────────────────┴──────────────────┐                        │
│              ▼                                     ▼                        │
│     ┌─────────────────┐                   ┌─────────────────┐               │
│     │    ONLINE       │                   │    OFFLINE      │               │
│     └────────┬────────┘                   └────────┬────────┘               │
│              │                                     │                        │
│              ▼                                     ▼                        │
│     ┌─────────────────┐                   ┌─────────────────┐               │
│     │  Token Valid?   │                   │  Local PIN or   │               │
│     └────────┬────────┘                   │  Fingerprint    │               │
│              │                            └────────┬────────┘               │
│      ┌───────┴───────┐                             │                        │
│      ▼               ▼                             ▼                        │
│  ┌───────┐      ┌─────────┐               ┌─────────────────┐               │
│  │ Yes   │      │   No    │               │ Access Cached   │               │
│  │       │      │         │               │ Content & Queue │               │
│  │ PIN/  │      │Re-verify│               │ Actions         │               │
│  │ Bio   │      │SMS OTP  │               └─────────────────┘               │
│  └───┬───┘      └────┬────┘                                                 │
│      │               │                                                      │
│      └───────┬───────┘                                                      │
│              ▼                                                              │
│     ┌─────────────────┐                                                     │
│     │  Full Access +  │                                                     │
│     │  Background     │                                                     │
│     │  Sync           │                                                     │
│     └─────────────────┘                                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Token Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    TOKEN ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    ACCESS TOKEN                         │    │
│  │  • Short-lived: 7 days                                  │    │
│  │  • Used for API calls when online                       │    │
│  │  • Refreshed silently in background                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   REFRESH TOKEN                         │    │
│  │  • Long-lived: 90 days                                  │    │
│  │  • Stored encrypted on device                           │    │
│  │  • Used to get new access tokens                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   OFFLINE TOKEN                         │    │
│  │  • Device-bound, never leaves device                    │    │
│  │  • Validates local PIN/biometric                        │    │
│  │  • Grants access to downloaded content                  │    │
│  │  • Expires: 30 days without ANY network contact         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Practical Implementation Options

### Option 1: SuperTokens (Recommended for your case)

**Why it fits:**
- Self-hostable (important for data sovereignty concerns in East Africa)
- Has passwordless/phone auth as a first-class feature
- Good React Native SDK
- Free tier is generous

```
┌─────────────────────────────────────────────────────────────────┐
│                 SUPERTOKENS ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Mobile App                    Your Backend         SuperTokens│
│  ┌──────────┐                  ┌──────────┐        ┌──────────┐ │
│  │          │  1. Phone #      │          │  OTP   │          │ │
│  │  React   │─────────────────▶│  Node/   │───────▶│  Core    │ │
│  │  Native  │                  │  Python  │        │  Service │ │
│  │          │◀─────────────────│          │◀───────│          │ │
│  │          │  4. Session      │          │ Token  │          │ │
│  └──────────┘                  └──────────┘        └──────────┘ │
│       │                              │                    │     │
│       │ 2. SMS via                   │                    │     │
│       │    Africa's Talking          │                    │     │
│       ▼                              │                    │     │
│  ┌──────────┐                        │                    │     │
│  │  User's  │                        │                    │     │
│  │  Phone   │                        │                    │     │
│  └──────────┘                        │                    │     │
│       │                              │                    │     │
│       │ 3. Enter OTP                 │                    │     │
│       └──────────────────────────────┘                    │     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Setup complexity:** Medium
**Cost:** Free self-hosted, or $50-100/month managed

---

### Option 2: Custom Build with Africa's Talking

**Why it might be better:**
- Africa's Talking has the best SMS delivery rates in East Africa
- Full control over offline logic
- Simpler than you'd think for this use case

```
┌─────────────────────────────────────────────────────────────────┐
│                 CUSTOM AUTH ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     YOUR BACKEND                        │    │
│  │                                                         │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │    │
│  │  │   /auth/     │  │   /auth/     │  │   /auth/     │   │    │
│  │  │   send-otp   │  │   verify-otp │  │   refresh    │   │    │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │    │
│  │         │                 │                 │           │    │
│  │         ▼                 ▼                 ▼           │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │              Auth Service Layer                 │    │    │
│  │  │  • Generate OTP (6 digit, 5 min expiry)         │    │    │
│  │  │  • Rate limit (3 attempts per 15 min)           │    │    │
│  │  │  • Issue JWT tokens                             │    │    │
│  │  │  • Track devices                                │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  │                          │                              │    │
│  └──────────────────────────┼──────────────────────────────┘    │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  AFRICA'S TALKING                        │   │
│  │         SMS API for East Africa (Kenya, Ethiopia,        │   │
│  │         Tanzania, Uganda, Rwanda)                        │   │
│  │         Cost: ~$0.02-0.05 per SMS                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema for Auth

```sql
-- Core user identity
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number    VARCHAR(20) UNIQUE NOT NULL,  -- E.164 format
    phone_verified  BOOLEAN DEFAULT FALSE,
    
    -- Profile (collected via voice)
    display_name    VARCHAR(100),
    preferred_lang  VARCHAR(10) DEFAULT 'am',     -- am=Amharic, sw=Swahili
    region          VARCHAR(50),
    
    -- Offline auth
    pin_hash        VARCHAR(255),                 -- bcrypt hash of 4-6 digit PIN
    biometric_key   TEXT,                         -- device-specific biometric token
    
    created_at      TIMESTAMP DEFAULT NOW(),
    last_seen_at    TIMESTAMP
);

-- Track devices for multi-device + offline
CREATE TABLE user_devices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    device_id       VARCHAR(255) NOT NULL,        -- unique device identifier
    device_name     VARCHAR(100),                 -- "Samsung Galaxy A12"
    
    -- Tokens
    refresh_token   VARCHAR(500),
    token_expires   TIMESTAMP,
    
    -- Offline capability
    offline_enabled BOOLEAN DEFAULT TRUE,
    last_sync       TIMESTAMP,
    
    created_at      TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, device_id)
);

-- OTP tracking (for rate limiting and verification)
CREATE TABLE otp_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number    VARCHAR(20) NOT NULL,
    otp_hash        VARCHAR(255) NOT NULL,        -- hashed OTP
    expires_at      TIMESTAMP NOT NULL,
    attempts        INT DEFAULT 0,
    verified        BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- Audit log for security
CREATE TABLE auth_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    event_type      VARCHAR(50),                  -- 'login', 'logout', 'otp_sent', 'otp_verified', 'pin_changed'
    device_id       VARCHAR(255),
    ip_address      INET,
    success         BOOLEAN,
    metadata        JSONB,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_otp_phone_expires ON otp_requests(phone_number, expires_at);
CREATE INDEX idx_devices_user ON user_devices(user_id);
CREATE INDEX idx_auth_events_user ON auth_events(user_id, created_at);
```

---

## Mobile-Side Implementation (React Native)

```typescript
// auth/offlineAuth.ts

import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

interface StoredCredentials {
  userId: string;
  phoneNumber: string;
  accessToken: string;
  refreshToken: string;
  offlineToken: string;
  pinHash: string;
  tokenExpiry: number;
  offlineExpiry: number;
}

class OfflineAuthManager {
  private credentials: StoredCredentials | null = null;

  // Initialize on app start
  async initialize(): Promise<boolean> {
    try {
      const stored = await SecureStore.getItemAsync('auth_credentials');
      if (stored) {
        this.credentials = JSON.parse(stored);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Check if user can access app (works offline)
  async canAccessOffline(): Promise<boolean> {
    if (!this.credentials) return false;
    
    const now = Date.now();
    // Allow offline access if offline token hasn't expired (30 days)
    return now < this.credentials.offlineExpiry;
  }

  // Verify PIN locally (no network needed)
  async verifyPIN(enteredPin: string): Promise<boolean> {
    if (!this.credentials) return false;
    
    // Simple hash comparison (use bcrypt in production)
    const enteredHash = await this.hashPIN(enteredPin);
    return enteredHash === this.credentials.pinHash;
  }

  // Biometric auth (fingerprint)
  async verifyBiometric(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return false;

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock to continue', // This would be voice-prompted too
      disableDeviceCredentials: true,
    });

    return result.success;
  }

  // Store credentials after successful OTP verification
  async storeCredentials(data: {
    userId: string;
    phoneNumber: string;
    accessToken: string;
    refreshToken: string;
    pin: string;
  }): Promise<void> {
    const now = Date.now();
    
    this.credentials = {
      userId: data.userId,
      phoneNumber: data.phoneNumber,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      offlineToken: this.generateOfflineToken(),
      pinHash: await this.hashPIN(data.pin),
      tokenExpiry: now + (7 * 24 * 60 * 60 * 1000),      // 7 days
      offlineExpiry: now + (30 * 24 * 60 * 60 * 1000),   // 30 days
    };

    await SecureStore.setItemAsync(
      'auth_credentials',
      JSON.stringify(this.credentials)
    );
  }

  // Refresh tokens when online
  async refreshTokens(apiClient: any): Promise<boolean> {
    if (!this.credentials) return false;

    try {
      const response = await apiClient.post('/auth/refresh', {
        refreshToken: this.credentials.refreshToken,
      });

      this.credentials.accessToken = response.data.accessToken;
      this.credentials.refreshToken = response.data.refreshToken;
      this.credentials.tokenExpiry = Date.now() + (7 * 24 * 60 * 60 * 1000);
      this.credentials.offlineExpiry = Date.now() + (30 * 24 * 60 * 60 * 1000);

      await SecureStore.setItemAsync(
        'auth_credentials',
        JSON.stringify(this.credentials)
      );

      return true;
    } catch {
      return false;
    }
  }

  // Get current access token (for API calls)
  getAccessToken(): string | null {
    if (!this.credentials) return null;
    if (Date.now() > this.credentials.tokenExpiry) return null;
    return this.credentials.accessToken;
  }

  // Logout
  async logout(): Promise<void> {
    this.credentials = null;
    await SecureStore.deleteItemAsync('auth_credentials');
  }

  private async hashPIN(pin: string): Promise<string> {
    // In production, use a proper hashing library
    // This is simplified for illustration
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + 'your-salt-here');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private generateOfflineToken(): string {
    // Generate a random token for offline verification
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}

export const offlineAuth = new OfflineAuthManager();
```

---

## Voice-Guided Auth Flow

```typescript
// auth/voiceAuthFlow.ts

import * as Speech from 'expo-speech';
import { offlineAuth } from './offlineAuth';

type Language = 'am' | 'sw' | 'en';

const VOICE_PROMPTS: Record<Language, Record<string, string>> = {
  am: {
    enterPhone: 'የስልክ ቁጥርዎን ያስገቡ',
    otpSent: 'የማረጋገጫ ቁጥር ወደ ስልክዎ ተልኳል',
    enterOtp: 'የማረጋገጫ ቁጥሩን ያስገቡ',
    createPin: 'የ4 አሃዝ ፒን ይምረጡ',
    confirmPin: 'ፒንዎን እንደገና ያስገቡ',
    success: 'እንኳን ደህና መጡ',
    enterPin: 'ፒንዎን ያስገቡ',
    wrongPin: 'የተሳሳተ ፒን። እንደገና ይሞክሩ',
    useFinger: 'በጣት አሻራ ለመክፈት ይንኩ',
  },
  sw: {
    enterPhone: 'Weka nambari yako ya simu',
    otpSent: 'Nambari ya uthibitisho imetumwa',
    enterOtp: 'Weka nambari ya uthibitisho',
    createPin: 'Chagua PIN ya nambari 4',
    confirmPin: 'Weka PIN tena',
    success: 'Karibu',
    enterPin: 'Weka PIN yako',
    wrongPin: 'PIN mbaya. Jaribu tena',
    useFinger: 'Gusa ili kufungua kwa alama ya kidole',
  },
  en: {
    enterPhone: 'Enter your phone number',
    otpSent: 'Verification code sent to your phone',
    enterOtp: 'Enter the verification code',
    createPin: 'Choose a 4 digit PIN',
    confirmPin: 'Enter your PIN again',
    success: 'Welcome',
    enterPin: 'Enter your PIN',
    wrongPin: 'Wrong PIN. Try again',
    useFinger: 'Touch to unlock with fingerprint',
  },
};

class VoiceAuthFlow {
  private language: Language = 'am';

  setLanguage(lang: Language) {
    this.language = lang;
  }

  async speak(promptKey: string): Promise<void> {
    const text = VOICE_PROMPTS[this.language][promptKey];
    if (!text) return;

    return new Promise((resolve) => {
      Speech.speak(text, {
        language: this.language === 'am' ? 'am-ET' : 
                  this.language === 'sw' ? 'sw-KE' : 'en-US',
        onDone: () => resolve(),
        onError: () => resolve(),
      });
    });
  }

  async runLoginFlow(): Promise<boolean> {
    const hasCredentials = await offlineAuth.initialize();
    
    if (!hasCredentials) {
      // New user - need to register
      return false; // Trigger registration flow
    }

    const canOffline = await offlineAuth.canAccessOffline();
    if (!canOffline) {
      // Offline token expired - need to re-verify online
      return false;
    }

    // Try biometric first
    await this.speak('useFinger');
    const biometricSuccess = await offlineAuth.verifyBiometric();
    if (biometricSuccess) {
      await this.speak('success');
      return true;
    }

    // Fall back to PIN
    await this.speak('enterPin');
    // ... PIN input UI would handle the rest
    return false;
  }
}

export const voiceAuth = new VoiceAuthFlow();
```

---

## Services Comparison

| Service | Phone Auth | Self-Host | Offline Support | East Africa SMS | Cost | Complexity |
|---------|-----------|-----------|-----------------|-----------------|------|------------|
| **SuperTokens** | ✅ Built-in | ✅ Yes | ⚠️ Needs custom | ⚠️ Via Twilio | Free-$100/mo | Medium |
| **Ory Kratos** | ✅ Built-in | ✅ Yes | ⚠️ Needs custom | ⚠️ Via Twilio | Free | High |
| **Custom + Africa's Talking** | ✅ Full control | ✅ Yes | ✅ Full control | ✅ Native | ~$0.03/SMS | Medium |
| **Firebase Auth** | ✅ Built-in | ❌ No | ⚠️ Limited | ✅ Good | Free tier | Low |
| **Supabase Auth** | ✅ Built-in | ✅ Yes | ⚠️ Needs custom | ⚠️ Via Twilio | Free tier | Low |

---

## My Recommendation

**For MVP:** Go with **SuperTokens + Africa's Talking** combo.

1. **SuperTokens** handles the session management, token refresh, and gives you a solid foundation
2. **Africa's Talking** handles SMS delivery with proper coverage in your target markets
3. **Custom offline layer** (the code I showed above) handles the offline PIN/biometric auth

This gives you:
- Battle-tested auth infrastructure
- Best SMS delivery in East Africa
- Full control over offline experience
- Self-hostable for data sovereignty
- Reasonable cost (~$0.03/SMS for OTP)
