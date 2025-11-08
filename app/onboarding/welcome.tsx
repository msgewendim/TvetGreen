import { useRouter } from "expo-router";
import { ChevronRight, Volume2, VolumeX } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function WelcomeScreen() {
	const router = useRouter();
	const [audioEnabled, setAudioEnabled] = useState(true);
	const [currentSlide, setCurrentSlide] = useState(0);

	const welcomeSlides = [
		{
			title: "Welcome to SkillBridge",
			subtitle: "Learn practical skills for life",
			description:
				"Join thousands of learners across East Africa building better futures through education.",
			image:
				"https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
			emoji: "🌍",
		},
		{
			title: "Learn Anywhere, Anytime",
			subtitle: "Offline-first education",
			description:
				"Download courses and learn without internet. Perfect for rural areas and limited connectivity.",
			image:
				"https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg",
			emoji: "📱",
		},
		{
			title: "Voice-Guided Learning",
			subtitle: "Designed for everyone",
			description:
				"Navigate with your voice in your preferred language. No reading required.",
			image:
				"https://images.pexels.com/photos/3277808/pexels-photo-3277808.jpeg",
			emoji: "🎤",
		},
	];

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % welcomeSlides.length);
		}, 4000);

		return () => clearInterval(timer);
	}, []);

	const currentSlideData = welcomeSlides[currentSlide];

	return (
		<View style={styles.container}>
			<ImageBackground
				source={{ uri: currentSlideData.image }}
				style={styles.backgroundImage}
				imageStyle={styles.backgroundImageStyle}
			>
				<View style={styles.overlay}>
					{/* Audio Toggle */}
					<TouchableOpacity
						style={styles.audioToggle}
						onPress={() => setAudioEnabled(!audioEnabled)}
					>
						{audioEnabled ? (
							<Volume2 size={24} color="#FDF5E6" strokeWidth={2} />
						) : (
							<VolumeX size={24} color="#FDF5E6" strokeWidth={2} />
						)}
					</TouchableOpacity>

					{/* Content */}
					<View style={styles.content}>
						<View style={styles.emojiContainer}>
							<Text style={styles.emoji}>{currentSlideData.emoji}</Text>
						</View>

						<Text style={styles.title}>{currentSlideData.title}</Text>
						<Text style={styles.subtitle}>{currentSlideData.subtitle}</Text>
						<Text style={styles.description}>
							{currentSlideData.description}
						</Text>

						{/* Slide Indicators */}
						<View style={styles.slideIndicators}>
							{welcomeSlides.map((slide, index) => (
								<TouchableOpacity
									key={slide.emoji}
									style={[
										styles.slideIndicator,
										index === currentSlide && styles.slideIndicatorActive,
									]}
									onPress={() => setCurrentSlide(index)}
								/>
							))}
						</View>
					</View>

					{/* Get Started Button */}
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={styles.getStartedButton}
							onPress={() => router.push("/onboarding/language")}
						>
							<Text style={styles.getStartedText}>Get Started</Text>
							<ChevronRight size={24} color="#FDF5E6" strokeWidth={2} />
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.skipButton}
							onPress={() => router.replace("/(tabs)")}
						>
							<Text style={styles.skipText}>Skip for now</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ImageBackground>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	backgroundImage: {
		flex: 1,
		justifyContent: "space-between",
	},
	backgroundImageStyle: {
		opacity: 0.8,
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(46, 139, 87, 0.85)",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingTop: 60,
		paddingBottom: 40,
	},
	audioToggle: {
		alignSelf: "flex-end",
		backgroundColor: "rgba(0, 0, 0, 0.3)",
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	emojiContainer: {
		backgroundColor: "rgba(253, 245, 230, 0.2)",
		width: 100,
		height: 100,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 32,
	},
	emoji: {
		fontSize: 48,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#FDF5E6",
		textAlign: "center",
		marginBottom: 12,
	},
	subtitle: {
		fontSize: 20,
		color: "#FDF5E6",
		textAlign: "center",
		marginBottom: 16,
		opacity: 0.9,
	},
	description: {
		fontSize: 16,
		color: "#FDF5E6",
		textAlign: "center",
		lineHeight: 24,
		marginBottom: 40,
		opacity: 0.9,
	},
	slideIndicators: {
		flexDirection: "row",
		gap: 8,
	},
	slideIndicator: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "rgba(253, 245, 230, 0.4)",
	},
	slideIndicatorActive: {
		backgroundColor: "#FDF5E6",
		width: 24,
	},
	buttonContainer: {
		alignItems: "center",
	},
	getStartedButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FF8C42",
		paddingHorizontal: 32,
		paddingVertical: 16,
		borderRadius: 12,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	getStartedText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#FDF5E6",
		marginRight: 8,
	},
	skipButton: {
		paddingVertical: 12,
	},
	skipText: {
		fontSize: 16,
		color: "#FDF5E6",
		opacity: 0.8,
	},
});
