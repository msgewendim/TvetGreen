/**
 * Theme Provider Component
 *
 * Wraps the app with necessary providers for theming and safe areas
 */

import type React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { theme } from "./theme";

interface ThemeProviderProps {
	children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	return (
		<SafeAreaProvider>
			<PaperProvider theme={theme}>{children}</PaperProvider>
		</SafeAreaProvider>
	);
};
