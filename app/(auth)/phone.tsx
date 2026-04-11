import { useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	View,
} from "react-native";
import { useRouter } from "expo-router";
import { ROUTES } from "@/src/utils/appRoutes";
import { Phone } from "lucide-react-native";
import PhoneInput, {
	isValidPhoneNumber,
	type ICountry,
} from "react-native-international-phone-number";
import { Button, Surface, Text } from "react-native-paper";
import { ScreenLayout, colors, spacing, typography } from "@/design-system";
import { useAuthStore } from "@/src/store/authStore";
import { useLanguage } from "@/src/hooks/useLanguage";

export default function PhoneScreen() {
	const [phone, setPhone] = useState("");
	const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
	const router = useRouter();
	const requestOtp = useAuthStore((s) => s.requestOtp);
	const isLoading = useAuthStore((s) => s.isLoading);
	const { t } = useLanguage();

	const isValid = selectedCountry
		? isValidPhoneNumber(phone, selectedCountry)
		: false;

	const handleSubmit = async () => {
		if (!selectedCountry || !isValid) {
			Alert.alert(t("auth.phone.invalidTitle"), t("auth.phone.invalidMessage"));
			return;
		}

		const fullNumber = `${selectedCountry.callingCode} ${phone}`
			.replace(/\s+/g, " ")
			.trim();

		const success = await requestOtp(fullNumber);
		if (success) {
			router.push({
				pathname: ROUTES.AUTH_VERIFY as never,
				params: { phone: fullNumber },
			});
		} else {
			Alert.alert(t("common.error"), t("auth.phone.sendFailed"));
		}
	};

	return (
		<ScreenLayout
			scrollable={false}
			backgroundColor={colors.background.primary}
		>
			<KeyboardAvoidingView
				style={styles.keyboardView}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<View style={styles.content}>
					<Surface style={styles.iconContainer} elevation={0}>
						<Phone size={48} color={colors.primary.main} strokeWidth={1.5} />
					</Surface>

					<Text variant="displaySmall" style={styles.title}>
						{t("auth.phone.title")}
					</Text>
					<Text variant="bodyLarge" style={styles.subtitle}>
						{t("auth.phone.subtitle")}
					</Text>

					<View style={styles.phoneInputWrapper}>
						<PhoneInput
							value={phone}
							onChangePhoneNumber={setPhone}
							selectedCountry={selectedCountry}
							onChangeSelectedCountry={setSelectedCountry}
							defaultCountry="ET"
							language="en"
							placeholder={t("auth.phone.placeholder")}
							popularCountries={["ET", "UG", "KE", "TZ"]}
							modalSearchInputPlaceholderTextColor={colors.text.tertiary}
							modalSearchInputSelectionColor={colors.primary.main}
							phoneInputStyles={{
								container: styles.phoneContainer,
								flagContainer: styles.flagContainer,
								flag: styles.flag,
								caret: styles.caret,
								divider: styles.divider,
								callingCode: styles.callingCode,
								input: styles.phoneInput,
							}}
							modalStyles={{
								modal: styles.modal,
								searchInput: styles.modalSearchInput,
								countryButton: styles.modalCountryButton,
								countryName: styles.modalCountryName,
							}}
							theme="light"
							accessibilityLabelPhoneInput={t("auth.phone.inputLabel")}
							accessibilityLabelCountriesButton={t("auth.phone.countryLabel")}
						/>
					</View>

					<Button
						mode="contained"
						onPress={handleSubmit}
						disabled={!isValid}
						loading={isLoading}
						buttonColor={colors.primary.main}
						textColor={colors.text.inverse}
						contentStyle={styles.submitContent}
						accessibilityLabel={t("auth.phone.sendCode")}
					>
						{t("auth.phone.sendCode")}
					</Button>

					<Text variant="bodySmall" style={styles.disclaimer}>
						{t("auth.phone.disclaimer")}
					</Text>
				</View>
			</KeyboardAvoidingView>
		</ScreenLayout>
	);
}

const styles = StyleSheet.create({
	keyboardView: {
		flex: 1,
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
	phoneInputWrapper: {
		marginBottom: spacing.lg,
	},
	phoneContainer: {
		backgroundColor: colors.neutral.white,
		borderRadius: spacing.radius.md,
		borderWidth: 2,
		borderColor: colors.border.light,
		height: 56,
	},
	flagContainer: {
		backgroundColor: colors.primary.surface,
		borderTopLeftRadius: spacing.radius.md,
		borderBottomLeftRadius: spacing.radius.md,
		paddingHorizontal: spacing.sm,
	},
	flag: {
		fontSize: 22,
	},
	caret: {
		color: colors.primary.main,
		fontSize: 10,
	},
	divider: {
		backgroundColor: colors.border.light,
		width: 1,
	},
	callingCode: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
	},
	phoneInput: {
		fontSize: typography.fontSize.lg,
		color: colors.text.primary,
	},
	modal: {
		backgroundColor: colors.neutral.white,
		borderRadius: spacing.radius.lg,
		paddingVertical: spacing.md,
	},
	modalSearchInput: {
		borderRadius: spacing.radius.md,
		borderWidth: 1,
		borderColor: colors.border.light,
		color: colors.text.primary,
		backgroundColor: colors.neutral[50],
		paddingHorizontal: spacing.md,
		fontSize: typography.fontSize.base,
	},
	modalCountryButton: {
		borderBottomWidth: 1,
		borderBottomColor: colors.border.light,
		paddingVertical: spacing.sm,
	},
	modalCountryName: {
		fontSize: typography.fontSize.base,
		color: colors.text.primary,
	},
	submitContent: {
		height: 56,
	},
	disclaimer: {
		color: colors.text.tertiary,
		textAlign: "center",
		marginTop: spacing.lg,
	},
});
