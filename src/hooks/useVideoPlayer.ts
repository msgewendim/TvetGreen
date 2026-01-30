import { useCallback, useEffect, useRef, useState } from "react";
import { Audio, type Video, type AVPlaybackStatus } from "expo-av";
import { useLearningStore } from "@/src/store/learningStore";

interface UseVideoPlayerOptions {
	initialPlaying?: boolean;
	initialMuted?: boolean;
	initialSpeed?: number;
	initialShowSubtitles?: boolean;
	initialLanguage?: string;
	lessonId?: string;
	courseId?: string;
}

export function useVideoPlayer(options: UseVideoPlayerOptions = {}) {
	const {
		initialPlaying = false,
		initialMuted = false,
		initialSpeed = 1.0,
		initialShowSubtitles = true,
		initialLanguage = "en",
		lessonId,
		courseId,
	} = options;

	const videoRef = useRef<Video>(null);
	const [isPlaying, setIsPlaying] = useState(initialPlaying);
	const [isMuted, setIsMuted] = useState(initialMuted);
	const [isListening, setIsListening] = useState(false);
	const [showControls, setShowControls] = useState(true);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [playbackSpeed, setPlaybackSpeed] = useState(initialSpeed);
	const [showSubtitles, setShowSubtitles] = useState(initialShowSubtitles);
	const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
	const [showSettings, setShowSettings] = useState(false);
	const [isBuffering, setIsBuffering] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const progressSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const lastSavedPositionRef = useRef(0);

	const updateLessonProgress = useLearningStore(
		(state) => state.updateLessonProgress,
	);

	// Configure audio for background/silent mode
	useEffect(() => {
		Audio.setAudioModeAsync({
			playsInSilentModeIOS: true,
			staysActiveInBackground: false,
			shouldDuckAndroid: true,
		});
	}, []);

	// Auto-hide controls after 3s when playing
	useEffect(() => {
		if (controlsTimerRef.current) {
			clearTimeout(controlsTimerRef.current);
		}

		if (isPlaying && showControls) {
			controlsTimerRef.current = setTimeout(() => {
				setShowControls(false);
			}, 3000);
		}

		return () => {
			if (controlsTimerRef.current) {
				clearTimeout(controlsTimerRef.current);
			}
		};
	}, [isPlaying, showControls]);

	// Auto-save progress every 10 seconds
	useEffect(() => {
		if (isPlaying && lessonId && courseId && duration > 0) {
			progressSaveRef.current = setInterval(() => {
				const pos = lastSavedPositionRef.current;
				if (pos > 0) {
					updateLessonProgress(
						lessonId,
						courseId,
						pos,
						duration,
						pos,
					);
				}
			}, 10000);
		}

		return () => {
			if (progressSaveRef.current) {
				clearInterval(progressSaveRef.current);
			}
		};
	}, [isPlaying, lessonId, courseId, duration, updateLessonProgress]);

	// Save progress on unmount
	useEffect(() => {
		return () => {
			if (lessonId && courseId && lastSavedPositionRef.current > 0 && duration > 0) {
				updateLessonProgress(
					lessonId,
					courseId,
					lastSavedPositionRef.current,
					duration,
					lastSavedPositionRef.current,
				);
			}
		};
	}, [lessonId, courseId, duration, updateLessonProgress]);

	const onPlaybackStatusUpdate = useCallback(
		(status: AVPlaybackStatus) => {
			if (!status.isLoaded) {
				setIsBuffering(false);
				setIsLoaded(false);
				return;
			}

			setIsLoaded(true);
			setIsPlaying(status.isPlaying);
			setIsBuffering(status.isBuffering);
			setCurrentTime(status.positionMillis / 1000);
			lastSavedPositionRef.current = status.positionMillis / 1000;

			if (status.durationMillis) {
				setDuration(status.durationMillis / 1000);
			}

			// Auto-complete at 90%
			if (
				status.durationMillis &&
				status.positionMillis / status.durationMillis >= 0.9 &&
				lessonId &&
				courseId
			) {
				updateLessonProgress(
					lessonId,
					courseId,
					status.positionMillis / 1000,
					status.durationMillis / 1000,
					status.positionMillis / 1000,
				);
			}

			// Handle playback finished
			if (status.didJustFinish && lessonId && courseId) {
				updateLessonProgress(
					lessonId,
					courseId,
					(status.durationMillis ?? 0) / 1000,
					(status.durationMillis ?? 0) / 1000,
					(status.durationMillis ?? 0) / 1000,
				);
			}
		},
		[lessonId, courseId, updateLessonProgress],
	);

	const togglePlayPause = useCallback(async () => {
		if (!videoRef.current) return;
		const status = await videoRef.current.getStatusAsync();
		if (!status.isLoaded) return;

		if (status.isPlaying) {
			await videoRef.current.pauseAsync();
		} else {
			await videoRef.current.playAsync();
		}
		setShowControls(true);
	}, []);

	const toggleVoiceGuide = useCallback(async () => {
		setIsListening((prev) => {
			if (!prev && videoRef.current) {
				videoRef.current.pauseAsync();
			}
			return !prev;
		});
	}, []);

	const handleSeek = useCallback(
		async (seconds: number) => {
			if (!videoRef.current) return;
			const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
			await videoRef.current.setPositionAsync(newTime * 1000);
			setShowControls(true);
		},
		[currentTime, duration],
	);

	const handleSeekToPosition = useCallback(
		async (positionSeconds: number) => {
			if (!videoRef.current) return;
			const clamped = Math.max(0, Math.min(duration, positionSeconds));
			await videoRef.current.setPositionAsync(clamped * 1000);
		},
		[duration],
	);

	const handleSpeedChange = useCallback(async (speed: number) => {
		if (videoRef.current) {
			await videoRef.current.setRateAsync(speed, true);
		}
		setPlaybackSpeed(speed);
		setShowSettings(false);
	}, []);

	const handleLanguageChange = useCallback((language: string) => {
		setSelectedLanguage(language);
		setShowSettings(false);
	}, []);

	const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

	const handleSetIsMuted = useCallback((muted: boolean) => {
		setIsMuted(muted);
		videoRef.current?.setIsMutedAsync(muted);
	}, []);

	return {
		videoRef,
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
		isBuffering,
		isLoaded,
		onPlaybackStatusUpdate,
		setIsPlaying,
		setCurrentTime,
		setDuration,
		togglePlayPause,
		toggleVoiceGuide,
		setIsMuted: handleSetIsMuted,
		setShowControls,
		handleSeek,
		handleSeekToPosition,
		handleSpeedChange,
		handleLanguageChange,
		setShowSubtitles,
		setShowSettings,
	};
}
