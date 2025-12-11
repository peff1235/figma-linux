import { storage } from "Main/Storage";

/**
 * UI3 Settings Migration Utility
 * Handles migration of existing settings to include UI3 preferences
 */
export class Ui3SettingsMigration {
  private static readonly UI3_SETTINGS_VERSION = "1.0.0";
  private static readonly MIGRATION_KEY = "ui3_migration_version";

  /**
   * Migrate existing settings to include UI3 preferences
   */
  public static migrate(): void {
    try {
      const currentMigration = storage.settings.ui.ui3_migration_version;
      
      if (currentMigration !== this.UI3_SETTINGS_VERSION) {
        console.log("🔄 Migrating settings for UI3 support...");
        
        // Ensure UI3 specific settings exist with defaults
        this.ensureUi3Settings();
        
        // Mark migration as complete
        storage.settings.ui.ui3_migration_version = this.UI3_SETTINGS_VERSION;
        storage.settings.ui.ui3_migration_date = new Date().toISOString();
        
        // Save migrated settings
        storage.save();
        
        console.log("✅ UI3 settings migration completed");
      }
    } catch (error) {
      console.warn("⚠️ UI3 settings migration failed:", error);
    }
  }

  /**
   * Ensure all UI3 settings have proper defaults
   */
  private static ensureUi3Settings(): void {
    // Initialize UI3 chrome preferences
    if (typeof storage.settings.ui.useUi3Chrome !== "boolean") {
      storage.settings.ui.useUi3Chrome = false; // Default to false, enable manually
    }

    // Panel layout preference
    if (!["top", "bottom"].includes(storage.settings.ui.panelLayout)) {
      storage.settings.ui.panelLayout = "top"; // Default to legacy top layout
    }

    // Product icons visibility
    if (typeof storage.settings.ui.showProductIcons !== "boolean") {
      storage.settings.ui.showProductIcons = true;
    }

    // Voice indicators visibility
    if (typeof storage.settings.ui.showVoiceIndicators !== "boolean") {
      storage.settings.ui.showVoiceIndicators = true;
    }

    // Sidebar collapsed state
    if (typeof storage.settings.ui.sidebarCollapsed !== "boolean") {
      storage.settings.ui.sidebarCollapsed = false;
    }

    // Ensure panel height is set
    if (typeof storage.settings.ui.panelHeight !== "number") {
      storage.settings.ui.panelHeight = 48; // UI3 default height
    }

    console.log("🔧 UI3 settings initialized with defaults");
  }

  /**
   * Enable UI3 chrome for the application
   */
  public static enableUi3Chrome(): void {
    storage.settings.ui.useUi3Chrome = true;
    storage.settings.ui.panelLayout = "bottom"; // Use bottom navigation by default
    storage.settings.ui.panelHeight = 88; // Increased height for bottom nav
    storage.settings.ui.showProductIcons = true;
    storage.settings.ui.showVoiceIndicators = true;
    storage.save();
    
    console.log("🚀 UI3 chrome enabled");
  }

  /**
   * Disable UI3 chrome and return to legacy layout
   */
  public static disableUi3Chrome(): void {
    storage.settings.ui.useUi3Chrome = false;
    storage.settings.ui.panelLayout = "top";
    storage.settings.ui.panelHeight = 40; // Legacy height
    storage.save();
    
    console.log("⬅️ UI3 chrome disabled, returned to legacy layout");
  }

  /**
   * Get current UI3 settings status
   */
  public static getUi3Status(): {
    enabled: boolean;
    layout: "top" | "bottom";
    panelHeight: number;
    showProductIcons: boolean;
    showVoiceIndicators: boolean;
    migrationVersion?: string;
  } {
    return {
      enabled: storage.settings.ui.useUi3Chrome || false,
      layout: storage.settings.ui.panelLayout || "top",
      panelHeight: storage.settings.ui.panelHeight || 40,
      showProductIcons: storage.settings.ui.showProductIcons !== false,
      showVoiceIndicators: storage.settings.ui.showVoiceIndicators !== false,
      migrationVersion: storage.settings.ui.ui3_migration_version,
    };
  }
}

/**
 * UI3 Surface Type Detection Utility
 */
export class Ui3SurfaceDetector {
  /**
   * Detect surface type from URL or page title
   */
  public static detectSurfaceType(url: string, title?: string): Types.ProductSurfaceType {
    try {
      const urlLower = url.toLowerCase();
      const titleLower = (title || "").toLowerCase();

      // Check URL patterns first
      if (urlLower.includes("/figma") || urlLower.includes("/design")) {
        return "design";
      }
      if (urlLower.includes("/figjam") || urlLower.includes("/jam")) {
        return "figjam";
      }
      if (urlLower.includes("/draw") || urlLower.includes("/sketch")) {
        return "draw";
      }
      if (urlLower.includes("/sites") || urlLower.includes("/website")) {
        return "sites";
      }
      if (urlLower.includes("/make") || urlLower.includes("/prototype")) {
        return "make";
      }
      if (urlLower.includes("/buzz") || urlLower.includes("/social")) {
        return "buzz";
      }
      if (urlLower.includes("/slides") || urlLower.includes("/presentation")) {
        return "slides";
      }
      if (urlLower.includes("/dev") || titleLower.includes("dev")) {
        return "dev-mode";
      }
      if (urlLower.includes("/prototype") || titleLower.includes("prototype")) {
        return "prototype";
      }
      if (urlLower.includes("/community") || urlLower.includes("/plugins")) {
        return "community";
      }
      if (urlLower.includes("/recent") || urlLower.includes("/files")) {
        return "recent-files";
      }
      if (urlLower.includes("/login") || urlLower.includes("/auth")) {
        return "login";
      }

      // Default to design for unknown URLs
      return "design";
    } catch (error) {
      console.warn("Surface detection failed:", error);
      return "design";
    }
  }

  /**
   * Get display name for surface type
   */
  public static getSurfaceDisplayName(surfaceType: Types.ProductSurfaceType): string {
    const displayNames: Record<Types.ProductSurfaceType, string> = {
      "design": "Design",
      "figjam": "FigJam",
      "draw": "Draw",
      "sites": "Sites",
      "make": "Make",
      "buzz": "Buzz",
      "slides": "Slides",
      "dev-mode": "Dev Mode",
      "prototype": "Prototype",
      "community": "Community",
      "recent-files": "Recent Files",
      "login": "Login"
    };

    return displayNames[surfaceType] || "Design";
  }

  /**
   * Get product icon for surface type
   */
  public static getProductIcon(surfaceType: Types.ProductSurfaceType): string {
    const iconMap: Record<Types.ProductSurfaceType, string> = {
      "design": "figma-design",
      "figjam": "figma-figjam",
      "draw": "figma-draw",
      "sites": "figma-sites",
      "make": "figma-make",
      "buzz": "figma-buzz",
      "slides": "figma-slides",
      "dev-mode": "dev-mode-icon",
      "prototype": "prototype-icon",
      "community": "community-icon",
      "recent-files": "recent-files-icon",
      "login": "login-icon"
    };

    return iconMap[surfaceType] || "figma-design";
  }
}