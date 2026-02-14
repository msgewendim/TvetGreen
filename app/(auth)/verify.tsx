import { useCallback, useEffect, useRef, useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, ShieldCheck } from "lucide-react-native";
import { Button, ScreenLayout, colors, spacing, typography } from "@/design-system";
import { useAuthStore } from "@/src/store/authStore";

const OTP_LENGTH = 6;
const RESEND_INTERVAL = 60;

function maskPhone(phone: string): string {
	if (!phone || phone.length < 4) return phone;
	const last3 = phone.slice(-3);
	const prefix = phone.slice(0, phone.indexOf(" ") + 1 || phone.length - 6);
	return `${prefix}${"•".repeat(4)}${last3}`;
}

export default function VerifyScreen() {
	const { phone } = useLocalSearchParams<{ phone: string }>();
	const router = useRouter();
	const verifyOtp = useAuthStore((s) => s.verifyOtp);
	const requestOtp = useAuthStore((s) => s.requestOtp);
	const isLoading = useAuthStore((s) => s.isLoading);

	const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
	const [resendTimer, setResendTimer] = useState(RESEND_INTERVAL);
	const inputRefs = useRef<(TextInput | null)[]>([]);

	useEffect(() => {
		if (resendTimer <= 0) return;
		const interval = setInterval(() => {
			setResendTimer((prev) => prev - 1);
		}, 1000);
		return () => clearInterval(interval);
	}, [resendTimer]);

	const handleChange = (text: string, index: number) => {
		const newOtp = [...otp];
		newOtp[index] = text;
		setOtp(newOtp);

		if (text && index < OTP_LENGTH - 1) {
			inputRefs.current[index + 1]?.focus();
		}

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

	const handleVerify = useCallback(
		async (code?: string) => {
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
		},
		[otp, phone, verifyOtp, router],
	);

	const handleResend = async () => {
		if (resendTimer > 0 || !phone) return;
		const success = await requestOtp(phone);
		if (success) {
			setResendTimer(RESEND_INTERVAL);
			Alert.alert("Code Sent", "A new verification code has been sent.");
		}
	};

	const canResend = resendTimer <= 0;

	return (
		<ScreenLayout
			scrollable={false}
			backgroundColor={colors.background.primary}
		>
			<KeyboardAvoidingView
				style={styles.keyboardView}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<Pressable
					style={styles.backButton}
					onPress={() => router.back()}
					accessibilityLabel="Go back to phone number"
					accessibilityRole="button"
				>
					<ArrowLeft size={24} color={colors.text.primary} />
				</Pressable>

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
						<Text style={styles.phoneText}>{maskPhone(phone || "")}</Text>
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

					<Button
						variant="primary"
						size="large"
						fullWidth
						onPress={() => handleVerify()}
						disabled={otp.join("").length !== OTP_LENGTH}
						loading={isLoading}
						accessibilityLabel="Verify code"
					>
						Verify
					</Button>

					<View style={styles.resendContainer}>
						{canResend ? (
							<Button
								variant="outline"
								size="small"
								onPress={handleResend}
								disabled={isLoading}
								accessibilityLabel="Resend verification code"
							>
								Resend Code
							</Button>
						) : (
							<Text style={styles.resendTimerText}>
								Resend in {resendTimer}s
							</Text>
						)}
					</View>
				</View>
			</KeyboardAvoidingView>
		</ScreenLayout>
	);
}

const styles = StyleSheet.create({
	keyboardView: {
		flex: 1,
	},
	backButton: {
		position: "absolute",
		top: spacing.lg,
		left: spacing.md,
		width: spacing.minTouchTarget,
		height: spacing.minTouchTarget,
		borderRadius: spacing.radius.full,
		backgroundColor: colors.neutral.white,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 1,
		...spacing.shadow.sm,
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
		...spacing.shadow.sm,
	},
	otpInputFilled: {
		borderColor: colors.primary.main,
		backgroundColor: colors.primary.surface,
	},
	resendContainer: {
		alignItems: "center",
		marginTop: spacing.lg,
	},
	resendTimerText: {
		fontSize: typography.fontSize.base,
		color: colors.text.tertiary,
		fontWeight: typography.fontWeight.medium,
	},
});
