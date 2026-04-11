const AUTO_COMPLETE_THRESHOLD = 0.9;

/**
 * Returns true if the user has watched enough of the lesson
 * to auto-mark it as complete (90% threshold).
 */
export function shouldAutoComplete(
	position: number,
	duration: number,
): boolean {
	if (duration <= 0 || position <= 0) return false;
	return position / duration >= AUTO_COMPLETE_THRESHOLD;
}
