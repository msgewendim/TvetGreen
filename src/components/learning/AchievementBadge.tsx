import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
	Award,
	Trophy,
	Star,
	Zap,
	Target,
	BookOpen,
	Clock,
	Flame,
	type LucideIcon,
} from "lucide-react-native";

export type AchievementType =
	| "first_course"
	| "five_courses"
	| "ten_hours"
	| "seven_day_streak"
	| "fast_learner"
	| "dedicated_learner"
	| "course_master"
	| "perfect_score";

export interface Achievement {
	id: string;
	type: AchievementType;
	title: string;
	description: string;
	isUnlocked: boolean;
	unlockedAt?: string;
	icon: LucideIcon;
	color: string;
	bgColor: string;
}

interface AchievementBadgeProps {
	achievement: Achievement;
	size?: "small" | "medium" | "large";
}

export function AchievementBadge({
	achievement,
	size = "medium",
}: AchievementBadgeProps) {
	const sizeConfig = {
		small: {
			container: 60,
			icon: 24,
			fontSize: 10,
		},
		medium: {
			container: 80,
			icon: 32,
			fontSize: 11,
		},
		large: {
			container: 100,
			icon: 40,
			fontSize: 12,
		},
	};

	const config = sizeConfig[size];
	const IconComponent = achievement.icon;

	return (
		<View style={styles.container}>
			<View
				style={[
					styles.badge,
					{
						width: config.container,
						height: config.container,
						backgroundColor: achievement.isUnlocked
							? achievement.bgColor
							: "#E5E5E5",
						opacity: achievement.isUnlocked ? 1 : 0.5,
					},
				]}
			>
				<IconComponent
					size={config.icon}
					color={achievement.isUnlocked ? achievement.color : "#999999"}
					fill={achievement.isUnlocked ? achievement.color : "none"}
				/>
			</View>
			<Text
				style={[
					styles.title,
					{ fontSize: config.fontSize },
					!achievement.isUnlocked && styles.lockedText,
				]}
				numberOfLines={2}
			>
				{achievement.title}
			</Text>
		</View>
	);
}

/**
 * Generate achievements based on user stats
 */
export function generateAchievements(stats: {
	completed: number;
	totalWatchTime: number;
	streak?: number;
}): Achievement[] {
	const watchHours = stats.totalWatchTime / 3600;

	return [
		{
			id: "ach_first_course",
			type: "first_course",
			title: "First Steps",
			description: "Complete your first course",
			isUnlocked: stats.completed >= 1,
			icon: Trophy,
			color: "#DAA520",
			bgColor: "#DAA52020",
		},
		{
			id: "ach_five_courses",
			type: "five_courses",
			title: "Knowledge Seeker",
			description: "Complete 5 courses",
			isUnlocked: stats.completed >= 5,
			icon: Award,
			color: "#32CD32",
			bgColor: "#32CD3220",
		},
		{
			id: "ach_ten_hours",
			type: "ten_hours",
			title: "Dedicated Learner",
			description: "Watch 10+ hours of content",
			isUnlocked: watchHours >= 10,
			icon: Clock,
			color: "#87CEEB",
			bgColor: "#87CEEB20",
		},
		{
			id: "ach_seven_day_streak",
			type: "seven_day_streak",
			title: "On Fire",
			description: "7-day learning streak",
			isUnlocked: (stats.streak || 0) >= 7,
			icon: Flame,
			color: "#FF8C42",
			bgColor: "#FF8C4220",
		},
		{
			id: "ach_fast_learner",
			type: "fast_learner",
			title: "Quick Study",
			description: "Complete 3 courses in a week",
			isUnlocked: false, // Requires additional tracking
			icon: Zap,
			color: "#FFD700",
			bgColor: "#FFD70020",
		},
		{
			id: "ach_course_master",
			type: "course_master",
			title: "Course Master",
			description: "Complete 10 courses",
			isUnlocked: stats.completed >= 10,
			icon: Star,
			color: "#9370DB",
			bgColor: "#9370DB20",
		},
	];
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		marginRight: 16,
		maxWidth: 100,
	},
	badge: {
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 8,
		borderWidth: 3,
		borderColor: "#FDF5E6",
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
	},
	title: {
		fontWeight: "600",
		color: "#2F4F4F",
		textAlign: "center",
		lineHeight: 14,
	},
	lockedText: {
		color: "#999999",
	},
});
