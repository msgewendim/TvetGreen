import { shouldAutoComplete } from "@/src/utils/progressUtils";

describe("shouldAutoComplete", () => {
	it("returns true when position is 90% of duration", () => {
		expect(shouldAutoComplete(540, 600)).toBe(true);
	});

	it("returns true when position exceeds 90% of duration", () => {
		expect(shouldAutoComplete(580, 600)).toBe(true);
	});

	it("returns false when position is below 90%", () => {
		expect(shouldAutoComplete(500, 600)).toBe(false);
	});

	it("returns false when duration is 0", () => {
		expect(shouldAutoComplete(100, 0)).toBe(false);
	});

	it("returns false when position is 0", () => {
		expect(shouldAutoComplete(0, 600)).toBe(false);
	});
});
