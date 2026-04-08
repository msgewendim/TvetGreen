import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View, StatusBar } from "react-native";
import { QueryClientProvider } from "react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { ThemeProvider, colors } from "@/design-system";
import { useFrameworkReady } from "@/src/hooks/useFrameworkReady";
import { queryClient } from "@/src/services/query/QueryClient";
import { initializeFlags } from "@/src/core/flags";
import { initializeLearningStore } from "@/src/store/learningStore";
import { useAuthStore } from "@/src/store/authStore";
import { useOnboardingStore } from "@/src/store/onboardingStore";
import { getRouteDestination } from "@/src/store/routeDecision";
import "../i18n.config";
import { usePlatform } from "@/src/hooks/usePlatform";

function AuthGuard({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const segments = useSegments();
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const hasCheckedAuth = useAuthStore((s) => s.hasCheckedAuth);
	const checkAuth = useAuthStore((s) => s.checkAuth);
	const languageChosen = useOnboardingStore((s) => s.languageChosen);
	const onboardingComplete = useOnboardingStore((s) => s.onboardingComplete);
	const loadPersistedState = useOnboardingStore((s) => s.loadPersistedState);

	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		async function initialize() {
			await checkAuth();
			await loadPersistedState();
			setIsReady(true);
		}
		initialize();
	}, [checkAuth, loadPersistedState]);

	useEffect(() => {
		if (!isReady || !hasCheckedAuth) return;

		const currentSegment = segments[0] as string;
		const inAuthGroup = currentSegment === "(auth)";
		const inOnboarding = currentSegment === "onboarding";
		const inTabs = currentSegment === "(tabs)";

		const destination = getRouteDestination({
			hasLanguage: languageChosen,
			isAuthenticated,
			onboardingComplete,
		});

		// Avoid unnecessary redirects if already at the right place
		const isAtDestination =
			(destination === "/onboarding/language" && inOnboarding) ||
			(destination === "/(auth)/phone" && inAuthGroup) ||
			(destination === "/onboarding/welcome" && inOnboarding) ||
			(destination === "/(tabs)" && inTabs);

		if (!isAtDestination) {
			router.replace(destination as never);
		}
	}, [
		isReady,
		hasCheckedAuth,
		isAuthenticated,
		languageChosen,
		onboardingComplete,
		segments,
		router,
	]);

	if (!isReady || !hasCheckedAuth) {
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
						<Stack.Screen name="onboarding" />
						<Stack.Screen name="(auth)" />
						<Stack.Screen name="(tabs)" />
						<Stack.Screen name="video" />
						<Stack.Screen name="course" />
						<Stack.Screen name="+not-found" />
					</Stack>
				</AuthGuard>
				<StatusBar hidden={isWeb} barStyle="dark-content" />
			</QueryClientProvider>
		</ThemeProvider>
	);
}
