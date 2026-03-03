#!/usr/bin/env node

/**
 * Setup Icons Script
 * Creates placeholder icon files for Geolazer installer
 * 
 * Usage: npm run setup-icons
 * Or: node scripts/setup-icons.js
 */

const fs = require('fs');
const path = require('path');

const ICON_DIR = path.join(__dirname, '..', 'public', 'assets');
const ICON_PATH = path.join(ICON_DIR, 'icon.png');

// Simple 1x1 transparent PNG (minimal placeholder)
// This is a valid minimal PNG file
const minimalPNG = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
  0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
  0x89, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x44, 0x41,
  0x54, 0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x00,
  0x01, 0x01, 0x01, 0x00, 0x1B, 0xB6, 0xEE, 0x56,
  0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,
  0xAE, 0x42, 0x60, 0x82
]);

// Create SVG placeholder (scalable, professional-looking)
const placeholderSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="256" height="256" fill="url(#bgGradient)"/>
  
  <!-- Globe/Geo icon -->
  <circle cx="128" cy="128" r="60" fill="none" stroke="#60a5fa" stroke-width="3"/>
  <circle cx="128" cy="128" r="50" fill="none" stroke="#3b82f6" stroke-width="2"/>
  
  <!-- Latitude lines -->
  <ellipse cx="128" cy="128" rx="50" ry="15" fill="none" stroke="#60a5fa" stroke-width="1" opacity="0.6"/>
  <ellipse cx="128" cy="128" rx="50" ry="30" fill="none" stroke="#60a5fa" stroke-width="1" opacity="0.6"/>
  
  <!-- Longitude lines -->
  <line x1="128" y1="78" x2="128" y2="178" stroke="#60a5fa" stroke-width="1" opacity="0.6"/>
  <line x1="98" y1="115" x2="158" y2="141" stroke="#60a5fa" stroke-width="1" opacity="0.6"/>
  <line x1="158" y1="115" x2="98" y2="141" stroke="#60a5fa" stroke-width="1" opacity="0.6"/>
  
  <!-- Central point (pulse effect indicator) -->
  <circle cx="128" cy="128" r="5" fill="#60a5fa"/>
  <circle cx="128" cy="128" r="8" fill="none" stroke="#60a5fa" stroke-width="1" opacity="0.4"/>
  
  <!-- Text -->
  <text x="128" y="210" font-family="Arial, sans-serif" font-size="20" font-weight="bold" 
        text-anchor="middle" fill="#60a5fa">GEOLAZER</text>
  
  <!-- Tagline -->
  <text x="128" y="230" font-family="Arial, sans-serif" font-size="10" 
        text-anchor="middle" fill="#3b82f6" opacity="0.8">GEOPOLITICAL ANALYSIS</text>
</svg>`;

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║          GEOLAZER - ICON SETUP                        ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Check if icon already exists
if (fs.existsSync(ICON_PATH)) {
  console.log('✓ Icon already exists at:', ICON_PATH);
  console.log('\nTo replace it, manually replace the file or delete it and run this script again.\n');
  process.exit(0);
}

// Create directory if it doesn't exist
if (!fs.existsSync(ICON_DIR)) {
  console.log('Creating assets directory...');
  fs.mkdirSync(ICON_DIR, { recursive: true });
}

// Write minimal PNG
fs.writeFileSync(ICON_PATH, minimalPNG);
console.log('✓ Created placeholder icon: public/assets/icon.png\n');

// Write SVG version for reference
const svgPath = path.join(ICON_DIR, 'icon.svg');
fs.writeFileSync(svgPath, placeholderSVG);
console.log('✓ Created SVG version: public/assets/icon.svg\n');

console.log('📝 IMPORTANT NEXT STEPS:\n');
console.log('1. Replace the placeholder icon with your own:');
console.log('   - Use a 256×256 pixel PNG image');
console.log('   - Make background transparent (PNG with alpha)');
console.log('   - Place at: public/assets/icon.png\n');

console.log('2. Tools to create/convert icons:');
console.log('   - Favicon Generator: https://www.favicon-generator.org/');
console.log('   - IcoConvert: https://icoconvert.com/');
console.log('   - Online PNG Editor: https://www.photopea.com/\n');

console.log('3. Once you have your icon, proceed with:');
console.log('   npm run build');
console.log('   npm run dist:win\n');

console.log('✓ Setup complete! You can now build your installer.\n');
