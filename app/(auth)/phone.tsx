import { useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useRouter } from "expo-router";
import { Phone } from "lucide-react-native";
import { colors, spacing, typography } from "@/design-system";
import { useAuthStore } from "@/src/store/authStore";
import { useLanguage } from "@/src/hooks/useLanguage";

export default function PhoneScreen() {
	const [phone, setPhone] = useState("");
	const router = useRouter();
	const requestOtp = useAuthStore((s) => s.requestOtp);
	const isLoading = useAuthStore((s) => s.isLoading);
	const { t } = useLanguage();

	const handleSubmit = async () => {
		const cleaned = phone.replace(/\D/g, "");
		if (cleaned.length < 9) {
			Alert.alert("Invalid Number", "Please enter a valid phone number.");
			return;
		}

		const success = await requestOtp(phone);
		if (success) {
			router.push({ pathname: "/(auth)/verify" as never, params: { phone } });
		} else {
			Alert.alert("Error", "Failed to send OTP. Please try again.");
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<View style={styles.content}>
				<View style={styles.iconContainer}>
					<Phone size={48} color={colors.primary.main} strokeWidth={1.5} />
				</View>

				<Text style={styles.title}>Welcome to TvetGreen</Text>
				<Text style={styles.subtitle}>
					Enter your phone number to get started
				</Text>

				<View style={styles.inputContainer}>
					<Text style={styles.countryCode}>+256</Text>
					<TextInput
						style={styles.input}
						placeholder="Phone number"
						placeholderTextColor={colors.text.tertiary}
						value={phone}
						onChangeText={setPhone}
						keyboardType="phone-pad"
						autoFocus
						maxLength={15}
						accessibilityLabel="Phone number input"
					/>
				</View>

				<TouchableOpacity
					style={[styles.button, isLoading && styles.buttonDisabled]}
					onPress={handleSubmit}
					disabled={isLoading || phone.length < 9}
					accessibilityLabel="Send verification code"
				>
					<Text style={styles.buttonText}>
						{isLoading ? "Sending..." : "Send Verification Code"}
					</Text>
				</TouchableOpacity>

				<Text style={styles.disclaimer}>
					We'll send you a one-time verification code via SMS.
				</Text>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.tertiary,
	},
	content: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: spacing.xl,
	},
	iconContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: colors.primary.surface,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center",
		marginBottom: spacing.xl,
	},
	title: {
		fontSize: typography.fontSize["3xl"],
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		textAlign: "center",
		marginBottom: spacing.sm,
	},
	subtitle: {
		fontSize: typography.fontSize.base,
		color: colors.text.secondary,
		textAlign: "center",
		marginBottom: spacing["2xl"],
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.neutral.white,
		borderRadius: spacing.radius.md,
		borderWidth: 1,
		borderColor: colors.neutral[200],
		marginBottom: spacing.lg,
		overflow: "hidden",
	},
	countryCode: {
		paddingHorizontal: spacing.md,
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		borderRightWidth: 1,
		borderRightColor: colors.neutral[200],
		paddingVertical: spacing.md,
	},
	input: {
		flex: 1,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		fontSize: typography.fontSize.lg,
		color: colors.text.primary,
	},
	button: {
		backgroundColor: colors.primary.main,
		paddingVertical: spacing.md,
		borderRadius: spacing.radius.md,
		alignItems: "center",
		marginBottom: spacing.lg,
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	buttonText: {
		color: colors.text.inverse,
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.semibold,
	},
	disclaimer: {
		fontSize: typography.fontSize.sm,
		color: colors.text.tertiary,
		textAlign: "center",
	},
});
