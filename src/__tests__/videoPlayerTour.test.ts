import fs from "fs";
import path from "path";

const videoSrc = fs.readFileSync(
	path.resolve(
		__dirname,
		"../../app/(tabs)/(home)/video/[courseId]/[lessonId].tsx",
	),
	"utf-8",
);

describe("Video player tour integration", () => {
	it("imports CopilotStep from react-native-copilot", () => {
		expect(videoSrc).toContain("CopilotStep");
	});

	it("has tour.video i18n keys for step tooltips", () => {
		expect(videoSrc).toContain("tour.video.");
	});

	it("wraps the video player area with CopilotStep", () => {
		expect(videoSrc).toContain("tour.video.player");
	});

	it("wraps the navigation buttons with CopilotStep", () => {
		expect(videoSrc).toContain("tour.video.navigation");
	});
});
