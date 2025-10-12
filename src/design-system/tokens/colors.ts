/**
 * Design System Color Tokens
 *
 * Color palette for the East African Skills Platform
 * Optimized for accessibility and outdoor viewing conditions
 */

export const colors = {
	// Primary - Green (represents growth, agriculture, sustainability)
	primary: {
		main: "#16A34A",
		light: "#22C55E",
		dark: "#15803D",
		surface: "#F0FDF4",
	},

	// Secondary - Orange (energy, enthusiasm, warmth)
	secondary: {
		main: "#F97316",
		light: "#FB923C",
		dark: "#EA580C",
		surface: "#FFF7ED",
	},

	// Neutral - Cream/Gray palette
	neutral: {
		cream: "#FEF9F1",
		white: "#FFFFFF",
		50: "#F9FAFB",
		100: "#F3F4F6",
		200: "#E5E7EB",
		300: "#D1D5DB",
		400: "#9CA3AF",
		500: "#6B7280",
		600: "#4B5563",
		700: "#374151",
		800: "#1F2937",
	},

	// Feedback colors
	feedback: {
		success: "#22C55E",
		successLight: "#F0FDF4",
		warning: "#F59E0B",
		error: "#EF4444",
		info: "#3B82F6",
	},

	// Category-specific colors
	categories: {
		agriculture: "#16A34A",
		greenEnergy: "#F97316",
		construction: "#F59E0B",
		business: "#3B82F6",
	},

	// Text colors
	text: {
		primary: "#1F2937",
		secondary: "#6B7280",
		tertiary: "#9CA3AF",
		inverse: "#FFFFFF",
		disabled: "#D1D5DB",
	},

	// Background colors
	background: {
		primary: "#FEF9F1",
		cream: "#FEF9F1",
		secondary: "#FFFFFF",
		tertiary: "#F9FAFB",
		overlay: "rgba(0, 0, 0, 0.5)",
	},

	// Border colors
	border: {
		light: "#E5E7EB",
		medium: "#D1D5DB",
		dark: "#9CA3AF",
	},
} as const;

export type ColorTokens = typeof colors;
