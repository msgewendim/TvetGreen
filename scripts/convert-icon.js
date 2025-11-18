const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const htmlPath = path.join(__dirname, "../assets/logos/icon.html");
const outputDir = path.join(__dirname, "../assets/logos");

// Read the HTML file
const htmlContent = fs.readFileSync(htmlPath, "utf-8");

// Extract SVG from HTML - find the SVG element
const svgStartIndex = htmlContent.indexOf("<svg");
if (svgStartIndex === -1) {
	console.error("Could not find SVG in HTML file");
	process.exit(1);
}

// Find the matching closing tag
let depth = 0;
let svgEndIndex = svgStartIndex;

for (let i = svgStartIndex; i < htmlContent.length; i++) {
	if (htmlContent[i] === "<") {
		if (htmlContent.substring(i, i + 2) === "</") {
			depth--;
			if (depth === 0 && htmlContent.substring(i, i + 6) === "</svg>") {
				svgEndIndex = i + 6;
				break;
			}
		} else if (htmlContent[i + 1] !== "!" && htmlContent[i + 1] !== "?") {
			// Check if it's a self-closing tag
			const tagEnd = htmlContent.indexOf(">", i);
			const tagContent = htmlContent.substring(i, tagEnd);
			if (!tagContent.endsWith("/")) {
				depth++;
			}
		}
	}
}

const svgContent = htmlContent.substring(svgStartIndex, svgEndIndex);

// Extract viewBox and dimensions from the SVG
const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
const widthMatch = svgContent.match(/width="([^"]+)"/);
const heightMatch = svgContent.match(/height="([^"]+)"/);

const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 312.5 308.60782283369844";
const width = widthMatch ? widthMatch[1] : "312.5";
const height = heightMatch ? heightMatch[1] : "308.60782283369844";

// Create a standalone SVG file with proper XML declaration and background
const standaloneSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">
<rect width="100%" height="100%" fill="#ffc93c"/>
${svgContent.replace(/<svg[^>]*>/, "")}
</svg>`;

// Save SVG file
const svgPath = path.join(outputDir, "icon.svg");
fs.writeFileSync(svgPath, standaloneSvg);
console.log(`✓ Saved SVG: ${svgPath}`);

// Convert to PNG and JPEG using Puppeteer
async function convertToRaster() {
	const browser = await puppeteer.launch({
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});

	try {
		const page = await browser.newPage();

		// Set viewport size
		await page.setViewport({
			width: 1024,
			height: 1024,
			deviceScaleFactor: 2,
		});

		// Create HTML wrapper for the SVG
		const htmlWrapper = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: transparent;
    }
    svg {
      max-width: 100%;
      max-height: 100%;
    }
  </style>
</head>
<body>
  ${standaloneSvg}
</body>
</html>`;

		await page.setContent(htmlWrapper, { waitUntil: "networkidle0" });

		// Wait for SVG to render
		await page.waitForSelector("svg", { visible: true });
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Get SVG element dimensions
		const svgElement = await page.$("svg");
		const boundingBox = await svgElement.boundingBox();

		// Take screenshot as PNG
		const pngPath = path.join(outputDir, "icon.png");
		await page.screenshot({
			path: pngPath,
			type: "png",
			clip: boundingBox,
			omitBackground: true,
		});
		console.log(`✓ Saved PNG: ${pngPath}`);

		// Take screenshot as JPEG
		const jpegPath = path.join(outputDir, "icon.jpeg");
		await page.screenshot({
			path: jpegPath,
			type: "jpeg",
			clip: boundingBox,
			quality: 95,
			omitBackground: false,
		});
		console.log(`✓ Saved JPEG: ${jpegPath}`);
	} catch (error) {
		console.error("Error converting to raster formats:", error);
		process.exit(1);
	} finally {
		await browser.close();
	}
}

// Run conversion
convertToRaster().catch(console.error);
