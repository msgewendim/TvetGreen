#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const sourceIcon = path.join(__dirname, '..', 'assets', 'logos', 'icon.png')
const sourceSvg = path.join(__dirname, '..', 'assets', 'logos', 'icon.svg')
const publicDir = path.join(__dirname, '..', 'public')

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// Check if ImageMagick or sharp is available
function checkImageTools() {
  try {
    execSync('which convert', { stdio: 'ignore' })
    return 'imagemagick'
  } catch {
    try {
      require.resolve('sharp')
      return 'sharp'
    } catch {
      return null
    }
  }
}

// Generate icons using ImageMagick
function generateWithImageMagick(source, sizes) {
  sizes.forEach(({ size, output }) => {
    const outputPath = path.join(publicDir, output)
    try {
      execSync(`convert "${source}" -resize ${size}x${size} -background none -gravity center -extent ${size}x${size} "${outputPath}"`, {
        stdio: 'inherit'
      })
      console.log(`✓ Generated ${output} (${size}x${size})`)
    } catch (error) {
      console.error(`✗ Failed to generate ${output}:`, error.message)
      process.exit(1)
    }
  })
}

// Generate icons using Sharp
async function generateWithSharp(source, sizes) {
  const sharp = require('sharp')
  
  await Promise.all(
    sizes.map(async ({ size, output }) => {
      const outputPath = path.join(publicDir, output)
      try {
        await sharp(source)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 255, g: 201, b: 60, alpha: 1 } // #ffc93c from SVG
          })
          .toFile(outputPath)
        console.log(`✓ Generated ${output} (${size}x${size})`)
      } catch (error) {
        console.error(`✗ Failed to generate ${output}:`, error.message)
        process.exit(1)
      }
    })
  )
}

// Generate icons using Canvas (fallback)
async function generateWithCanvas(source, sizes) {
  const { createCanvas, loadImage } = require('canvas')
  
  await Promise.all(
    sizes.map(async ({ size, output }) => {
      try {
        const image = await loadImage(source)
        const canvas = createCanvas(size, size)
        const ctx = canvas.getContext('2d')
        
        // Fill background
        ctx.fillStyle = '#ffc93c'
        ctx.fillRect(0, 0, size, size)
        
        // Calculate scaling to fit image
        const scale = Math.min(size / image.width, size / image.height)
        const x = (size - image.width * scale) / 2
        const y = (size - image.height * scale) / 2
        
        ctx.drawImage(image, x, y, image.width * scale, image.height * scale)
        
        const outputPath = path.join(publicDir, output)
        const buffer = canvas.toBuffer('image/png')
        fs.writeFileSync(outputPath, buffer)
        console.log(`✓ Generated ${output} (${size}x${size})`)
      } catch (error) {
        console.error(`✗ Failed to generate ${output}:`, error.message)
        process.exit(1)
      }
    })
  )
}

// Fallback: Copy source file if it exists (user will need to resize manually)
function fallbackCopy(source, sizes) {
  console.warn('⚠ No image processing tool found. Copying source file...')
  console.warn('⚠ Icons may not be the correct size. Please resize manually or install an image tool.')
  
  sizes.forEach(({ size, output }) => {
    const outputPath = path.join(publicDir, output)
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, outputPath)
      console.log(`✓ Copied ${output} (may need manual resizing to ${size}x${size})`)
    }
  })
}

// Main function
async function generatePWAIcons() {
  // Determine which source file to use
  let sourceFile = null
  if (fs.existsSync(sourceIcon)) {
    sourceFile = sourceIcon
    console.log('Using PNG source:', sourceIcon)
  } else if (fs.existsSync(sourceSvg)) {
    sourceFile = sourceSvg
    console.log('Using SVG source:', sourceSvg)
  } else {
    console.error('✗ No icon source found. Expected:', sourceIcon, 'or', sourceSvg)
    process.exit(1)
  }

  const sizes = [
    { size: 192, output: 'logo192.png' },
    { size: 512, output: 'logo512.png' }
  ]

  const tool = checkImageTools()
  
  if (tool === 'imagemagick') {
    console.log('Using ImageMagick for icon generation...')
    generateWithImageMagick(sourceFile, sizes)
  } else if (tool === 'sharp') {
    console.log('Using Sharp for icon generation...')
    await generateWithSharp(sourceFile, sizes)
  } else {
    // Try to use canvas as fallback
    try {
      require.resolve('canvas')
      console.log('Using Canvas for icon generation...')
      await generateWithCanvas(sourceFile, sizes)
    } catch {
      // Final fallback: just copy the file
      fallbackCopy(sourceFile, sizes)
      console.warn('\n⚠ To generate properly sized icons, install one of:')
      console.warn('  - Sharp: pnpm add -D sharp')
      console.warn('  - ImageMagick: sudo apt-get install imagemagick (Linux) or brew install imagemagick (Mac)')
      console.warn('  - Canvas: pnpm add -D canvas')
    }
  }
}

// Run if called directly
if (require.main === module) {
  generatePWAIcons().catch((error) => {
    console.error('Error generating PWA icons:', error)
    process.exit(1)
  })
}

module.exports = { generatePWAIcons }

