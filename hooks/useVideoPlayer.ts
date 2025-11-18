import { useEffect, useState } from "react";

interface UseVideoPlayerOptions {
	initialPlaying?: boolean;
	initialMuted?: boolean;
	initialSpeed?: number;
	initialShowSubtitles?: boolean;
	initialLanguage?: string;
}

export function useVideoPlayer(options: UseVideoPlayerOptions = {}) {
	const {
		initialPlaying = false,
		initialMuted = false,
		initialSpeed = 1.0,
		initialShowSubtitles = true,
		initialLanguage = "english",
	} = options;

	const [isPlaying, setIsPlaying] = useState(initialPlaying);
	const [isMuted, setIsMuted] = useState(initialMuted);
	const [isListening, setIsListening] = useState(false);
	const [showControls, setShowControls] = useState(true);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(300); // 5 minutes example
	const [playbackSpeed, setPlaybackSpeed] = useState(initialSpeed);
	const [showSubtitles, setShowSubtitles] = useState(initialShowSubtitles);
	const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
	const [showSettings, setShowSettings] = useState(false);

	useEffect(() => {
		// Hide controls after 3 seconds of inactivity
		const timer = setTimeout(() => {
			if (isPlaying) {
				setShowControls(false);
			}
		}, 3000);

		return () => clearTimeout(timer);
	}, [isPlaying]);

	const togglePlayPause = () => {
		setIsPlaying(!isPlaying);
		setShowControls(true);
	};

	const toggleVoiceGuide = () => {
		setIsListening(!isListening);
		if (!isListening) {
			// Pause video when voice guide is active
			setIsPlaying(false);
		}
	};

	const handleSeek = (seconds: number) => {
		const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
		setCurrentTime(newTime);
		setShowControls(true);
	};

	const handleSpeedChange = (speed: number) => {
		setPlaybackSpeed(speed);
		setShowSettings(false);
	};

	const handleLanguageChange = (language: string) => {
		setSelectedLanguage(language);
		setShowSettings(false);
	};

	const progressPercentage = (currentTime / duration) * 100;

	return {
		// State
		isPlaying,
		isMuted,
		isListening,
		showControls,
		currentTime,
		duration,
		playbackSpeed,
		showSubtitles,
		selectedLanguage,
		showSettings,
		progressPercentage,
		// Actions
		setIsPlaying,
		setCurrentTime,
		setDuration,
		togglePlayPause,
		toggleVoiceGuide,
		setIsMuted: (muted: boolean) => setIsMuted(muted),
		setShowControls,
		handleSeek,
		handleSpeedChange,
		handleLanguageChange,
		setShowSubtitles,
		setShowSettings,
	};
}
