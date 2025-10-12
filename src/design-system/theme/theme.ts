/**
 * React Native Paper Theme Configuration
 *
 * Custom theme extending Material Design 3 for the East African Skills Platform
 */

import { MD3LightTheme } from "react-native-paper";
import { colors, spacing, typography } from "../tokens";

export const theme = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,
		primary: colors.primary.main,
		primaryContainer: colors.primary.surface,
		secondary: colors.secondary.main,
		secondaryContainer: colors.secondary.surface,
		tertiary: colors.categories.business,
		tertiaryContainer: colors.neutral[100],
		surface: colors.neutral.white,
		surfaceVariant: colors.neutral.cream,
		background: colors.background.primary,
		error: colors.feedback.error,
		errorContainer: "#FEE2E2",
		onPrimary: colors.text.inverse,
		onPrimaryContainer: colors.primary.dark,
		onSecondary: colors.text.inverse,
		onSecondaryContainer: colors.secondary.dark,
		onTertiary: colors.text.inverse,
		onTertiaryContainer: colors.categories.business,
		onSurface: colors.text.primary,
		onSurfaceVariant: colors.text.secondary,
		onError: colors.text.inverse,
		onErrorContainer: colors.feedback.error,
		onBackground: colors.text.primary,
		outline: colors.border.medium,
		outlineVariant: colors.border.light,
		inverseSurface: colors.neutral[800],
		inverseOnSurface: colors.text.inverse,
		inversePrimary: colors.primary.light,
		shadow: "#000000",
		scrim: colors.background.overlay,
		backdrop: colors.background.overlay,
		// Custom colors for our design system
		success: colors.feedback.success,
		warning: colors.feedback.warning,
		info: colors.feedback.info,
	},
	fonts: {
		...MD3LightTheme.fonts,
		displayLarge: {
			...MD3LightTheme.fonts.displayLarge,
			fontSize: typography.fontSize["4xl"],
			fontWeight: typography.fontWeight.bold,
			lineHeight: typography.fontSize["4xl"] * typography.lineHeight.tight,
		},
		displayMedium: {
			...MD3LightTheme.fonts.displayMedium,
			fontSize: typography.fontSize["3xl"],
			fontWeight: typography.fontWeight.bold,
			lineHeight: typography.fontSize["3xl"] * typography.lineHeight.tight,
		},
		displaySmall: {
			...MD3LightTheme.fonts.displaySmall,
			fontSize: typography.fontSize["2xl"],
			fontWeight: typography.fontWeight.bold,
			lineHeight: typography.fontSize["2xl"] * typography.lineHeight.normal,
		},
		headlineLarge: {
			...MD3LightTheme.fonts.headlineLarge,
			fontSize: typography.fontSize.xl,
			fontWeight: typography.fontWeight.semibold,
			lineHeight: typography.fontSize.xl * typography.lineHeight.normal,
		},
		headlineMedium: {
			...MD3LightTheme.fonts.headlineMedium,
			fontSize: typography.fontSize.lg,
			fontWeight: typography.fontWeight.semibold,
			lineHeight: typography.fontSize.lg * typography.lineHeight.normal,
		},
		headlineSmall: {
			...MD3LightTheme.fonts.headlineSmall,
			fontSize: typography.fontSize.base,
			fontWeight: typography.fontWeight.semibold,
			lineHeight: typography.fontSize.base * typography.lineHeight.normal,
		},
		titleLarge: {
			...MD3LightTheme.fonts.titleLarge,
			fontSize: typography.fontSize.xl,
			fontWeight: typography.fontWeight.medium,
			lineHeight: typography.fontSize.xl * typography.lineHeight.normal,
		},
		titleMedium: {
			...MD3LightTheme.fonts.titleMedium,
			fontSize: typography.fontSize.base,
			fontWeight: typography.fontWeight.medium,
			lineHeight: typography.fontSize.base * typography.lineHeight.normal,
		},
		titleSmall: {
			...MD3LightTheme.fonts.titleSmall,
			fontSize: typography.fontSize.sm,
			fontWeight: typography.fontWeight.medium,
			lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
		},
		bodyLarge: {
			...MD3LightTheme.fonts.bodyLarge,
			fontSize: typography.fontSize.base,
			fontWeight: typography.fontWeight.regular,
			lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
		},
		bodyMedium: {
			...MD3LightTheme.fonts.bodyMedium,
			fontSize: typography.fontSize.sm,
			fontWeight: typography.fontWeight.regular,
			lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
		},
		bodySmall: {
			...MD3LightTheme.fonts.bodySmall,
			fontSize: typography.fontSize.xs,
			fontWeight: typography.fontWeight.regular,
			lineHeight: typography.fontSize.xs * typography.lineHeight.relaxed,
		},
		labelLarge: {
			...MD3LightTheme.fonts.labelLarge,
			fontSize: typography.fontSize.sm,
			fontWeight: typography.fontWeight.medium,
			lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
		},
		labelMedium: {
			...MD3LightTheme.fonts.labelMedium,
			fontSize: typography.fontSize.xs,
			fontWeight: typography.fontWeight.medium,
			lineHeight: typography.fontSize.xs * typography.lineHeight.normal,
		},
		labelSmall: {
			...MD3LightTheme.fonts.labelSmall,
			fontSize: typography.fontSize.xs,
			fontWeight: typography.fontWeight.regular,
			lineHeight: typography.fontSize.xs * typography.lineHeight.normal,
		},
	},
	roundness: spacing.radius.md,
	animation: {
		...MD3LightTheme.animation,
		scale: 1.0,
	},
} as const;

// Type augmentation for custom theme colors
declare global {
	namespace ReactNativePaper {
		interface ThemeColors {
			success: string;
			warning: string;
			info: string;
		}
	}
}

export type AppTheme = typeof theme;
