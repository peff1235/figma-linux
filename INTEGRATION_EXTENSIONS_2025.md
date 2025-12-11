# 2025 Integration Extensions - Implementation Guide

## Overview

This document describes the comprehensive extensions added to support new Figma surfaces, modernized extension manifests, 90-day PAT management, and regression testing hooks.

## 1. URL/Protocol Helper Extensions

### New Surface Types Supported

The following new Figma product surfaces are now recognized and opened in tabs (not external browser):

#### Draw & Whiteboard
- URLs: `https://figma.com/draw/*` or `figma://draw/*`
- URLs: `https://figma.com/whiteboard/*` or `figma://whiteboard/*`
- Helper: `isDrawUrl(url: string): boolean`

#### Sites (CMS)
- URLs: `https://figma.com/sites/*` or `figma://sites/*`
- Helper: `isSitesUrl(url: string): boolean`

#### Make (AI Workspaces)
- URLs: `https://figma.com/make/*` or `figma://make/*`
- Helper: `isMakeUrl(url: string): boolean`

#### Buzz (Templates)
- URLs: `https://figma.com/buzz/*` or `figma://buzz/*`
- Helper: `isBuzzUrl(url: string): boolean`

#### Slides (Presentations)
- URLs: `https://figma.com/slides/*` or `figma://slides/*`
- Helper: `isSlidesUrl(url: string): boolean`

### Dev Mode & Advanced Features

#### Dev Mode Deep Links
- URLs with `?dev-mode=true`, `?mode=dev`, or `?ready-for-dev=true`
- Helper: `isDevModeDeepLink(url: string): boolean`
- Use case: "Ready for Dev" handoff workflows

#### Variables & Collections (20 Modes Support)
- URLs with `?variables=`, `?collections=`, or `?modes=` parameters
- Helper: `isVariablesCollectionUrl(url: string): boolean`
- Supports up to 20 variable modes per collection

#### Grid Auto Layout Previews
- URLs with `?grid-preview=` parameter
- Helper: `isGridAutoLayoutPreviewUrl(url: string): boolean`

### Unified In-App URL Detection

All helpers are unified under:
```typescript
isInAppUrl(url: string): boolean
```

This checks all supported in-app destination types and is used throughout:
- `Tab.ts` - window open handlers
- `MainTab.ts` - navigation handlers
- `App.ts` - protocol and second instance handlers
- `WindowManager.ts` - URL opening with logging

## 2. Extension Manager Modernization

### New File Type Support

Extended `FILE_EXTENSION_WHITE_LIST` to include:
- `.json5` - JSON5 configuration files
- `.yaml`, `.yml` - YAML configuration
- `.wasm` - WebAssembly modules
- `.ai` - AI asset bundles

### 2025 Manifest Schema

The extension manager now validates and supports:

#### Code Connect Hooks
```json
{
  "codeConnect": {
    "hooks": ["onComponentCreate", "onVariableUpdate"]
  }
}
```

#### Webhooks v2 with Secrets
```json
{
  "webhooks": {
    "version": 2,
    "secrets": {
      "signing_key": "env:WEBHOOK_SECRET"
    }
  }
}
```

#### AI Asset Bundles
```json
{
  "aiAssets": [
    {
      "type": "model",
      "path": "assets/model.ai"
    }
  ]
}
```

#### Capability Flags
```json
{
  "capabilities": [
    "codeConnect",
    "webhooksV2",
    "aiAssets",
    "devMode",
    "variables",
    "collections",
    "prototyping",
    "presentation",
    "fileAccess",
    "networkAccess"
  ]
}
```

### Security Preservation

All existing security checks remain in place:
- Filename validation
- Path traversal prevention
- Manifest structure validation
- Build script blocking (for security)

## 3. 90-Day Personal Access Token Management

### Implementation

**Session.ts** now tracks PAT lifecycle:

#### Issuance Tracking
- PAT issuance timestamp stored in `settings.patIssuedAt`
- Automatically tracked on successful app authentication
- Triggered via `app.emit("trackPatIssuance")`

#### Expiry Monitoring
- Checks every 24 hours for PAT age
- Warns users at: 14 days, 7 days, 3 days, 1 day before expiry
- Modal dialogs with clear instructions to regenerate token

#### Auto-Cleanup on Expiry
- Clears session storage and cache
- Resets `patIssuedAt` to null
- Forces re-authentication
- Preserves clipboard and protocol handler functionality

### Clipboard Flow Preservation

Enhanced permissions in `Session.handleAppReady()`:
```typescript
const whitelist = ["fullscreen", "pointerLock", "clipboard-read", "clipboard-sanitized-write"];
```

This ensures image edit flows continue to work even during PAT transitions.

## 4. Regression Hooks & Testing

### RegressionTester Utility

**Location**: `src/main/RegressionTester.ts`

#### Automatic URL Navigation Logging

Every URL opened is logged with its type:
```
[regression] Opening Draw/Whiteboard URL: figma://draw/abc123
[regression] Opening Sites URL: https://figma.com/sites/my-site
[regression] Opening Dev Mode deep link: ?dev-mode=true
```

#### Clipboard Operation Tracking

All clipboard operations are logged:
```
[regression] Clipboard data set - format: image/png, size: 12345
[regression] Clipboard image write successful
```

#### Protocol Handler Logging

Protocol invocations are tracked:
```
[regression] Protocol handler invoked - URL: figma://make/workspace
[regression] Protocol - Opening URL in window manager
```

#### Extension Loading Validation

Extensions with 2025 schema features are logged:
```
[regression-test] Extension loaded - ID: 1, name: MyPlugin, 
  codeConnect: true, webhooksV2: true, aiAssets: false
```

