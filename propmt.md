# Claude Code Prompt: Create Design System for East African Skills Platform

## Project Context
I'm building a React Native Expo app for vocational training in East Africa. The app is voice-first, offline-capable, and designed for users with varying literacy levels. The primary languages are Amharic and Swahili, with a focus on accessibility.

## Your Task
Create a complete design system folder structure using React Native Paper as the base component library, with custom components for voice-first and offline-first functionality.

---

## 1. Install Required Dependencies First

```bash
npx expo install react-native-paper react-native-safe-area-context
npx expo install expo-av expo-speech
npx expo install @react-native-async-storage/async-storage expo-file-system
npx expo install react-native-vector-icons @expo/vector-icons
npx expo install react-native-gesture-handler react-native-reanimated
```

---

## 2. Create Complete Folder Structure

Create this exact folder structure in `src/`:

```
src/
├── design-system/
│   ├── tokens/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   ├── components/
│   │   ├── buttons/
│   │   │   ├── Button.tsx
│   │   │   ├── VoiceButton.tsx
│   │   │   ├── CategoryButton.tsx
│   │   │   └── index.ts
│   │   ├── cards/
│   │   │   ├── Card.tsx
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   └── index.ts
│   │   ├── inputs/
│   │   │   ├── Input.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── VoiceInput.tsx
│   │   │   └── index.ts
│   │   ├── feedback/
│   │   │   ├── Toast.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── index.ts
│   │   ├── navigation/
│   │   │   ├── BottomNav.tsx
│   │   │   ├── Header.tsx
│   │   │   └── index.ts
│   │   ├── display/
│   │   │   ├── Chip.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── theme/
│   │   ├── theme.ts
│   │   ├── ThemeProvider.tsx
│   │   └── index.ts
│   └── index.ts
└── types/
    └── design-system.d.ts
```

---

## 3. Design Tokens Specifications

### colors.ts
Create with these exact color values:
- **Primary (Green)**: main: #16A34A, light: #22C55E, dark: #15803D, surface: #F0FDF4
- **Secondary (Orange)**: main: #F97316, light: #FB923C, dark: #EA580C, surface: #FFF7ED
- **Neutral (Cream/Gray)**: cream background: #FEF9F1, white: #FFFFFF, plus gray scale from 50-800
- **Feedback**: success: #22C55E, warning: #F59E0B, error: #EF4444, info: #3B82F6
- **Categories**: agriculture: #16A34A, greenEnergy: #F97316, construction: #F59E0B, business: #3B82F6

### typography.ts
- Font sizes: xs(12), sm(14), base(16), lg(18), xl(20), 2xl(24), 3xl(30), 4xl(36)
- Line heights: tight(1.2), normal(1.5), relaxed(1.75)
- Font weights: regular(400), medium(500), semibold(600), bold(700)

### spacing.ts
- Spacing scale: xs(4), sm(8), md(16), lg(24), xl(32), 2xl(48), 3xl(64)
- Border radius: sm(8), md(12), lg(16), xl(24), full(9999)

---

## 4. React Native Paper Theme Configuration

In `theme/theme.ts`, create a custom theme that:
- Extends MD3LightTheme from react-native-paper
- Uses our custom color tokens
- Configures typography with our font sizes
- Sets roundness to our border radius
- Properly types the theme for TypeScript

Create `ThemeProvider.tsx` that wraps the app with:
- PaperProvider with our custom theme
- SafeAreaProvider for safe areas
- Any other necessary providers

---

## 5. Component Requirements

### Button Component (`buttons/Button.tsx`)
Create a custom button that:
- Wraps React Native Paper's Button
- Has variants: primary, secondary, outline, ghost
- Has sizes: small, medium, large
- Supports icons from @expo/vector-icons
- Supports fullWidth prop
- Has proper TypeScript types
- Includes accessibility props
- Has disabled state
- Uses our design tokens for colors and spacing

### VoiceButton Component (`buttons/VoiceButton.tsx`)
Create a floating action button for voice input:
- Circular button with microphone icon
- Size variants: small(40px), medium(56px), large(72px)
- Has active/listening state with animation
- Uses Animated API for press feedback
- Orange/secondary color from tokens
- Elevation/shadow for floating effect
- Accessibility labels for screen readers
- TypeScript interface for props

### CategoryButton Component (`buttons/CategoryButton.tsx`)
Create a button for course categories:
- Displays icon in colored circle
- Shows category label below icon
- Accepts custom icon component
- Accepts custom color
- Has hover/press effects
- Minimum touch target 44px
- Flexible sizing
- Proper spacing using tokens

### CourseCard Component (`cards/CourseCard.tsx`)
Create a card showing course information:
- Title, category badge, duration
- Progress bar showing completion percentage
- Optional download icon indicator
- Thumbnail/image area (leave placeholder for now)
- Uses React Native Paper's Card as base
- Proper elevation and shadows
- Press feedback with TouchableOpacity
- TypeScript interface with all props
- Accessibility role and labels

