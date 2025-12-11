# <img src="https://raw.githubusercontent.com/ChugunovRoman/figma-linux/master/resources/icons/128x128.png" width="32"> Figma electron app (unofficial)

**Version**: 0.11.4 | **Electron**: ≥35.0.0 | **Last Updated**: December 2025

Figma-linux is an unofficial [Electron](http://electron.atom.io)-based  [Figma](https://figma.com) desktop app for Linux.

<p>
    <img src="https://raw.githubusercontent.com/ChugunovRoman/figma-linux/master/images/screenshot1.jpg">
</p>

<p>
    <img src="https://img.shields.io/github/downloads/ChugunovRoman/figma-linux/total.svg" />
    <a href="https://github.com/ChugunovRoman/figma-linux/releases/latest">
        <img src="https://img.shields.io/github/release/ChugunovRoman/figma-linux.svg?label=latest%20release">
    </a>
    <img src="https://img.shields.io/github/last-commit/ChugunovRoman/figma-linux.svg">
    <a href="https://github.com/ChugunovRoman/figma-linux/issues">
        <img src="https://img.shields.io/github/issues/ChugunovRoman/figma-linux.svg">
    </a>
    <a href="https://github.com/ChugunovRoman/figma-linux/issues?q=is%3Aissue+is%3Aclosed">
        <img src="https://img.shields.io/github/issues-closed/ChugunovRoman/figma-linux.svg">
    </a>
    <img src="https://img.shields.io/github/languages/code-size/ChugunovRoman/figma-linux.svg">
    <img src="https://img.shields.io/github/repo-size/ChugunovRoman/figma-linux.svg">
    <a href="https://github.com/ChugunovRoman/figma-linux/stargazers">
        <img src="https://img.shields.io/github/stars/ChugunovRoman/figma-linux.svg?style=social&label=Stars">
    </a>
</p>

<!-- [![Codacy Badge](https://api.codacy.com/project/badge/Grade/d80ff1e7c3fe4da28e2e50a28d4ead7c)](https://www.codacy.com/manual/ChugunovRoman/figma-linux?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ChugunovRoman/figma-linux&amp;utm_campaign=Badge_Grade) -->
[![Snap](https://snapcraft.io/figma-linux/badge.svg)](https://snapcraft.io/figma-linux)

## Quick Links

- [System Requirements](#system-requirements) - OS, hardware, dependencies
- [Installation](#installation) - Setup for all distributions
- [Figma Features](#figma-features-supported-december-2025) - Complete feature matrix
- [Building from Source](#building-from-source) - Development and packaging
- [Theme Customization](#theme-customization) - Custom theme creation
- [Application Settings](#application-settings) - Configuration options
- [Migration & QA](#migration--qa-guide) - Upgrade and testing guide
- [Release Notes](./RELEASE_NOTES.md) - Detailed release information
- [Integration Details](./INTEGRATION_EXTENSIONS_2025.md) - Technical implementation

## System Requirements

### Supported Linux Distributions (December 2025)

| Distribution | Status | Package Format |
|---|---|---|
| **Ubuntu** 20.04+ | ✅ Fully Supported | `.deb`, Snap, PPA |
| **Debian** 11+ | ✅ Fully Supported | `.deb` |
| **Fedora** 38+ | ✅ Fully Supported | `.rpm` |
| **Arch / Manjaro** | ✅ Fully Supported | AUR, Pacman |
| **openSUSE** | ✅ Fully Supported | `.rpm` |
| **Nixos** | ✅ Supported | NixOS package |
| **Linux Mint** | ✅ Fully Supported | `.deb` |
| **Elementary OS** | ✅ Fully Supported | `.deb` |

### Minimum Requirements

- **OS**: Linux kernel 5.10+
- **Architecture**: x86_64 (AMD64) or ARM64v8
- **RAM**: 4 GB minimum (8 GB recommended)
- **Disk**: 1 GB free space
- **Electron**: 35.0.0 or later
- **Graphics**: OpenGL 2.0+

### GPU Acceleration (Optional)

For optimal performance, especially with complex designs:

```bash
# Enable GPU acceleration (recommended for complex files)
figma-linux --enable-gpu

# Force software rendering (if you experience GPU-related issues)
figma-linux --disable-gpu

# Enable experimental features (advanced users only)
figma-linux --enable-features=VizDisplayCompositor
```

## Installation
### Universal
You can install Figma-linux from Snap [here.](https://snapcraft.io/figma-linux)

Alternatively, type
```bash
sudo snap install figma-linux
```
in your terminal.

To use local fonts when using the snapd version create a symbolic link:

```
sudo ln -s $HOME/.local/share/fonts $HOME/snap/figma-linux/current/.local/share/
```

There is also an AppImage available.
Get it on our [Releases](https://github.com/Figma-Linux/figma-linux/releases) page, then make it executable and install using these terminal commands:
```bash
chmod +x figma-linux-*.AppImage
sudo ./figma-linux-*.AppImage -i
```
This is not a portable AppImage - it will install figma-linux on your system, after which you can run it from terminal or from your app list.
For more info, execute
```bash
./figma-linux-*.AppImage -h
```

### Debian-based Distros
Firstly, install `libgconf-2-4`:
```bash
sudo apt install libgconf-2-4
```
Download the .deb package from the [Releases](https://github.com/Figma-Linux/figma-linux/releases) page, and install it with `dpkg` or your favorite .deb installer.
```bash
sudo dpkg -i figma-linux_*_amd64.deb
```

### Ubuntu

On Ubuntu, you can use our PPA:
```bash
sudo add-apt-repository ppa:chrdevs/figma && sudo apt update && sudo apt install figma-linux -y
```

If you receive a `NO_PUBKEY` error while running `apt update`, then you must add the key manualy:
```bash
sudo apt-key adv --recv-key --keyserver keyserver.ubuntu.com 70F3445E637983CC
```

#### Alternative Ubuntu install

Download the .deb package from the [Releases](https://github.com/Figma-Linux/figma-linux/releases) page, and install it with `apt`.
```bash
sudo apt install figma-linux_*_amd64.deb
```

### Arch-based distros

Figma-linux is available on the [AUR](https://aur.archlinux.org/packages/figma-linux/).
You can use an AUR helper like `yay` to install it:
```bash
yay -S figma-linux-bin
```
Other AUR packages:
 - [figma-linux](https://aur.archlinux.org/packages/figma-linux) - the package install binary version from release tag
 - [figma-linux-bin](https://aur.archlinux.org/packages/figma-linux-bin) - the package install binary version from release tag
 - [figma-linux-git](https://aur.archlinux.org/packages/figma-linux-git) - the package build the app from Github from latest release tag
 - [figma-linux-dev-git](https://aur.archlinux.org/packages/figma-linux-dev-git) - the package build the app from Github from latest commit on the dev branch
### RPM-based distros
Download the .rpm package from our [Releases](https://github.com/Figma-Linux/figma-linux/releases/latest) page, then install it:

```bash
sudo dnf install figma-linux-*.x86_64.rpm
```

### Nixos
On Nixos, you may add `figma-linux` in the `environment.systemPackages` list of your `/etc/nixos/configuration.nix` and run:
```bash
sudo nixos-rebuild switch
```

## Figma Features Supported (December 2025)

This application fully supports the following Figma products and features:

### Core Products
- ✅ **Design** - Main Figma editor with all design tools
- ✅ **FigJam** - Whiteboarding and collaboration
- ✅ **Draw** - Native drawing tools and whiteboard
- ✅ **Sites** - Figma CMS and static site generation
- ✅ **Make** - AI workspaces and automation
- ✅ **Buzz** - Template marketplace and community
- ✅ **Slides** - Presentation mode and deck creation

### Advanced Features
- ✅ **Grid Auto Layout** - Advanced component layout system
- ✅ **AI Tooling** - AI-assisted design features and asset generation
- ✅ **Dev Mode Enhancements** - Improved handoff and developer workflows
- ✅ **Webhooks v2** - Enhanced webhook support with secrets management
- ✅ **Code Connect** - Link code components to design files
- ✅ **Variables & Collections** - Design tokens with up to 20 modes per collection
- ✅ **Prototyping** - Interactive prototypes and flows

### Platform Integration
- ✅ **Protocol Handlers** - Direct `figma://` URL support
- ✅ **Deep Links** - Direct links to Dev Mode, Variables, and specific features
- ✅ **Clipboard Operations** - Full clipboard support (image, SVG, PDF)
- ✅ **File Associations** - `.fig` file support

## Building from source

### Prerequisites
- Node.js 16.0+
- npm 8.0+
- Linux development headers
- For AppImage packing: [appimagetool](https://appimage.github.io/appimagetool/)

### Build Steps

1. Clone the repository:
```bash
git clone https://github.com/Figma-Linux/figma-linux
cd figma-linux
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
npm run dev
```

4. Build the application for production:
```bash
npm run build
```

5. Create distribution packages:
```bash
npm run pack
```

This creates packages in the following formats:
- **`.deb`** - Debian/Ubuntu package
- **`.rpm`** - Fedora/openSUSE package  
- **`.pacman`** - Arch Linux package
- **`.AppImage`** - Portable AppImage
- **`.zip`** - Portable archive

### Available Build Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Run app in development mode with hot reload |
| `npm run build` | Build app for production |
| `npm run start` | Run previously built app |
| `npm run builder` | Package as distribution files |
| `npm run pack` | Clean build and create all distribution packages |
| `npm run check` | TypeScript and Svelte type checking |
| `npm run lint` | Run ESLint validation |
| `npm run lp` | Run linting and formatting |

### Configuration

Edit `./config/builder.json` to customize build targets:
```json
{
  "linux": {
    "target": [
      { "target": "deb" },
      { "target": "rpm" },
      { "target": "appimage" },
      { "target": "pacman" }
    ]
  }
}
```

Example of **.env** for local development:
```
NODE_ENV=dev
DEV_PANEL_PORT=3330
DEV_SETTINGS_PORT=3331
```



## Theme Customization

Figma-linux supports custom themes with an extensible palette system. Themes can be created and shared with the community.

### Theme Palette Fields

A theme's palette supports the following customizable fields:

#### Text Colors
- `text` - Primary text color
- `text-active` - Active/selected text color
- `text-disabled` - Disabled text color

#### Panel & Background Colors
- `bg-panel` - Panel and page background color
- `bg-toolbar` - Toolbar background color
- `bg-toolbar-hover` - Toolbar item hover state
- `bg-toolbar-active` - Toolbar item active/selected state
- `bg-tab` - Tab background
- `bg-tab-hover` - Tab hover state
- `bg-tab-active` - Tab active state
- `bg-header` - Header background
- `bg-header-control` - Header control background
- `bg-header-control-hover` - Header control hover state
- `bg-header-control-active` - Header control active state
- `bg-overlay` - Dropdown menu background
- `bg-overlay-outline` - Overlay shadow color
- `bg-overlay-inner-outline` - Overlay border color
- `bg-window-close` - Window close button background
- `bg-beta-label` - Beta label background

#### Foreground & Icon Colors
- `fg-toolbar` - Toolbar icon color
- `fg-toolbar-hover` - Toolbar icon hover color
- `fg-toolbar-active` - Toolbar icon active color
- `fg-toolbar-disabled` - Toolbar icon disabled color
- `fg-toolbar-filename` - Project name text color
- `fg-toolbar-foldername` - Folder name text color
- `fg-toolbar-chevron` - Chevron icon color
- `fg-toolbar-unsavedicon` - Unsaved indicator color
- `fg-toolbar-login-button` - Login button color
- `fg-toolbar-login-button-border` - Login button border color
- `fg-toolbar-login-button-active` - Login button active color
- `fg-tab` - Tab text color
- `fg-tab-hover` - Tab text hover color
- `fg-tab-active` - Tab text active color
- `fg-header` - Header text color
- `fg-header-control` - Header control color
- `fg-header-control-hover` - Header control hover color
- `fg-header-control-active` - Header control active color
- `fg-component` - Component color
- `fg-component-disabled` - Disabled component color
- `fg-component-disabled-row-active` - Disabled component active row color
- `borders` - Border color

### Creating a Custom Theme

Themes are JSON files with the following structure:

```json
{
  "id": "my-theme-dark",
  "name": "My Dark Theme",
  "author": "Your Name",
  "palette": {
    "text": "#ffffff",
    "text-active": "#0099ff",
    "text-disabled": "#888888",
    "bg-panel": "#1e1e1e",
    "bg-toolbar": "#252525",
    "bg-toolbar-hover": "#333333",
    "bg-toolbar-active": "#0099ff",
    "fg-toolbar": "#ffffff",
    "fg-toolbar-hover": "#ffffff",
    "fg-toolbar-active": "#ffffff",
    "fg-toolbar-disabled": "#666666",
    "fg-toolbar-filename": "#ffffff",
    "fg-toolbar-foldername": "#cccccc",
    "fg-toolbar-chevron": "#888888",
    "fg-toolbar-unsavedicon": "#ff9900",
    "fg-toolbar-login-button": "#0099ff",
    "fg-toolbar-login-button-border": "#0099ff",
    "fg-toolbar-login-button-active": "#00ccff",
    "bg-overlay": "#2d2d2d",
    "bg-overlay-outline": "#444444",
    "bg-overlay-inner-outline": "#3d3d3d",
    "bg-tab": "#1e1e1e",
    "bg-tab-hover": "#252525",
    "bg-tab-active": "#252525",
    "fg-tab": "#ffffff",
    "fg-tab-hover": "#ffffff",
    "fg-tab-active": "#0099ff",
    "bg-header": "#1a1a1a",
    "fg-header": "#ffffff",
    "bg-header-control": "#252525",
    "bg-header-control-hover": "#333333",
    "bg-header-control-active": "#0099ff",
    "fg-header-control": "#ffffff",
    "fg-header-control-hover": "#ffffff",
    "fg-header-control-active": "#ffffff",
    "fg-component": "#0099ff",
    "fg-component-disabled": "#666666",
    "fg-component-disabled-row-active": "#0099ff",
    "borders": "#3d3d3d",
    "bg-window-close": "#0099ff",
    "bg-beta-label": "#ff9900"
  }
}
```

### Loading Custom Themes

Place theme JSON files in the Figma-linux config directory:
- **Linux**: `~/.config/figma-linux/themes/`

Access themes from the Settings panel → Themes tab.

## Application Settings

### General Settings
- **Panel Height** - Adjust the height of the bottom/top panel (default: auto)
- **Enable Color Space sRGB** - Force sRGB color space for compatibility
- **Visible New Project Button** - Show/hide the "New" button in toolbar
- **Save Last Opened Tabs** - Auto-restore tabs on startup
- **Export Directory** - Set default export location
- **Font Directories** - Add custom font search paths

### UI Preferences

#### UI3 Chrome (New Interface)
- `useUi3Chrome` - Enable the modernized UI3 interface (default: false)
- `panelLayout` - Position of the interface panel: `"top"` or `"bottom"` (default: "bottom")
- `panelHeight` - Custom panel height in pixels (default: 300)
- `showProductIcons` - Display product-specific icons for each surface (default: true)
- `showVoiceIndicators` - Show active voice calls and participant counts (default: true)
- `sidebarCollapsed` - Remember sidebar collapsed state (default: false)

#### Personal Access Token (PAT) Management
- **90-Day Expiry Tracking** - The app automatically tracks your Figma PAT lifecycle
- **Expiry Warnings** - Receive warnings at: 14 days, 7 days, 3 days, and 1 day before expiry
- **Auto Re-authentication** - Session is cleared and re-authentication is required when PAT expires
- **Clipboard Preservation** - Clipboard operations remain available during PAT transitions

### Migration Tracking
- `ui3_migration_version` - Current UI3 migration version (auto-updated)
- `ui3_migration_date` - Date of last UI3 migration (auto-updated)

## Migration & QA Guide

### For Users Upgrading to December 2025 Release

#### 1. Verify Installation

After installing the new version, verify everything works correctly:

```bash
# Check application version
figma-linux --version

# Run a quick verification
npm run build && npm run check
```

#### 2. Accessing New Surfaces

All new Figma surfaces are integrated directly into the desktop app:

##### Draw/Whiteboard
- Open Figma → Click "Draw" (or navigate to `https://figma.com/draw/*`)
- Full whiteboarding tools and vector drawing support
- Seamless collaboration with team members

##### Sites (CMS)
- Open Figma → Click "Sites" (or navigate to `https://figma.com/sites/*`)
- Create and manage static sites directly from design
- Export and hosting options

##### Make (AI Workspaces)
- Open Figma → Click "Make" (or navigate to `https://figma.com/make/*`)
- Access AI-powered design automation
- AI asset management and generation

##### Buzz (Templates)
- Open Figma → Click "Buzz" (or navigate to `https://figma.com/buzz/*`)
- Browse template marketplace
- Share and discover community templates

##### Slides (Presentations)
- Open Figma → Click "Slides" (or navigate to `https://figma.com/slides/*`)
- Create presentation decks from designs
- Export and present

#### 3. Verify Build Procedures

Run these commands to ensure builds work on your system:

```bash
# Install dependencies
npm install

# Compile for production
npm run build

# Verify no TypeScript errors
npm run check

# Run linting
npm run lint

# Create distribution packages
npm run pack
```

All commands should complete without errors.

#### 4. Testing New Features

##### Protocol Handlers
Test that `figma://` links work:
```bash
# Open via protocol (replace with actual file IDs)
xdg-open "figma://draw/abc123def456"
xdg-open "figma://sites/my-site"
xdg-open "figma://make/workspace"
```

##### Dev Mode Deep Links
Test development mode access:
```bash
# Open with dev-mode query parameter
figma-linux "https://figma.com/design/abc123?dev-mode=true"
```

##### Variables & Collections
- Open a design with variables
- Verify variables panel loads correctly
- Test switching between multiple modes (up to 20 supported)

##### Clipboard Operations
- Copy content in Figma (images, SVG, etc.)
- Paste into external applications
- Test "Edit in" workflows

##### GPU Acceleration
If experiencing performance issues:
```bash
# Try with GPU enabled
figma-linux --enable-gpu

# Or force software rendering
figma-linux --disable-gpu
```

#### 5. Settings Migration

The app automatically migrates your existing settings to the new format:

- **UI3 Chrome** - Opt-in to new interface in Settings → General
- **Panel Layout** - Choose top or bottom panel position
- **Product Icons** - Toggle product-specific icons per surface
- **Voice Indicators** - Show/hide active voice participants
- **Panel Height** - Customize vertical panel size

#### 6. Theme Creator QA

If you're creating custom themes:

1. Use the theme structure documented in the [Theme Customization](#theme-customization) section
2. Test theme with different UI states (hover, active, disabled)
3. Verify visibility with light and dark variants
4. Export theme via Settings → Themes → Export

#### 7. Troubleshooting Build Issues

**Build fails with TypeScript errors:**
```bash
npm run check  # Get detailed error messages
# Fix issues in src/ directory and retry
```

**Missing native modules:**
```bash
npm install
# On some systems, rebuild native modules
npx electron-rebuild
```

**AppImage packing fails:**
- Ensure `appimagetool` is installed and in PATH
- Check disk space (requires ~2GB free)
- Verify build completed successfully: `npm run build`

**GPU-related crashes:**
- Disable GPU: `figma-linux --disable-gpu`
- Update graphics drivers
- Check Electron logs: `~/.config/figma-linux/logs/`

### For Contributors & Maintainers

#### Build & Release Workflow

1. **Clone and setup:**
```bash
git clone https://github.com/Figma-Linux/figma-linux.git
cd figma-linux
npm install
```

2. **Verify code quality:**
```bash
npm run lint      # Check code style
npm run check     # TypeScript validation
npm run build     # Production build
```

3. **Create packages:**
```bash
npm run pack      # Creates all distribution formats
```

4. **Test packages:**
```bash
# On target distributions
sudo dpkg -i build/installers/figma-linux_*_amd64.deb
# or
sudo dnf install build/installers/figma-linux_*.x86_64.rpm
```

5. **Verify functionality:**
   - Launch application from menu
   - Test all new surfaces (Draw, Sites, Make, Buzz, Slides)
   - Verify clipboard operations
   - Check extension loading
   - Test protocol handlers

#### Key Files for Reference

- **URL Handling**: `/src/utils/Common/url.ts`
- **Extension Manager**: `/src/main/ExtensionManager.ts`
- **PAT Management**: `/src/main/Session.ts`
- **Regression Testing**: `/src/main/RegressionTester.ts`
- **Type Definitions**: `/src/types/Common/index.d.ts`

For detailed implementation information, see [INTEGRATION_EXTENSIONS_2025.md](./INTEGRATION_EXTENSIONS_2025.md).

## Community

Join us on [Telegram](https://t.me/+UuHqsKx-vLJyBq4b) or [Spectrum](https://spectrum.chat/figma-linux).


## Become a Backer
You can contribute to figma-linux development by supporting us on Paypal or Buy me a Coffee:

<p>
    <span class="badge-buymeacoffee"><a href="https://www.buymeacoffee.com/U5hnMuASy" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
    <span class="badge-paypal"><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4DNBUKPV6FBCY&source=url" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
</p>

Thanks to the supporters.
