# Release v0.11.4 - December 2025

## 📋 Summary

December 2025 release with major feature additions for Figma Linux desktop app, including support for new Figma surfaces (Draw, Sites, Make, Buzz, Slides), Grid Auto Layout, AI tooling, Dev Mode enhancements, and Webhooks v2 support.

## 🎯 What's New

### Major Features
- **New Figma Surfaces**: Draw/Whiteboard, Sites (CMS), Make (AI), Buzz (Templates), Slides (Presentations)
- **Grid Auto Layout**: Advanced component layout system
- **AI Tooling**: AI-assisted design features and asset generation
- **Dev Mode Enhancements**: Improved developer handoff workflows
- **Webhooks v2**: Enhanced webhook support with secrets management
- **Code Connect**: Link code components to design files
- **Variables & Collections**: Support for 20+ variable modes per collection

### Technical Improvements
- Electron 35.0.0+ with latest features
- Extended extension system with `.json5`, `.yaml`, `.wasm`, `.ai` support
- 90-day PAT lifecycle management with automatic tracking
- UI3 Chrome modernization (opt-in)
- Enhanced clipboard operations
- GPU acceleration support
- Comprehensive regression testing infrastructure

### Settings & Customization
- **Panel Height**: Customizable vertical panel size
- **UI3 Chrome**: Modernized interface option
- **Product Icons**: Per-surface icons
- **Voice Indicators**: Active call indicators
- **Panel Layout**: Top or bottom panel positioning
- **Theme System**: Expanded 40+ field palette

## 📚 Documentation

### For Users
- See [README.md](../README.md) for complete setup and usage
- [System Requirements](#system-requirements) - Supported OS and hardware
- [Figma Features Supported](#figma-features-supported) - Feature matrix
- [Theme Customization](#theme-customization) - Custom theme creation
- [Application Settings](#application-settings) - All configuration options
- [GPU Acceleration](#gpu-acceleration) - Performance tuning

### For Contributors
- [Migration & QA Guide](#migration--qa-guide) - Testing procedures
- [Building from source](#building-from-source) - Compilation and packaging
- [INTEGRATION_EXTENSIONS_2025.md](../INTEGRATION_EXTENSIONS_2025.md) - Implementation details

## 🔗 Installation Links

### Package Downloads
- **`.deb` (Debian/Ubuntu)**: [Download](https://github.com/Figma-Linux/figma-linux/releases/download/v0.11.4/figma-linux_0.11.4_linux_amd64.deb)
- **`.rpm` (Fedora/openSUSE)**: [Download](https://github.com/Figma-Linux/figma-linux/releases/download/v0.11.4/figma-linux_0.11.4_linux_x86_64.rpm)
- **Pacman (Arch)**: [Download](https://github.com/Figma-Linux/figma-linux/releases/download/v0.11.4/figma-linux_0.11.4_linux_pacman.pkg.tar.zst)
- **AppImage**: [Download](https://github.com/Figma-Linux/figma-linux/releases/download/v0.11.4/figma-linux-0.11.4.glibc2.29-x86_64.AppImage)

### Installation Methods
- **Snap**: `sudo snap install figma-linux`
- **Ubuntu PPA**: `sudo add-apt-repository ppa:chrdevs/figma && sudo apt update && sudo apt install figma-linux`
- **AUR**: `yay -S figma-linux-bin`
- **Nixos**: Add `figma-linux` to `environment.systemPackages`

## 🏗️ Build Instructions

```bash
# Clone and setup
git clone https://github.com/Figma-Linux/figma-linux.git
cd figma-linux
npm install

# Verify code quality
npm run lint      # ESLint validation
npm run check     # TypeScript checking
npm run build     # Production build

# Create distribution packages
npm run pack      # All supported formats
```

## ✅ Testing Checklist

- [ ] Installation on target distributions completes
- [ ] Application launches from menu
- [ ] All new surfaces accessible (Draw, Sites, Make, Buzz, Slides)
- [ ] Clipboard operations work (copy/paste)
- [ ] Protocol handlers work (`figma://` links)
- [ ] Dev Mode deep links functional
- [ ] Variables with multiple modes load
- [ ] Extensions load correctly
- [ ] Theme switching works
- [ ] Settings migration smooth

## 📊 System Requirements

### Operating Systems
- Ubuntu 20.04+, Debian 11+, Fedora 38+, Arch Linux, openSUSE, Nixos

### Hardware
- x86_64 or ARM64v8 processor
- 4 GB RAM minimum (8 GB recommended)
- 1 GB disk space
- OpenGL 2.0+ graphics

### Software
- Linux kernel 5.10+
- Electron 35.0.0+
- libgconf-2-4 (Debian-based)

## 🐛 Known Issues & Workarounds

### GPU-Related Issues
If experiencing crashes:
```bash
figma-linux --disable-gpu
```

### Missing Dependencies
For Debian-based systems:
```bash
sudo apt install libgconf-2-4
```

### AppImage Won't Run
Make executable and try:
```bash
chmod +x figma-linux-*.AppImage
./figma-linux-*.AppImage -i
```

## 🔄 Upgrade Guide

### From Previous Versions
1. Backup your settings: `~/.config/figma-linux/`
2. Install the new version using your distribution's method
3. Settings automatically migrate to v0.11.4 format
4. Optional: Enable UI3 Chrome in Settings → General

### First Launch
- New surfaces appear automatically
- UI3 interface available in Settings (opt-in)
- PAT tracking begins automatically

## 🙏 Contributors & Community

Big thanks to all contributors and the community for feedback and testing!

- **GitHub Issues**: Report bugs at https://github.com/Figma-Linux/figma-linux/issues
- **Telegram**: Join our community at https://t.me/+UuHqsKx-vLJyBq4b
- **Discussions**: https://spectrum.chat/figma-linux

## 📝 Changelog

See [RELEASE_NOTES.md](../RELEASE_NOTES.md) for detailed feature descriptions and technical information.

For implementation details, see [INTEGRATION_EXTENSIONS_2025.md](../INTEGRATION_EXTENSIONS_2025.md).

---

**Release Date**: December 2025  
**Electron Version**: 35.0.0+  
**Node.js**: 16.0+