### Input Component (`inputs/Input.tsx`)
Create a custom text input:
- Wraps React Native Paper's TextInput
- Supports label, placeholder, error message
- Can include left icon
- Optional voice input button on right
- Error state styling
- Focus state with color change
- Uses design tokens
- Proper TypeScript types

### VoiceInput Component (`inputs/VoiceInput.tsx`)
Create a text input with integrated voice capability:
- Regular text input with VoiceButton attached
- Manages voice listening state
- Integrates expo-speech for audio feedback
- Shows listening indicator
- Placeholder for speech recognition logic
- TypeScript typed properly

### ProgressBar Component (`feedback/ProgressBar.tsx`)
Create a custom progress bar:
- Smooth animated progress
- Configurable color
- Optional percentage label
- Different sizes: small, medium, large
- Uses design tokens for styling
- Accessible to screen readers

### Toast Component (`feedback/Toast.tsx`)
Create a toast notification:
- Types: success, error, warning, info
- Auto-dismiss after timeout
- Icon for each type
- Close button
- Positioned at bottom of screen
- Slide-up animation
- Uses React Native Animated API
- Queue multiple toasts if needed

### Chip Component (`display/Chip.tsx`)
Create a chip/badge component:
- Variants: default, primary, secondary, success
- Optional icon
- Small, rounded pill shape
- Uses design tokens
- TypeScript interface

---

## 6. TypeScript Types

Create comprehensive TypeScript types in `types/design-system.d.ts` for:
- All color values
- Typography scales
- Spacing values
- Component prop interfaces
- Theme type extensions
- Variant types (button variants, card variants, etc.)

---

## 7. Index Files

Create proper index.ts files in each folder that export all components/tokens for easy imports:
- `tokens/index.ts` - exports colors, typography, spacing
- `components/index.ts` - exports all component categories
- `design-system/index.ts` - exports everything
- Each component folder (buttons/, cards/, etc.) has its own index.ts

---

## 8. Implementation Requirements

**Code Quality:**
- Use TypeScript strictly, no `any` types
- All components must be functional components with hooks
- Use React.memo for performance where appropriate
- Proper prop validation with TypeScript interfaces
- Include JSDoc comments for complex logic

**Accessibility:**
- All interactive components have accessibility labels
- Proper accessibility roles
- Screen reader friendly
- Minimum touch target sizes (44x44px)
- High contrast for text readability

**Performance:**
- Use Animated API for animations, not setState
- Memoize expensive computations
- Avoid unnecessary re-renders
- Lazy load where possible

**Styling:**
- Use StyleSheet.create() for styles
- No inline styles except for dynamic values
- Consistent use of design tokens
- No magic numbers - everything from tokens

**React Native Paper Integration:**
- Use Paper components as base when possible
- Extend rather than replace Paper components
- Maintain Paper's theming system
- Override styles using Paper's style props

---

## 9. Example Screen Template

Create `src/design-system/examples/ExampleScreen.tsx` that demonstrates:
- How to import and use the design system
- A complete screen layout with multiple components
- Proper theme usage
- Voice button integration
- Course cards in a list
- Navigation
- Toast notification trigger
- Heavily commented for learning

---

## 10. Documentation

Create `src/design-system/README.md` with:
- Quick start guide
- How to import components
- How to use design tokens
- Component API documentation
- Code examples for each component
- Theming guide
- Best practices

---

## 11. Testing Setup (Optional but Recommended)

Create basic test files for:
- Button component
- VoiceButton component
- CourseCard component
Use React Native Testing Library

---

## Important Notes

1. **Offline-First**: Components should handle offline state gracefully
2. **Voice-First**: Every interactive element should support voice alternatives
3. **Low-Literacy**: Heavy use of icons, colors, and audio feedback
4. **Localization Ready**: Use i18n keys for text (you can use English placeholders for now)
5. **Amharic/Swahili Support**: Test with RTL and special characters in mind
6. **Low-End Devices**: Optimize for performance on older Android devices

---

## Expected Output

After running this prompt, I should have:
- ✅ Complete design system folder structure
- ✅ All design tokens properly defined
- ✅ React Native Paper theme configured
- ✅ 15+ production-ready components
- ✅ Proper TypeScript types throughout
- ✅ Index files for clean imports
- ✅ Example screen showing usage
- ✅ Comprehensive README documentation
- ✅ Consistent code style and patterns

---

## Commands to Run After Setup

```bash
# Verify imports work
npm run type-check

# Test the app
npx expo start

# Check for unused dependencies
npx expo install --check
```

---

## Success Criteria

The design system is complete when:
1. All files compile without TypeScript errors
2. Components render corr