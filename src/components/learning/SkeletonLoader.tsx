import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, ViewStyle } from "react-native";

interface SkeletonLoaderProps {
	width?: number | string;
	height?: number;
	borderRadius?: number;
	style?: ViewStyle;
}

export function SkeletonLoader({
	width = "100%",
	height = 20,
	borderRadius = 4,
	style,
}: SkeletonLoaderProps) {
	const animatedValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const animation = Animated.loop(
			Animated.sequence([
				Animated.timing(animatedValue, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(animatedValue, {
					toValue: 0,
					duration: 1000,
					useNativeDriver: true,
				}),
			])
		);
		animation.start();

		return () => animation.stop();
	}, []);

	const opacity = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: [0.3, 0.7],
	});

	return (
		<Animated.View
			style={[
				styles.skeleton,
				{
					width,
					height,
					borderRadius,
					opacity,
				},
				style,
			]}
		/>
	);
}

export function CourseCardSkeleton() {
	return (
		<View style={styles.courseCardSkeleton}>
			<SkeletonLoader width={100} height={120} borderRadius={8} />
			<View style={styles.courseInfoSkeleton}>
				<SkeletonLoader width="60%" height={12} />
				<SkeletonLoader width="80%" height={16} style={{ marginTop: 8 }} />
				<SkeletonLoader width="40%" height={12} style={{ marginTop: 8 }} />
				<View style={styles.progressSkeleton}>
					<SkeletonLoader width="100%" height={6} style={{ marginTop: 12 }} />
				</View>
			</View>
		</View>
	);
}

export function CategoryCardSkeleton() {
	return (
		<View style={styles.categoryCardSkeleton}>
			<SkeletonLoader width={64} height={64} borderRadius={32} />
			<SkeletonLoader width="80%" height={16} style={{ marginTop: 12 }} />
			<SkeletonLoader width="60%" height={12} style={{ marginTop: 6 }} />
		</View>
	);
}

export function LessonListSkeleton() {
	return (
		<View style={styles.lessonSkeleton}>
			<SkeletonLoader width={20} height={20} borderRadius={10} />
			<View style={{ flex: 1 }}>
				<SkeletonLoader width="70%" height={14} />
				<SkeletonLoader width="30%" height={12} style={{ marginTop: 6 }} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	skeleton: {
		backgroundColor: "#E5E5E5",
	},
	courseCardSkeleton: {
		flexDirection: "row",
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		marginBottom: 16,
		padding: 12,
		gap: 12,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	courseInfoSkeleton: {
		flex: 1,
	},
	progressSkeleton: {
		flex: 1,
	},
	categoryCardSkeleton: {
		width: "47%",
		margin: "1.5%",
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 20,
		alignItems: "center",
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	lessonSkeleton: {
		flexDirection: "row",
		gap: 12,
		backgroundColor: "#FFFFFF",
		padding: 12,
		borderRadius: 8,
		marginBottom: 8,
		alignItems: "center",
	},
});