### Test Suite

Built-in regression tests can be run:
```typescript
import { RegressionTester } from "Main/RegressionTester";

// Run all tests
RegressionTester.runAllTests();

// Test specific features
RegressionTester.testVariablesModes(20); // Test 20-mode support
```

Tests cover:
- URL recognition for all new surface types
- Protocol handling for `figma://` scheme
- Surface type detection
- Clipboard operations
- Extension manifest validation

## 5. Integration Points

### Tab.ts & MainTab.ts
- Updated `windowOpenHandler()` to use `isInAppUrl()`
- Updated `onNewWindow()` to handle all new surface types
- Handles both HTTP and `figma://` protocols uniformly

### App.ts
- Protocol handler uses `isInAppUrl()` for routing
- Second instance detection recognizes all new URLs
- Clipboard operations include regression logging
- PAT tracking event handler

### WindowManager.ts
- `openUrl()` includes comprehensive logging
- `logUrlNavigation()` categorizes and logs each surface type
- `finishAppAuth()` triggers PAT tracking

### ExtensionManager.ts
- `validate2025ManifestSchema()` validates new schema
- Regression logging on extension load
- Preserves all existing security validations

## 6. Settings & Storage

### New Settings Fields

**Types.SettingsInterface**:
- `patIssuedAt: number | null` - PAT issuance timestamp

**ui settings**:
- `useUi3Chrome: boolean` - Enable UI3 chrome
- `panelLayout: "top" | "bottom"` - Panel position
- `showProductIcons: boolean` - Show product-specific icons
- `showVoiceIndicators: boolean` - Show voice call indicators
- `sidebarCollapsed: boolean` - Sidebar state
- `panelHeight: number` - Panel height

### Migration

Settings are automatically migrated with backward compatibility.

## 7. Testing Recommendations

### Manual Testing Checklist

1. **New Surface URLs** - Test opening each new surface type:
   - [ ] Draw/Whiteboard tools work
   - [ ] Sites CMS opens correctly
   - [ ] Make AI workspaces load
   - [ ] Buzz templates display
   - [ ] Slides presentation mode

2. **Dev Mode & Variables**:
   - [ ] Dev Mode deep links work (`?dev-mode=true`)
   - [ ] "Ready for Dev" handoff functions
   - [ ] Variables panel opens with `?variables=`
   - [ ] Collections with 20 modes load correctly

3. **Protocol Handling**:
   - [ ] `figma://draw/*` opens in app
   - [ ] `figma://sites/*` opens in app
   - [ ] All protocol variants work

4. **Clipboard Flows**:
   - [ ] Copy/paste images works
   - [ ] Edit in external app works
   - [ ] SVG export to clipboard works
   - [ ] PDF clipboard operations work

5. **Extension Loading**:
   - [ ] Extensions with `.yaml` files load
   - [ ] Extensions with `.json5` configs load
   - [ ] Extensions with Code Connect hooks load
   - [ ] Extensions with Webhooks v2 load
   - [ ] Extensions with AI assets load

6. **PAT Management**:
   - [ ] PAT tracking starts on login
   - [ ] Warning dialogs appear at correct intervals
   - [ ] Session clears on PAT expiry
   - [ ] Re-authentication works after expiry

### Automated Testing

Run regression tests:
```bash
# Tests are logged to the app logger
# Check logs for "[regression-test]" entries
```

### Log Monitoring

Watch for these log entries:
- `[regression] Opening <surface> URL`
- `[regression] Clipboard <operation> successful`
- `[regression] Protocol handler invoked`
- `[regression-test] Extension loaded`
- `[session] PAT expiry check: X days remaining`

## 8. Acceptance Criteria Validation

✅ **Opening new product URLs launches inside wrapper**
- All new surfaces (Draw, Sites, Make, Buzz, Slides) open in tabs
- Both HTTP and `figma://` schemes supported

✅ **Local extensions with new schema load correctly**
- YAML, JSON5, WASM, AI assets supported
- Code Connect, Webhooks v2 validated
- Security checks preserved

✅ **PAT/clipboard flows still work**
- Clipboard permissions explicitly whitelisted
- PAT expiry tracked and warned
- Re-authentication flows preserved

✅ **No crashes when invoking new feature surfaces**
- Comprehensive error handling in place
- Regression logging for debugging
- Graceful fallbacks for unknown features

## 9. Future Enhancements

Potential areas for expansion:
- Visual PAT expiry countdown in UI
- Bulk extension manifest migration tool
- Surface-specific theme customizations
- Advanced Dev Mode integration
- Enhanced AI asset management UI

## 10. Troubleshooting

### URLs Not Opening in App
- Check logs for `[regression] Opening` entries
- Verify URL matches regex patterns in `url.ts`
- Ensure `isInAppUrl()` returns true for the URL

### Extension Not Loading
- Check manifest validation logs
- Verify file extensions are in whitelist
- Review security validation errors

### PAT Warnings Not Appearing
- Check `settings.patIssuedAt` is set
- Verify 24-hour check interval is running
- Look for `[session]` log entries

### Clipboard Issues
- Verify permissions whitelist includes clipboard
- Check `[regression] Clipboard` log entries
- Test with different formats (PNG, SVG, PDF)

## References

- `/src/utils/Common/url.ts` - URL helpers
- `/src/main/ExtensionManager.ts` - Extension validation
- `/src/main/Session.ts` - PAT management
- `/src/main/RegressionTester.ts` - Testing utilities
- `/src/constants/other.ts` - File type whitelist
