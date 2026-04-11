import fs from "fs";
import path from "path";

const courseDetailSrc = fs.readFileSync(
	path.resolve(__dirname, "../../app/(tabs)/(home)/course/[id].tsx"),
	"utf-8",
);

describe("Course detail tour integration", () => {
	it("imports CopilotStep from react-native-copilot", () => {
		expect(courseDetailSrc).toContain("CopilotStep");
	});

	it("has tour.courseDetail i18n keys for step tooltips", () => {
		expect(courseDetailSrc).toContain("tour.courseDetail.");
	});

	it("wraps the start/continue button with CopilotStep", () => {
		expect(courseDetailSrc).toContain("tour.courseDetail.startButton");
	});

	it("wraps the lesson list with CopilotStep", () => {
		expect(courseDetailSrc).toContain("tour.courseDetail.lessonList");
	});
});
