# Figma-Linux Release Notes

## Version 0.11.4 - December 2025

### 🎉 Major Features

#### New Figma Surfaces
- ✅ **Draw/Whiteboard** - Native drawing tools and whiteboarding support
- ✅ **Sites** - CMS and static site generation directly in Figma
- ✅ **Make** - AI workspaces for design automation and asset generation
- ✅ **Buzz** - Template marketplace and community sharing
- ✅ **Slides** - Presentation mode and deck creation

#### Advanced Features
- ✅ **Grid Auto Layout** - Enhanced component layout system
- ✅ **AI Tooling** - AI-assisted design features and asset bundles
- ✅ **Dev Mode Enhancements** - Improved developer handoff workflows
- ✅ **Webhooks v2** - Enhanced webhook support with secret management
- ✅ **Code Connect** - Link code components to design files
- ✅ **Variables & Collections** - Full support for 20+ variable modes per collection

### 🛠️ Technical Updates

#### Dependency Updates
- **Electron**: Updated to ^35.7.5 (from previous version)
- **Node.js**: Requires 16.0+
- **npm**: Requires 8.0+

#### Extension System Modernization
- Support for `.json5` configuration files
- Support for `.yaml` and `.yml` configuration files
- Support for `.wasm` WebAssembly modules
- Support for `.ai` AI asset bundles
- Full validation of 2025 manifest schema

#### Personal Access Token Management
- Automatic 90-day PAT lifecycle tracking
- Expiry warnings at 14, 7, 3, and 1 day intervals
- Automatic session refresh on PAT expiry
- Preserved clipboard and protocol handler functionality

#### UI3 Migration
- New UI3 Chrome interface (opt-in via Settings)
- Customizable panel height and position
- Product-specific icons per surface
- Voice call indicators
- Automatic migration tracking

### 📋 System Requirements

#### Operating Systems
- **Ubuntu** 20.04+ (Snap, `.deb`, PPA)
- **Debian** 11+ (`.deb`)
- **Fedora** 38+ (`.rpm`)
- **Arch Linux** / Manjaro (AUR, Pacman)
- **openSUSE** (`.rpm`)
- **Nixos** (NixOS package)
- **Linux Mint** (`.deb`)
- **Elementary OS** (`.deb`)

#### Hardware
- **Processor**: x86_64 or ARM64v8
- **RAM**: 4 GB minimum (8 GB recommended)
- **Disk Space**: 1 GB free
- **Graphics**: OpenGL 2.0+

#### Software Dependencies
- **Linux Kernel**: 5.10+
- **Electron**: ≥35.0.0
- **libgconf-2-4** (Debian-based systems)

### 🎨 Theme & Settings Enhancements

#### New Settings
- `panelHeight` - Customize vertical panel height
- `useUi3Chrome` - Enable modernized UI3 interface
- `panelLayout` - Choose top or bottom panel position
- `showProductIcons` - Toggle product icons per surface
- `showVoiceIndicators` - Show/hide active voice participants
- `sidebarCollapsed` - Remember sidebar state

#### Theme System
- Expanded palette with 40+ customizable fields
- Support for product-specific theming
- Better dark mode and light mode support
- Theme migration and versioning

### 🚀 Performance Improvements

#### GPU Acceleration
- Optional GPU acceleration flag: `--enable-gpu`
- Software rendering fallback: `--disable-gpu`
- Improved performance on complex designs
- Better compatibility with various graphics hardware

#### Clipboard Operations
- Enhanced clipboard handling for images, SVG, and PDF
- Faster copy/paste workflows
- Improved external app integration

### 🔧 Build & Deployment

#### Distribution Formats
- **`.deb`** - Debian/Ubuntu packages
- **`.rpm`** - Fedora/openSUSE packages
- **`.pacman`** - Arch Linux packages
- **`.AppImage`** - Portable application
- **`.zip`** - Portable archive
- **Snap** - Snapcraft store

#### Build Commands
```bash
npm run build     # Production build
npm run pack      # Create all distribution packages
npm run check     # TypeScript validation
npm run lint      # Code quality checks
```

### 📚 Documentation

Comprehensive guides included:
- [System Requirements](#system-requirements)
- [Theme Customization](#theme-customization)
- [Application Settings](#application-settings)
- [Migration & QA Guide](#migration--qa-guide)
- [GPU Acceleration](#gpu-acceleration)

See [README.md](./README.md) for detailed setup and usage information.

### 🐛 Bug Fixes & Improvements

#### Security
- Path traversal prevention in extensions
- Manifest validation hardening
- PAT storage security improvements
- Clipboard permission whitelisting

#### Stability
- Improved error handling for new surfaces
- Better fallbacks for missing features
- Enhanced logging for debugging
- Regression testing infrastructure

#### User Experience
- Faster application startup
- Smoother surface transitions
- Better voice call integration
- Improved theme switching

### 📝 Migration Guide

#### Automatic Updates
- Settings are automatically migrated from previous versions
- Themes are preserved and updated
- Window state and tab history maintained
- PAT tracking begins automatically

#### New Features Opt-In
- UI3 Chrome interface: Enable in Settings → General
- Product icons: Toggle in Settings → General
- Voice indicators: Toggle in Settings → General
- Panel height: Adjust in Settings → General

#### Clipboard Preservation
- Clipboard functionality maintained across PAT transitions
- No action required from users
- Automatic fallback if issues occur

### 🔗 Links & Resources

- **GitHub Repository**: https://github.com/Figma-Linux/figma-linux
- **Bug Reports**: https://github.com/Figma-Linux/figma-linux/issues
- **Community Chat**: https://t.me/+UuHqsKx-vLJyBq4b (Telegram)
- **Theme Creator**: See Settings → Themes tab

### ✅ Acceptance Criteria

- ✅ All new Figma surfaces open inside the desktop app wrapper
- ✅ Protocol handlers (`figma://`) work correctly
- ✅ Extensions with new manifest schema load properly
- ✅ PAT/clipboard flows remain functional
- ✅ No crashes when using new feature surfaces
- ✅ Builds complete successfully on all supported distributions
- ✅ Users can access refreshed functionality immediately

### 🙏 Credits

Thanks to all contributors and the community for testing and feedback.

---

For upgrading from previous versions, see [Building from source](#building-from-source) in the README.

For detailed implementation information, see [INTEGRATION_EXTENSIONS_2025.md](./INTEGRATION_EXTENSIONS_2025.md).
