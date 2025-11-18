# Localization Guide for TvetGreen

This document explains the multi-language localization system implemented in TvetGreen.

## Overview

TvetGreen supports three languages:
- **English (en)** - Default language
- **Kiswahili (sw)** - Swahili
- **አማርኛ (am)** - Amharic

The localization system uses `react-i18next` with automatic language detection, persistence, and seamless language switching without requiring app restart.

## File Structure

```
TvetGreen/
├── i18n.config.ts                    # i18n configuration and initialization
├── locales/                          # Translation files
│   ├── en/
│   │   └── translation.json          # English translations
│   ├── sw/
│   │   └── translation.json          # Swahili translations
│   └── am/
│       └── translation.json          # Amharic translations
├── hooks/
│   └── useLanguage.ts                # Language management hook
└── src/components/settings/
    └── LanguageSelector.tsx          # Language selection component
```

## Using Translations in Components

### Basic Usage

Import the `useLanguage` hook and use the `t()` function to translate strings:

```tsx
import { useLanguage } from '@/hooks/useLanguage';

function MyComponent() {
  const { t } = useLanguage();

  return (
    <View>
      <Text>{t('navigation.home')}</Text>
      <Text>{t('common.continue')}</Text>
    </View>
  );
}
```

### Translation Key Structure

Translation keys are organized in namespaces:

- `common.*` - Common UI elements (buttons, actions)
- `navigation.*` - Navigation labels and screen titles
- `courses.*` - Course-related content
- `home.*` - Home screen content
- `profile.*` - Profile and settings
- `downloads.*` - Download management
- `video.*` - Video player controls
- `voice.*` - Voice guide messages
- `errors.*` - Error messages
- `onboarding.*` - Onboarding flow

Example keys:
```typescript
t('common.continue')        // "Continue" / "Endelea" / "ቀጥል"
t('courses.agriculture')    // "Agriculture" / "Kilimo" / "ግብርና"
t('navigation.profile')     // "Profile" / "Wasifu" / "መገለጫ"
```

### Using the useLanguage Hook

The `useLanguage` hook provides several utilities:

```tsx
import { useLanguage } from '@/hooks/useLanguage';

function LanguageSettings() {
  const {
    t,                        // Translation function
    currentLanguage,          // Current language code ('en', 'sw', 'am')
    languageInfo,            // Current language metadata
    supportedLanguages,      // Array of all supported languages
    changeLanguage,          // Function to change language
    isLanguageActive,        // Check if a language is active
  } = useLanguage();

  // Change language
  const handleLanguageChange = async (lang: 'en' | 'sw' | 'am') => {
    await changeLanguage(lang);
  };

  // Display current language
  return (
    <View>
      <Text>Current: {languageInfo.nativeName}</Text>
      <Text>Code: {currentLanguage}</Text>
    </View>
  );
}
```

### Language Selector Component

Use the pre-built `LanguageSelector` component for language selection:

```tsx
import { LanguageSelector } from '@/src/components/settings';

function SettingsScreen() {
  return (
    <View>
      <Text>Select Language:</Text>
      <LanguageSelector />
    </View>
  );
}
```

## Adding New Translations

### Step 1: Add Keys to Translation Files

Add your translation keys to all three language files:

**locales/en/translation.json:**
```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is my new feature"
  }
}
```

**locales/sw/translation.json:**
```json
{
  "myFeature": {
    "title": "Kipengele Changu",
    "description": "Hiki ni kipengele changu kipya"
  }
}
```

**locales/am/translation.json:**
```json
{
  "myFeature": {
    "title": "የእኔ ባህሪ",
    "description": "ይህ የእኔ አዲስ ባህሪ ነው"
  }
}
```

### Step 2: Use in Components

```tsx
import { useLanguage } from '@/hooks/useLanguage';

function MyFeature() {
  const { t } = useLanguage();

  return (
    <View>
      <Text>{t('myFeature.title')}</Text>
      <Text>{t('myFeature.description')}</Text>
    </View>
  );
}
```

## Advanced Features

### Pluralization

i18next supports pluralization out of the box:

