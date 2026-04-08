/**
 * SearchInput Component
 *
 * Specialized input for search with clear and optional voice buttons
 */

import { Mic, Search, X } from "lucide-react-native";
import type React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import type { SearchInputProps } from "../../../types/design-system";
import { colors, spacing } from "../../tokens";
import { Input } from "./Input";

export const SearchInput: React.FC<SearchInputProps> = ({
	value,
	onChangeText,
	onClear,
	showVoiceButton = false,
	onVoicePress,
	placeholder = "Search...",
	...props
}) => {
	const handleClear = () => {
		onChangeText("");
		onClear?.();
	};

	const renderRightIcon = () => {
		if (value && onClear) {
			return (
				<TouchableOpacity
					onPress={handleClear}
					accessibilityLabel="Clear search"
					accessibilityRole="button"
					style={styles.iconButton}
				>
					<X size={20} color={colors.text.secondary} strokeWidth={2} />
				</TouchableOpacity>
			);
		}

		if (showVoiceButton && onVoicePress) {
			return (
				<TouchableOpacity
					onPress={onVoicePress}
					accessibilityLabel="Voice search"
					accessibilityRole="button"
					style={styles.iconButton}
				>
					<Mic size={20} color={colors.accent.main} strokeWidth={2} />
				</TouchableOpacity>
			);
		}

		return null;
	};

	return (
		<Input
			value={value}
			onChangeText={onChangeText}
			placeholder={placeholder}
			leftIcon={
				<Search size={20} color={colors.text.secondary} strokeWidth={2} />
			}
			rightIcon={renderRightIcon()}
			{...props}
		/>
	);
};

const styles = StyleSheet.create({
	iconButton: {
		padding: spacing.xs,
	},
});
