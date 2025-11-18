/**
 * ScreenLayout Component
 *
 * Reusable screen layout wrapper with SafeAreaView to ensure content stays within phone viewport
 * Provides consistent padding and styling across all app screens
 */

import type React from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native'
import { colors } from '../../tokens'

export interface ScreenLayoutProps {
	children: React.ReactNode
	/** Whether content should be scrollable (default: true) */
	scrollable?: boolean
	/** Show vertical scroll indicator (default: false) */
	showsVerticalScrollIndicator?: boolean
	/** Background color override */
	backgroundColor?: string
	/** Additional style for the container */
	style?: ViewStyle
	/** Additional style for the content wrapper */
	contentStyle?: ViewStyle
	/** Test ID for testing */
	testID?: string
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
	children,
	scrollable = true,
	showsVerticalScrollIndicator = false,
	backgroundColor = colors.background.primary,
	style,
	contentStyle,
	testID,
}) => {
	return (
		<SafeAreaView
			style={[styles.safeArea, { backgroundColor }, style]}
			testID={testID}
		>
			{scrollable ? (
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={[styles.contentContainer, contentStyle]}
					showsVerticalScrollIndicator={showsVerticalScrollIndicator}
					keyboardShouldPersistTaps="handled"
					nestedScrollEnabled
					scrollEventThrottle={16}
				>
					{children}
				</ScrollView>
			) : (
				<View style={[styles.container, contentStyle]}>{children}</View>
			)}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	container: {
		flex: 1,
	},
	contentContainer: {
		flexGrow: 1,
	},
})