**translation.json:**
```json
{
  "courses": {
    "lessons_one": "{{count}} lesson",
    "lessons_other": "{{count}} lessons"
  }
}
```

**Usage:**
```tsx
<Text>{t('courses.lessons', { count: 5 })}</Text>
// Output: "5 lessons"
```

### Interpolation

Insert dynamic values into translations:

**translation.json:**
```json
{
  "welcome": "Welcome back, {{name}}!"
}
```

**Usage:**
```tsx
<Text>{t('welcome', { name: 'Fatima' })}</Text>
// Output: "Welcome back, Fatima!"
```

## Adding a New Language

To add support for a new language (e.g., Arabic):

### 1. Create Translation File

Create `locales/ar/translation.json` with all required translations.

### 2. Update i18n.config.ts

Add the language to the configuration:

```typescript
// Import translation file
import ar from './locales/ar/translation.json';

// Add to SUPPORTED_LANGUAGES
export const SUPPORTED_LANGUAGES = ['en', 'sw', 'am', 'ar'] as const;

// Add to LANGUAGE_INFO
export const LANGUAGE_INFO = {
  // ... existing languages
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
  },
} as const;

// Add to resources
const resources = {
  en: { translation: en },
  sw: { translation: sw },
  am: { translation: am },
  ar: { translation: ar },
};
```

### 3. RTL Support (for Arabic)

For RTL languages, you'll need to add RTL configuration:

```typescript
import { I18nManager } from 'react-native';

// In your language change handler
if (language === 'ar') {
  I18nManager.forceRTL(true);
} else {
  I18nManager.forceRTL(false);
}
```

## Language Detection

The app automatically detects the user's preferred language using the following priority:

1. **Saved preference** - Language saved in AsyncStorage
2. **Device language** - Device's system language
3. **Fallback** - English (default)

## Persistence

Language preferences are automatically saved to AsyncStorage and persist across app restarts.

## Testing Translations

### Manual Testing

1. Open the app and navigate to Profile → Language
2. Tap on a language option
3. Verify all screens update immediately
4. Restart the app and verify the language persists

### Translation Coverage

Current translation coverage by screen:
- ✅ Home screen
- ✅ Courses screen
- ✅ Downloads screen
- ✅ Profile screen
- ⏳ Video player screen (pending)
- ⏳ Onboarding screens (pending)

## Best Practices

### 1. Use Descriptive Keys

```tsx
// Good
t('profile.editProfile')

// Bad
t('edit')
```

### 2. Group Related Translations

```json
{
  "downloads": {
    "title": "Downloads",
    "downloaded": "Downloaded",
    "downloading": "Downloading"
  }
}
```

### 3. Avoid Hardcoded Strings

```tsx
// Bad
<Text>Click here</Text>

// Good
<Text>{t('common.clickHere')}</Text>
```

### 4. Provide Context for Translators

Add comments in translation files:

```json
{
  "_comment": "Profile screen translations",
  "profile": {
    "signOut": "Sign Out"
  }
}
```

## Common Issues and Solutions

### Issue: Translations Not Updating

**Solution:** Make sure you've imported `i18n.config` in your root layout:

```tsx
// app/_layout.tsx
import '../i18n.config';
```

### Issue: Missing Translation Keys

**Solution:** Check the browser/console for missing key warnings and add them to all translation files.

### Issue: Language Not Persisting

**Solution:** Ensure AsyncStorage is properly configured and the app has permission to write to storage.

## Translation Resources

For professional translations:
- **Swahili:** Consider consulting native East African speakers
- **Amharic:** Ensure Ethiopic script (ግዕዝ) renders correctly
- **General:** Use context-aware translations, not literal word-for-word

## Contributing Translations

When adding new features:

1. Add English translations first
2. Update Swahili translations (or mark as TODO)
3. Update Amharic translations (or mark as TODO)
4. Test all language variants
5. Ensure text doesn't break layouts

## Support

For translation-related issues or improvements:
- Check existing translation keys in `locales/*/translation.json`
- Refer to i18next documentation: https://react.i18next.com/
- Review the `useLanguage` hook implementation
