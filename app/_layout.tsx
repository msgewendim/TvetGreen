import { useEffect } from "react";
import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";
import { QueryClientProvider } from "react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { ThemeProvider, colors } from "@/design-system";
import { useFrameworkReady } from "@/src/hooks/useFrameworkReady";
import { queryClient } from "@/src/services/query/QueryClient";
import { initializeFlags } from "@/src/core/flags";
import { initializeLearningStore } from "@/src/store/learningStore";
import { useAuthStore } from "@/src/store/authStore";
import "../i18n.config";
import { usePlatform } from "@/src/hooks/usePlatform";

function AuthGuard({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const segments = useSegments();
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const hasCheckedAuth = useAuthStore((s) => s.hasCheckedAuth);
	const checkAuth = useAuthStore((s) => s.checkAuth);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!hasCheckedAuth) return;

		const inAuthGroup = (segments[0] as string) === "(auth)";
		const inOnboarding = segments[0] === "onboarding";

		if (!isAuthenticated && !inAuthGroup && !inOnboarding) {
			router.replace("/(auth)/phone" as never);
		} else if (isAuthenticated && inAuthGroup) {
			router.replace("/(tabs)");
		}
	}, [isAuthenticated, hasCheckedAuth, segments, router]);

	if (!hasCheckedAuth) {
		return (
			<View style={layoutStyles.loading}>
				<ActivityIndicator size="large" color={colors.primary.main} />
			</View>
		);
	}

	return <>{children}</>;
}

const layoutStyles = StyleSheet.create({
	loading: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.background.tertiary,
	},
});

export default function RootLayout() {
	useFrameworkReady();
	const { isWeb } = usePlatform();
	useEffect(() => {
		initializeFlags();
		initializeLearningStore();
	}, []);

	return (
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<AuthGuard>
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name="(auth)" />
						<Stack.Screen name="(tabs)" />
						<Stack.Screen name="onboarding" />
						<Stack.Screen name="video" />
						<Stack.Screen name="+not-found" />
					</Stack>
				</AuthGuard>
				<StatusBar hidden={isWeb} barStyle="dark-content" />
			</QueryClientProvider>
		</ThemeProvider>
	);
}
