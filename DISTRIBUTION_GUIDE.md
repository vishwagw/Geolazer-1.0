# Geolazer Distribution Guide

## 📦 Building & Packaging for Distribution

This guide explains how to build and distribute Geolazer as a desktop application that users can install on their computers.

---

## 🔧 Prerequisites

Before building, ensure you have:

```bash
# Node.js and npm
node --version    # Should be 18+
npm --version     # Should be 8+

# Install dependencies
npm install --legacy-peer-deps

# Create .env file with API keys
cp .env.example .env
# Edit .env with your API keys
```

---

## 🏗️ Build Process

### Step 1: Build the Application

```bash
# Compile all TypeScript and React
npm run build
```

This command will:
- Compile backend TypeScript
- Compile Electron main process TypeScript
- Build React frontend
- Copy all assets to dist/

**Output**: Everything ready in `./dist/` folder

### Step 2: Create Installer/Package

```bash
# Create installers (auto-detects your OS)
npm run dist

# OR specify the target:

# Windows installer
npm run dist:win

# macOS installer
npm run dist:mac

# Linux package
npm run dist:linux

# All platforms at once
npm run dist:all
```

**Output**: Installers in `./release/` folder

---

## 🖥️ Build Outputs

### Windows
```
release/
├── Geolazer Setup 0.1.0.exe    (NSIS installer)
├── Geolazer-0.1.0-portable.exe (Portable version)
└── Geolazer-0.1.0.exe.blockmap
```

**Installation**: Users double-click the .exe to install
**Portable**: No installation, just run the .exe

### macOS
```
release/
├── Geolazer-0.1.0.dmg          (Disk image)
├── Geolazer-0.1.0.zip
└── Geolazer-0.1.0.mac.zip
```

**Installation**: Drag app to Applications folder

### Linux
```
release/
├── Geolazer-0.1.0.AppImage     (Single executable)
└── geolazer_0.1.0_amd64.deb    (Debian package)
```

**Installation**: 
- AppImage: `chmod +x` and double-click
- .deb: `sudo dpkg -i` or use package manager

---

## 🚀 Distribution Methods

### Method 1: Direct Download (Simplest)

1. **Build**: `npm run dist`
2. **Host**: Upload installers to:
   - GitHub Releases
   - Your website
   - Cloud storage (OneDrive, Google Drive, AWS S3)
3. **Share**: Users download and install

**Pros**: Simple, no server needed  
**Cons**: Manual updates

### Method 2: Auto-Update Setup

1. **Build**: `npm run dist`
2. **Setup Server**: Host releases on:
   - GitHub Releases (free)
   - AWS S3
   - Your own server
3. **Configure**: Add auto-update in main process
4. **Users get**: Automatic updates

**Pros**: Automatic updates  
**Cons**: More complex setup

### Method 3: Package Managers

**Windows**: Microsoft Store, Chocolatey  
**macOS**: App Store, Homebrew  
**Linux**: Package repositories (.deb, .rpm, etc.)

---

## 📋 Complete Build & Distribution Workflow

### 1. Prepare Release

```bash
# Update version in package.json
# Update version in src/main/main.ts if needed
# Create release notes
```

### 2. Build for All Platforms

```bash
# Install Windows build dependencies (on Windows)
npm install --save-dev wix

# Build all
npm run build
npm run dist:all
```

### 3. Test Installers

```bash
# Windows
.\release\Geolazer Setup 0.1.0.exe

# macOS
open ./release/Geolazer-0.1.0.dmg

# Linux
chmod +x ./release/Geolazer-0.1.0.AppImage
./release/Geolazer-0.1.0.AppImage
```

### 4. Upload to Distribution Platform

```bash
# Example: upload to GitHub
# 1. Create a release on GitHub
# 2. Upload all .exe, .dmg, .AppImage files
# 3. Update release notes
```

### 5. Announce Release

- Update website
- Send email to users
- Post on social media
- Update documentation

---

## 🔐 Signing & Security

### Windows Code Signing

Recommended for distributing to many users:

```bash
# Install certificate
# Set environment variable: WIN_CSC_LINK
# Set environment variable: WIN_CSC_KEY_PASSWORD
npm run dist:win
```

### macOS Code Signing

Required for App Store distribution:

```bash
# Setup Apple Developer account
# Create certificates
# Set environment variables
npm run dist:mac
```

---

## 📊 Build Configuration

Edit `package.json` build section to customize:

```json
"build": {
  "appId": "com.geolazer.app",
  "productName": "Geolazer",
  "files": ["dist/**/*", "public/**/*"],
  "win": {
    "target": ["nsis", "portable"],
    "icon": "public/assets/icon.png"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true
  }
}
```

