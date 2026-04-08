import fs from "fs";
import path from "path";

const coursesSrc = fs.readFileSync(
	path.resolve(__dirname, "../../app/(tabs)/courses.tsx"),
	"utf-8",
);

describe("Courses tour integration", () => {
	it("has CopilotStep wrappers with tour.courses i18n keys", () => {
		expect(coursesSrc).toContain("CopilotStep");
		expect(coursesSrc).toContain("tour.courses.");
	});

	it("imports useCopilot and marks tour complete on step end", () => {
		expect(coursesSrc).toContain("useCopilot");
		expect(coursesSrc).toContain("completeTour");
	});
});
