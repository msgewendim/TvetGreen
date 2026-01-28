import { useEffect } from "react";
import { QueryClientProvider } from "react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@/design-system";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { queryClient } from "@/src/services/query/QueryClient";
import { initializeFlags } from "@/src/core/flags";
import "../i18n.config"; // Initialize i18n

export default function RootLayout() {
	useFrameworkReady();

	useEffect(() => {
		initializeFlags();
	}, []);

	return (
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="onboarding" />
					<Stack.Screen name="video" />
					<Stack.Screen name="+not-found" />
				</Stack>
				<StatusBar style="auto" />
			</QueryClientProvider>
		</ThemeProvider>
	);
}
