import { useCallback, useEffect, useRef, useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Linking,
	Platform,
	StyleSheet,
	TextInput as RNTextInput,
	View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ShieldCheck } from "lucide-react-native";
import {
	Button,
	IconButton,
	Surface,
	Text,
	TouchableRipple,
} from "react-native-paper";
import { ScreenLayout, colors, spacing, typography } from "@/design-system";
import { useAuthStore } from "@/src/store/authStore";
import { useLanguage } from "@/src/hooks/useLanguage";

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
	const { t } = useLanguage();

	const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
	const [resendTimer, setResendTimer] = useState(RESEND_INTERVAL);
	const [resendAttempts, setResendAttempts] = useState(0);
	const inputRefs = useRef<(RNTextInput | null)[]>([]);

	const MAX_RESEND_ATTEMPTS = 2;
	const showWhatsappFallback = resendAttempts >= MAX_RESEND_ATTEMPTS;
	const whatsappSupportUrl = "https://wa.me/251911000000";

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
				Alert.alert(
					t("auth.verify.invalidTitle"),
					t("auth.verify.invalidMessage"),
				);
				return;
			}

			const success = await verifyOtp(phone || "", otpCode);
			if (success) {
				router.replace("/onboarding/welcome" as never);
			} else {
				Alert.alert(
					t("auth.verify.failedTitle"),
					t("auth.verify.failedMessage"),
				);
				setOtp(Array(OTP_LENGTH).fill(""));
				inputRefs.current[0]?.focus();
			}
		},
		[otp, phone, verifyOtp, router],
	);

	const handleResend = async () => {
		if (resendTimer > 0 || !phone) return;
		setResendAttempts((prev) => prev + 1);
		const success = await requestOtp(phone);
		if (success) {
			setResendTimer(RESEND_INTERVAL);
			Alert.alert(
				t("auth.verify.codeSentTitle"),
				t("auth.verify.codeSentMessage"),
			);
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
				<IconButton
					icon="arrow-left"
					size={24}
					onPress={() => router.back()}
					style={styles.backButton}
					accessibilityLabel={t("common.back")}
				/>

				<View style={styles.content}>
					<Surface style={styles.iconContainer} elevation={0}>
						<ShieldCheck
							size={48}
							color={colors.primary.main}
							strokeWidth={1.5}
						/>
					</Surface>

					<Text variant="displaySmall" style={styles.title}>
						{t("auth.verify.title")}
					</Text>
					<Text variant="bodyLarge" style={styles.subtitle}>
						{t("auth.verify.subtitle")}
						{"\n"}
						<Text variant="bodyLarge" style={styles.phoneText}>
							{maskPhone(phone || "")}
						</Text>
					</Text>

					<View style={styles.otpContainer}>
						{otp.map((digit, index) => (
							<RNTextInput
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
						mode="contained"
						onPress={() => handleVerify()}
						disabled={otp.join("").length !== OTP_LENGTH}
						loading={isLoading}
						buttonColor={colors.primary.main}
						textColor={colors.text.inverse}
						contentStyle={styles.verifyContent}
						accessibilityLabel={t("auth.verify.verifyButton")}
					>
						{t("auth.verify.verifyButton")}
					</Button>

					<View style={styles.resendContainer}>
						{canResend ? (
							<Button
								mode="outlined"
								onPress={handleResend}
								disabled={isLoading}
								accessibilityLabel={t("auth.verify.resendCode")}
							>
								{t("auth.verify.resendCode")}
							</Button>
						) : (
							<Text variant="bodyMedium" style={styles.resendTimerText}>
								{t("auth.verify.resendIn", { seconds: resendTimer })}
							</Text>
						)}
					</View>

					{showWhatsappFallback && (
						<TouchableRipple
							onPress={() => Linking.openURL(whatsappSupportUrl)}
							accessibilityLabel={t("auth.verify.whatsappHelp")}
							accessibilityRole="link"
							borderless
							style={styles.whatsappRipple}
						>
							<Surface style={styles.whatsappFallback} elevation={1}>
								<Text variant="bodySmall" style={styles.whatsappText}>
									{t("auth.verify.smsNotArriving")}
								</Text>
								<Text variant="labelLarge" style={styles.whatsappLink}>
									{t("auth.verify.whatsappHelp")}
								</Text>
							</Surface>
						</TouchableRipple>
					)}
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
		zIndex: 1,
		backgroundColor: colors.neutral.white,
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
		textAlign: "center",
		marginBottom: spacing.sm,
	},
	subtitle: {
		color: colors.text.secondary,
		textAlign: "center",
		marginBottom: spacing["2xl"],
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
	verifyContent: {
		height: 56,
	},
	resendContainer: {
		alignItems: "center",
		marginTop: spacing.lg,
	},
	resendTimerText: {
		color: colors.text.tertiary,
	},
	whatsappRipple: {
		borderRadius: spacing.radius.md,
		marginTop: spacing.xl,
	},
	whatsappFallback: {
		alignItems: "center",
		padding: spacing.md,
		borderRadius: spacing.radius.md,
	},
	whatsappText: {
		color: colors.text.secondary,
		marginBottom: spacing.xs,
	},
	whatsappLink: {
		color: colors.feedback.success,
	},
});
