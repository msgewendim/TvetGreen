/**
 * Design System TypeScript Type Definitions
 *
 * Comprehensive types for all design system components and tokens
 */

import { ReactNode } from "react";
import { ViewStyle, TextStyle, ImageStyle } from "react-native";

// ==================== Component Variant Types ====================

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "small" | "medium" | "large";

export type VoiceButtonSize = "small" | "medium" | "large";
export type VoiceButtonState = "idle" | "listening" | "processing";

export type CardVariant = "default" | "elevated" | "outlined";

export type InputVariant = "filled" | "outlined";
export type InputSize = "small" | "medium" | "large";

export type ToastType = "success" | "error" | "warning" | "info";
export type ProgressBarSize = "small" | "medium" | "large";

export type ChipVariant =
	| "default"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "error";
export type ChipSize = "small" | "medium";

export type BadgeVariant =
	| "default"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "error";
export type BadgeSize = "small" | "medium" | "large";

export type AvatarSize = "small" | "medium" | "large" | "xlarge";

// ==================== Component Props Types ====================

export interface BaseComponentProps {
	testID?: string;
	accessibilityLabel?: string;
	accessibilityHint?: string;
	style?: ViewStyle | ViewStyle[];
}

export interface ButtonProps extends BaseComponentProps {
	children: ReactNode;
	variant?: ButtonVariant;
	size?: ButtonSize;
	onPress: () => void;
	disabled?: boolean;
	loading?: boolean;
	fullWidth?: boolean;
	icon?: ReactNode;
	iconPosition?: "left" | "right";
}

export interface VoiceButtonProps extends BaseComponentProps {
	size?: VoiceButtonSize;
	state?: VoiceButtonState;
	onPress: () => void;
	onLongPress?: () => void;
	disabled?: boolean;
}

export interface CategoryButtonProps extends BaseComponentProps {
	icon: ReactNode;
	label: string;
	color?: string;
	onPress: () => void;
	disabled?: boolean;
}

export interface CardProps extends BaseComponentProps {
	children: ReactNode;
	variant?: CardVariant;
	onPress?: () => void;
}

export interface CourseCardProps extends BaseComponentProps {
	title: string;
	category: string;
	categoryColor?: string;
	duration: string;
	progress?: number;
	isDownloaded?: boolean;
	thumbnailUrl?: string;
	onPress: () => void;
}

export interface CategoryCardProps extends BaseComponentProps {
	icon: ReactNode;
	title: string;
	color: string;
	courseCount?: number;
	onPress: () => void;
}

export interface InputProps extends BaseComponentProps {
	label?: string;
	placeholder?: string;
	value: string;
	onChangeText: (text: string) => void;
	error?: string;
	helperText?: string;
	variant?: InputVariant;
	size?: InputSize;
	disabled?: boolean;
	secureTextEntry?: boolean;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	multiline?: boolean;
	numberOfLines?: number;
	onFocus?: () => void;
	onBlur?: () => void;
}

export interface SearchInputProps extends Omit<InputProps, "leftIcon"> {
	onClear?: () => void;
	showVoiceButton?: boolean;
	onVoicePress?: () => void;
}

export interface VoiceInputProps extends Omit<InputProps, "rightIcon"> {
	onVoiceStart?: () => void;
	onVoiceEnd?: () => void;
	onVoiceResult?: (text: string) => void;
	isListening?: boolean;
}

export interface ToastProps {
	type: ToastType;
	message: string;
	duration?: number;
	onDismiss?: () => void;
	visible: boolean;
}

export interface ProgressBarProps extends BaseComponentProps {
	progress: number; // 0-100
	size?: ProgressBarSize;
	color?: string;
	showLabel?: boolean;
	animated?: boolean;
}

export interface LoadingSpinnerProps extends BaseComponentProps {
	size?: "small" | "large";
	color?: string;
}

export interface EmptyStateProps extends BaseComponentProps {
	icon?: ReactNode;
	title: string;
	description?: string;
	action?: {
		label: string;
		onPress: () => void;
	};
}

export interface HeaderProps extends BaseComponentProps {
	title: string;
	subtitle?: string;
	variant?: "default" | "minimal";
	leftAction?: {
		icon: ReactNode;
		onPress: () => void;
		accessibilityLabel?: string;
	};
	rightAction?: {
		icon: ReactNode;
		onPress: () => void;
		accessibilityLabel?: string;
	};
	backgroundColor?: string;
}

export interface CategoryChipProps extends BaseComponentProps {
	label: string;
	emoji?: string;
	color?: string;
	isActive?: boolean;
	onPress?: () => void;
}

export interface BottomNavProps extends BaseComponentProps {
	currentRoute: string;
	onNavigate: (route: string) => void;
}

export interface ChipProps extends BaseComponentProps {
	label: string;
	variant?: ChipVariant;
	size?: ChipSize;
	icon?: ReactNode;
	onPress?: () => void;
	onClose?: () => void;
}

export interface BadgeProps extends BaseComponentProps {
	content: string | number;
	variant?: BadgeVariant;
	size?: BadgeSize;
	max?: number; // Max number to display before showing "99+"
}

export interface AvatarProps extends BaseComponentProps {
	source?: string | { uri: string };
	name?: string; // For fallback initials
	size?: AvatarSize;
	backgroundColor?: string;
	onPress?: () => void;
}

// ==================== Category Types ====================

export interface Category {
	id: string;
	name: string;
	color: string;
	icon: ReactNode;
	courseCount?: number;
}

export interface Course {
	id: string;
	title: string;
	category: string;
	categoryColor?: string;
	duration: string;
	progress?: number;
	isDownloaded?: boolean;
	thumbnailUrl?: string;
	instructor?: string;
	description?: string;
	totalLessons?: number;
	completedLessons?: number;
}

// ==================== Style Helper Types ====================

export interface StyleProps {
	style?: ViewStyle;
	textStyle?: TextStyle;
	imageStyle?: ImageStyle;
}

// ==================== Animation Types ====================

export interface AnimationConfig {
	duration?: number;
	delay?: number;
	useNativeDriver?: boolean;
}

// ==================== Accessibility Types ====================

export interface AccessibilityProps {
	accessible?: boolean;
	accessibilityLabel?: string;
	accessibilityHint?: string;
	accessibilityRole?:
		| "none"
		| "button"
		| "link"
		| "search"
		| "image"
		| "keyboardkey"
		| "text"
		| "adjustable"
		| "imagebutton"
		| "header"
		| "summary"
		| "alert"
		| "checkbox"
		| "combobox"
		| "menu"
		| "menubar"
		| "menuitem"
		| "progressbar"
		| "radio"
		| "radiogroup"
		| "scrollbar"
		| "spinbutton"
		| "switch"
		| "tab"
		| "tablist"
		| "timer"
		| "toolbar";
	accessibilityState?: {
		disabled?: boolean;
		selected?: boolean;
		checked?: boolean | "mixed";
		busy?: boolean;
		expanded?: boolean;
	};
	accessibilityValue?: {
		min?: number;
		max?: number;
		now?: number;
		text?: string;
	};
}
