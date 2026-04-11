import { detectVideoSource } from "@/src/utils/videoSource";

describe("detectVideoSource", () => {
	it("classifies a short string as YouTube ID", () => {
		const result = detectVideoSource("dQw4w9WgXcQ", null);
		expect(result).toEqual({ source: "dQw4w9WgXcQ", type: "youtube" });
	});

	it("classifies an https URL as url type", () => {
		const url = "https://example.com/videos/lesson1.mp4";
		const result = detectVideoSource(url, null);
		expect(result).toEqual({ source: url, type: "url" });
	});

	it("classifies a YouTube full URL as youtube type", () => {
		const url = "https://youtube.com/watch?v=dQw4w9WgXcQ";
		const result = detectVideoSource(url, null);
		expect(result).toEqual({ source: url, type: "youtube" });
	});

	it("prioritizes local file over YouTube ID", () => {
		const localUri = "/data/downloads/lesson1.mp4";
		const result = detectVideoSource("dQw4w9WgXcQ", localUri);
		expect(result).toEqual({ source: localUri, type: "local" });
	});

	it("prioritizes local file over URL", () => {
		const localUri = "/data/downloads/lesson1.mp4";
		const result = detectVideoSource("https://example.com/video.mp4", localUri);
		expect(result).toEqual({ source: localUri, type: "local" });
	});
});
