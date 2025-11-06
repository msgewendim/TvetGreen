/**
 * VoiceInput Component
 *
 * Text input with integrated voice capability
 * Placeholder implementation for future speech recognition integration
 */

import * as Speech from "expo-speech";
import { Mic, MicOff } from "lucide-react-native";
import type React from "react";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import type { VoiceInputProps } from "../../../types/design-system";
import { colors, spacing } from "../../tokens";
import { Input } from "./Input";

export const VoiceInput: React.FC<VoiceInputProps> = ({
	value,
	onChangeText,
	onVoiceStart,
	onVoiceEnd,
	onVoiceResult,
	isListening: externalIsListening,
	placeholder = "Type or speak...",
	...props
}) => {
	const [internalIsListening, setInternalIsListening] = useState(false);
	const isListening =
		externalIsListening !== undefined
			? externalIsListening
			: internalIsListening;

	const handleVoicePress = async () => {
		if (isListening) {
			// Stop listening
			setInternalIsListening(false);
			onVoiceEnd?.();

			// TODO: Implement actual speech recognition
			// For now, provide feedback via text-to-speech
			Speech.speak("Voice input stopped", {
				language: "en",
				pitch: 1.0,
				rate: 1.0,
			});
		} else {
			// Start listening
			setInternalIsListening(true);
			onVoiceStart?.();

			// TODO: Implement actual speech recognition
			// Placeholder: Simulate voice recognition after 2 seconds
			Speech.speak("Listening for voice input", {
				language: "en",
				pitch: 1.0,
				rate: 1.0,
			});

			// Simulated voice recognition (replace with actual implementation)
			setTimeout(() => {
				const mockResult = "Sample voice input text";
				onVoiceResult?.(mockResult);
				onChangeText(mockResult);
				setInternalIsListening(false);
				onVoiceEnd?.();
			}, 2000);
		}
	};

	const renderVoiceButton = () => (
		<TouchableOpacity
			onPress={handleVoicePress}
			accessibilityLabel={
				isListening ? "Stop voice input" : "Start voice input"
			}
			accessibilityRole="button"
			style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
		>
			{isListening ? (
				<MicOff size={20} color={colors.text.inverse} strokeWidth={2} />
			) : (
				<Mic size={20} color={colors.secondary.main} strokeWidth={2} />
			)}
		</TouchableOpacity>
	);

	return (
		<View>
			<Input
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				rightIcon={renderVoiceButton()}
				{...props}
			/>
			{isListening && (
				<View style={styles.listeningIndicator}>
					{/* Pulsing animation could be added here */}
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	voiceButton: {
		padding: spacing.xs,
		borderRadius: spacing.radius.full,
	},
	voiceButtonActive: {
		backgroundColor: colors.feedback.error,
		padding: spacing.sm,
	},
	listeningIndicator: {
		position: "absolute",
		bottom: -spacing.sm,
		left: 0,
		right: 0,
		height: 2,
		backgroundColor: colors.secondary.main,
	},
});
