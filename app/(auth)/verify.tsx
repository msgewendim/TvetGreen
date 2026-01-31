import { useRef, useState } from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { ShieldCheck } from "lucide-react-native";
import { colors, spacing, typography } from "@/design-system";
import { useAuthStore } from "@/src/store/authStore";

const OTP_LENGTH = 6;

export default function VerifyScreen() {
	const { phone } = useLocalSearchParams<{ phone: string }>();
	const router = useRouter();
	const verifyOtp = useAuthStore((s) => s.verifyOtp);
	const requestOtp = useAuthStore((s) => s.requestOtp);
	const isLoading = useAuthStore((s) => s.isLoading);

	const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
	const inputRefs = useRef<(TextInput | null)[]>([]);

	const handleChange = (text: string, index: number) => {
		const newOtp = [...otp];
		newOtp[index] = text;
		setOtp(newOtp);

		// Auto-advance to next input
		if (text && index < OTP_LENGTH - 1) {
			inputRefs.current[index + 1]?.focus();
		}

		// Auto-submit when all digits entered
		if (index === OTP_LENGTH - 1 && text) {
			const fullOtp = newOtp.join("");
			if (fullOtp.length === OTP_LENGTH) {
				handleVerify(fullOtp);
			}
		}
	};

	const handleKeyPress = (key: string, index: number) => {
		if (key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handleVerify = async (code?: string) => {
		const otpCode = code || otp.join("");
		if (otpCode.length !== OTP_LENGTH) {
			Alert.alert("Invalid Code", "Please enter the 6-digit code.");
			return;
		}

		const success = await verifyOtp(phone || "", otpCode);
		if (success) {
			router.replace("/(tabs)");
		} else {
			Alert.alert("Verification Failed", "Invalid code. Please try again.");
			setOtp(Array(OTP_LENGTH).fill(""));
			inputRefs.current[0]?.focus();
		}
	};

	const handleResend = async () => {
		if (phone) {
			const success = await requestOtp(phone);
			if (success) {
				Alert.alert("Code Sent", "A new verification code has been sent.");
			}
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<View style={styles.content}>
				<View style={styles.iconContainer}>
					<ShieldCheck
						size={48}
						color={colors.primary.main}
						strokeWidth={1.5}
					/>
				</View>

				<Text style={styles.title}>Verify Your Number</Text>
				<Text style={styles.subtitle}>
					Enter the 6-digit code sent to{"\n"}
					<Text style={styles.phoneText}>{phone}</Text>
				</Text>

				<View style={styles.otpContainer}>
					{otp.map((digit, index) => (
						<TextInput
							key={`otp-digit-${index}`}
							ref={(ref) => {
								inputRefs.current[index] = ref;
							}}
							style={[styles.otpInput, digit && styles.otpInputFilled]}
							value={digit}
							onChangeText={(text) => handleChange(text, index)}
							onKeyPress={({ nativeEvent }) =>
								handleKeyPress(nativeEvent.key, index)
							}
							keyboardType="number-pad"
							maxLength={1}
							selectTextOnFocus
							accessibilityLabel={`Digit ${index + 1} of verification code`}
						/>
					))}
				</View>

				<TouchableOpacity
					style={[styles.button, isLoading && styles.buttonDisabled]}
					onPress={() => handleVerify()}
					disabled={isLoading}
					accessibilityLabel="Verify code"
				>
					<Text style={styles.buttonText}>
						{isLoading ? "Verifying..." : "Verify"}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={handleResend}
					disabled={isLoading}
					style={styles.resendButton}
					accessibilityLabel="Resend verification code"
				>
					<Text style={styles.resendText}>Didn't receive the code? Resend</Text>
				</TouchableOpacity>
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
		lineHeight: 24,
	},
	phoneText: {
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
	},
	otpContainer: {
		flexDirection: "row",
		justifyContent: "center",
		gap: spacing.sm,
		marginBottom: spacing.xl,
	},
	otpInput: {
		width: 48,
		height: 56,
		borderRadius: spacing.radius.md,
		borderWidth: 2,
		borderColor: colors.neutral[200],
		backgroundColor: colors.neutral.white,
		textAlign: "center",
		fontSize: typography.fontSize["2xl"],
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
	},
	otpInputFilled: {
		borderColor: colors.primary.main,
		backgroundColor: colors.primary.surface,
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
	resendButton: {
		alignItems: "center",
		paddingVertical: spacing.sm,
	},
	resendText: {
		fontSize: typography.fontSize.base,
		color: colors.primary.main,
		fontWeight: typography.fontWeight.medium,
	},
});
