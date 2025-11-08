#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const distDir = path.join(__dirname, '..', 'dist')
const htmlPath = path.join(distDir, 'index.html')
const manifestPath = path.join(distDir, 'manifest.json')

// Copy files from public directory to dist (Expo should do this, but ensure it happens)
const publicDir = path.join(__dirname, '..', 'public')
const filesToCopy = ['manifest.json', 'logo192.png', 'logo512.png']

filesToCopy.forEach(file => {
  const source = path.join(publicDir, file)
  const dest = path.join(distDir, file)
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest)
    console.log(`✓ Copied ${file} to dist`)
  } else {
    console.warn(`⚠ Warning: ${file} not found in public directory`)
  }
})

// The HTML template in public/index.html should already have the manifest link
// This script just ensures files are copied. Expo handles HTML generation from the template.
console.log('✓ Files copied. Expo will use public/index.html template for HTML generation.')

console.log('✓ PWA manifest setup complete!')

