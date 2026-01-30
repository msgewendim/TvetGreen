/**
 * ScreenLayout Component
 *
 * Reusable screen layout wrapper with SafeAreaView to ensure content stays within phone viewport.
 * When headerExtendsToStatusBar is true, the top edge has no inset so a full-bleed header
 * (e.g. Header) can extend behind the status bar; the header is responsible for its own top padding.
 */

import type React from "react";
import {
	ScrollView,
	View,
	type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../tokens";

export type SafeAreaEdge = "top" | "left" | "right" | "bottom";

export interface ScreenLayoutProps {
	children: React.ReactNode;
	/** Whether content should be scrollable (default: true) */
	scrollable?: boolean;
	/** Show vertical scroll indicator (default: false) */
	showsVerticalScrollIndicator?: boolean;
	/** Background color override */
	backgroundColor?: string;
	/** Additional style for the container */
	style?: ViewStyle;
	/** Additional style for the content wrapper */
	contentStyle?: ViewStyle;
	/** Test ID for testing */
	testID?: string;
	/**
	 * When true, top safe area is excluded so the first child (e.g. Header) can extend
	 * behind the status bar. Use with Header so the green bar goes edge-to-edge and the
	 * status bar is not blocked (Header adds its own top padding for title/subtitle).
	 */
	headerExtendsToStatusBar?: boolean;
}

const DEFAULT_EDGES: SafeAreaEdge[] = ["top", "left", "right", "bottom"];
const HEADER_EXTENDS_EDGES: SafeAreaEdge[] = ["left", "right", "bottom"];

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
	children,
	scrollable = true,
	showsVerticalScrollIndicator = false,
	backgroundColor = colors.background.primary,
	style,
	contentStyle,
	testID,
	headerExtendsToStatusBar = false,
}) => {
	const edges = headerExtendsToStatusBar ? HEADER_EXTENDS_EDGES : DEFAULT_EDGES;

	return (
		<SafeAreaView
			edges={edges}
			style={[{ backgroundColor, flex: 1 }, style]}
			testID={testID}
		>
			{scrollable ? (
				<ScrollView
					contentContainerStyle={contentStyle}
					showsVerticalScrollIndicator={showsVerticalScrollIndicator}
					keyboardShouldPersistTaps="handled"
					nestedScrollEnabled
					scrollEventThrottle={16}
					style={[{ flex: 1 }]}
				>
					{children}
				</ScrollView>
			) : (
				<View style={{ flex: 1 }}>{children}</View>
			)}
		</SafeAreaView>
	);
};