---

## 💾 File Size Optimization

### Reduce installer size:

1. **Remove unused dependencies**
   ```bash
   npm prune --production
   ```

2. **Use smaller alternatives**
   - Consider lighter charting library
   - Lazy load components

3. **Compress assets**
   - Optimize images in public/assets/
   - Minify CSS/JS (React Scripts does this)

**Current estimated sizes:**
- Windows installer: ~200-300 MB
- macOS DMG: ~250-350 MB
- Linux AppImage: ~200-300 MB

---

## 🛠️ Troubleshooting Build Issues

### Build Command Not Found

```bash
# Make sure npm packages are installed
npm install --legacy-peer-deps

# If still issues, try:
npm cache clean --force
npm install --legacy-peer-deps
```

### Icon Not Found

```bash
# Create placeholder icon
# Or download from: https://www.icoconvert.com/

# Ensure file exists:
# public/assets/icon.png (for Windows/Linux)
# public/assets/icon.icns (for macOS)
```

### Port Already in Use

```bash
# If building in development:
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### NSIS Error on Windows

```bash
# Install NSIS separately if needed
# Download from: https://nsis.sourceforge.io/

# Or skip NSIS and build portable only:
# Edit package.json to remove "nsis" from target
```

---

## 🚀 Quick Commands Reference

```bash
# Development
npm run dev              # Run in development

# Building
npm run build            # Compile all code
npm run build:backend    # Backend only
npm run build:frontend   # Frontend only
npm run build:electron   # Electron main only

# Packaging
npm run pack             # Create app directory (test)
npm run dist             # Create default installer
npm run dist:win         # Windows installer
npm run dist:mac         # macOS installer
npm run dist:linux       # Linux package

# Testing
npm start                # Launch built app locally
npm test                 # Run tests
```

---

## 📦 Installing from Built Package

Users who receive your installer can:

### Windows
1. Download `Geolazer Setup 0.1.0.exe`
2. Double-click to run installer
3. Choose installation location
4. Installer creates Start Menu shortcuts
5. Launch from Start Menu or desktop shortcut

### macOS
1. Download `Geolazer-0.1.0.dmg`
2. Open file (or double-click)
3. Drag Geolazer to Applications
4. Launch from Applications folder

### Linux
1. Download `Geolazer-0.1.0.AppImage`
2. Make executable: `chmod +x Geolazer-0.1.0.AppImage`
3. Double-click to run
4. Or install .deb: `sudo dpkg -i geolazer_0.1.0_amd64.deb`

---

## 📈 Version Management

Update version before each release:

```bash
# In package.json
"version": "0.1.0"

# In src/renderer/package.json
"version": "0.1.0"
```

Semantic versioning: MAJOR.MINOR.PATCH
- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes

---

## 🔄 Auto-Update Setup

To enable automatic updates:

1. **Create update server**
   - GitHub Releases (easiest)
   - AWS S3
   - Custom server

2. **Add auto-update to main.ts**
   ```typescript
   import { autoUpdater } from 'electron-updater';
   
   if (isDev) {
     autoUpdater.checkForUpdatesAndNotify();
   }
   ```

3. **Configure update channel**
   - Latest releases
   - Beta releases
   - Staged rollout

---

## 📝 Creating Release Notes

Include in release:

```markdown
## Geolazer v0.1.0

### Features
- Interactive global heat map
- Real-time alerts
- Market data integration

### Improvements
- Better error handling
- UI improvements

### Bug Fixes
- Fixed WebSocket connection issues
- Resolved map rendering problems

### Installation
Download and run the installer for your OS from the releases page.

### System Requirements
- Windows 7+ (64-bit) / macOS 10.13+ / Linux with glibc
- 4GB RAM minimum
- 500MB disk space
```

---

## 🎯 Distribution Checklist

- [ ] Update version in package.json
- [ ] Test build on Windows
- [ ] Test build on macOS (if available)
- [ ] Test build on Linux (if available)
- [ ] Verify all features work in built app
- [ ] Create release notes
- [ ] Build final installers
- [ ] Sign binaries (optional but recommended)
- [ ] Upload to distribution platform
- [ ] Test installation from distribution
- [ ] Announce release
- [ ] Monitor for user issues

---

## 🏆 Success!

Once you've completed these steps, you have a professional, distributable desktop application that users can install and run independently.

**Next steps:**
1. Build: `npm run build`
2. Package: `npm run dist`
3. Test: `npm start` (runs the built version)
4. Upload to distribution platform
5. Share with users!

---

**Document Version**: 1.0  
**Last Updated**: March 1, 2026  
**Geolazer Version**: 0.1.0
