#!/usr/bin/env node

/**
 * Geolazer Build Script
 * Handles compilation and preparation for distribution
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function exec(command, description) {
  try {
    log(`\n▶ ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✓ ${description} completed`, 'green');
  } catch (error) {
    log(`✗ ${description} failed`, 'red');
    throw error;
  }
}

async function build() {
  log('\n╔════════════════════════════════════════╗', 'yellow');
  log('║      GEOLAZER BUILD PROCESS            ║', 'yellow');
  log('╚════════════════════════════════════════╝', 'yellow');

  try {
    // Create dist directory
    ensureDir(path.join(__dirname, 'dist'));
    ensureDir(path.join(__dirname, 'dist', 'main'));
    ensureDir(path.join(__dirname, 'dist', 'backend'));
    ensureDir(path.join(__dirname, 'dist', 'renderer'));

    // Step 1: Build TypeScript Backend
    exec(
      'npx tsc --project src/backend/tsconfig.json',
      'Building backend'
    );

    // Step 2: Build TypeScript Main Process
    exec(
      'npx tsc --project src/main/tsconfig.json',
      'Building Electron main process'
    );

    // Step 3: Build React Frontend
    exec(
      'cd src/renderer && npm run build',
      'Building React frontend'
    );

    // Step 4: Copy frontend build to dist
    const src = path.join(__dirname, 'src', 'renderer', 'build');
    const dest = path.join(__dirname, 'dist', 'renderer');
    
    if (fs.existsSync(src)) {
      exec(
        `xcopy "${src}" "${dest}" /E /I /Y`,
        'Copying frontend build files'
      );
    }

    // Step 5: Copy public assets
    ensureDir(path.join(__dirname, 'dist', 'assets'));
    const publicAssets = path.join(__dirname, 'public', 'assets');
    const distAssets = path.join(__dirname, 'dist', 'assets');
    
    if (fs.existsSync(publicAssets)) {
      exec(
        `xcopy "${publicAssets}" "${distAssets}" /E /I /Y`,
        'Copying public assets'
      );
    }

    // Step 6: Copy package.json for production dependencies
    fs.copyFileSync(
      path.join(__dirname, 'package.json'),
      path.join(__dirname, 'dist', 'package.json')
    );

    log('\n╔════════════════════════════════════════╗', 'green');
    log('║      BUILD SUCCESSFUL!                 ║', 'green');
    log('╚════════════════════════════════════════╝', 'green');

    log('\nNext steps:', 'yellow');
    log('1. For development: npm run dev', 'blue');
    log('2. To package: npm run dist', 'blue');
    log('3. For Windows installer: npm run dist:win', 'blue');
    log('4. For macOS: npm run dist:mac', 'blue');
    log('5. For Linux: npm run dist:linux', 'blue');

  } catch (error) {
    log('\n✗ Build failed!', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

// Run build
build().catch(error => {
  log('\nUnexpected error:', 'red');
  log(error.message, 'red');
  process.exit(1);
});
