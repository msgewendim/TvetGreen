import type React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { useLanguage } from "../../hooks/useLanguage";
import type { SupportedLanguage } from "../../../i18n.config";

interface LanguageOptionProps {
	languageCode: SupportedLanguage;
	name: string;
	nativeName: string;
	flag: string;
	isActive: boolean;
	onSelect: (language: SupportedLanguage) => void;
}

/**
 * Individual language option component
 */
const LanguageOption: React.FC<LanguageOptionProps> = ({
	languageCode,
	name,
	nativeName,
	flag,
	isActive,
	onSelect,
}) => {
	return (
		<TouchableOpacity
			style={[styles.option, isActive && styles.optionActive]}
			onPress={() => onSelect(languageCode)}
			accessibilityLabel={`Select ${name}`}
			accessibilityRole="button"
			accessibilityState={{ selected: isActive }}
		>
			<View style={styles.optionLeft}>
				<Text style={styles.flag}>{flag}</Text>
				<View style={styles.languageInfo}>
					<Text style={styles.nativeName}>{nativeName}</Text>
					<Text style={styles.name}>{name}</Text>
				</View>
			</View>
			{isActive && <Check size={24} color="#2E8B57" strokeWidth={2.5} />}
		</TouchableOpacity>
	);
};

/**
 * Language selector component
 * Displays all supported languages and allows users to switch between them
 */
export const LanguageSelector: React.FC = () => {
	const {
		supportedLanguages,
		currentLanguage,
		changeLanguage,
		isLanguageActive,
	} = useLanguage();

	const handleLanguageChange = async (language: SupportedLanguage) => {
		if (!isLanguageActive(language)) {
			await changeLanguage(language);
		}
	};

	return (
		<View style={styles.container}>
			{supportedLanguages.map((lang) => (
				<LanguageOption
					key={lang.code}
					languageCode={lang.code}
					name={lang.name}
					nativeName={lang.nativeName}
					flag={lang.flag}
					isActive={isLanguageActive(lang.code)}
					onSelect={handleLanguageChange}
				/>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: 12,
	},
	option: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#FFFFFF",
		padding: 16,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "transparent",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	optionActive: {
		borderColor: "#2E8B57",
		backgroundColor: "#F0F8F4",
	},
	optionLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
	flag: {
		fontSize: 32,
	},
	languageInfo: {
		gap: 2,
	},
	nativeName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#2F4F4F",
	},
	name: {
		fontSize: 14,
		color: "#8B4513",
	},
});
