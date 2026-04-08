/**
 * ProfileHeader Component
 *
 * Displays user profile information with avatar and edit button
 */

import { CreditCard as Edit3, Star } from "lucide-react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, spacing, typography } from "@/design-system";

export interface UserProfile {
	name: string;
	location: string;
	joinDate: string;
	skillLevel: string;
	profileImage: string;
}

interface ProfileHeaderProps {
	profile: UserProfile;
	onEditPress?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
	profile,
	onEditPress,
}) => {
	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				<Image source={{ uri: profile.profileImage }} style={styles.image} />
				<TouchableOpacity
					style={styles.editButton}
					onPress={onEditPress}
					accessibilityLabel="Edit profile"
				>
					<Edit3 size={16} color={colors.text.inverse} strokeWidth={2} />
				</TouchableOpacity>
			</View>

			<View style={styles.info}>
				<Text style={styles.name}>{profile.name}</Text>
				<Text style={styles.location}>{profile.location}</Text>
				<Text style={styles.joinDate}>Learning since {profile.joinDate}</Text>

				<View style={styles.skillBadge}>
					<Star
						size={16}
						color={colors.categories.construction}
						strokeWidth={2}
					/>
					<Text style={styles.skillText}>{profile.skillLevel} Learner</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.neutral.white,
		marginHorizontal: spacing.lg,
		marginTop: spacing.lg,
		marginBottom: spacing.md,
		padding: spacing.lg,
		borderRadius: spacing.radius.md,
		...spacing.shadow.md,
		alignItems: "center",
	},
	imageContainer: {
		position: "relative",
		marginBottom: spacing.md,
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: spacing.radius.full,
		borderWidth: 4,
		borderColor: colors.primary.main,
	},
	editButton: {
		position: "absolute",
		bottom: 0,
		right: 0,
		backgroundColor: colors.accent.main,
		width: 32,
		height: 32,
		borderRadius: spacing.radius.full,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 3,
		borderColor: colors.neutral.white,
	},
	info: {
		alignItems: "center",
	},
	name: {
		fontSize: typography.fontSize.xl,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.xs / 2,
	},
	location: {
		fontSize: typography.fontSize.base,
		color: colors.text.secondary,
		marginBottom: spacing.xs / 2,
	},
	joinDate: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
		marginBottom: spacing.sm,
	},
	skillBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.accent.surface,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: spacing.radius.lg,
		borderWidth: 1,
		borderColor: colors.categories.construction,
	},
	skillText: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		marginLeft: spacing.xs,
	},
});
