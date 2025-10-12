/**
 * LoadingSpinner Component
 *
 * Simple loading spinner using React Native Paper's ActivityIndicator
 */

import type React from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import type { LoadingSpinnerProps } from "../../../types/design-system";
import { colors } from "../../tokens";

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	size = "large",
	color = colors.primary.main,
	testID,
	accessibilityLabel = "Loading",
	style,
}) => {
	return (
		<View style={[styles.container, style]}>
			<ActivityIndicator
				size={size}
				color={color}
				testID={testID}
				accessibilityLabel={accessibilityLabel}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
	},
});
