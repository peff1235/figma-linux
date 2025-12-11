declare namespace Types {
  // UI3 Product Surface Types
  type ProductSurfaceType = 
    | "design" 
    | "figjam" 
    | "draw" 
    | "sites" 
    | "make" 
    | "buzz" 
    | "slides" 
    | "dev-mode"
    | "prototype"
    | "community"
    | "recent-files"
    | "login";

  // UI3 Navigation State
  interface BottomNavState {
    activeSurface: ProductSurfaceType;
    visible: boolean;
    focusIndex: number;
    surfaces: Array<{
      type: ProductSurfaceType;
      label: string;
      icon: string;
      enabled: boolean;
      badge?: string;
    }>;
  }

  // UI3 Tab Metadata
  interface Ui3TabMetadata {
    surfaceType: ProductSurfaceType;
    productIcon: string;
    isDevMode: boolean;
    hasVariables: boolean;
    hasComponents: boolean;
    voiceIndicators: {
      active: boolean;
      participants: number;
    };
    bottomNavState?: BottomNavState;
  }

  interface Tab {
    id: number;
    title?: string;
    url?: string;
    moves?: boolean;
    fileKey?: string;
    order?: number;
    focused?: boolean;
    isUsingMicrophone?: boolean;
    isInVoiceCall?: boolean;
    loading?: boolean;
    view: import("electron").BrowserView;
    // UI3 enhancements
    metadata?: Ui3TabMetadata;
  }

  type TabIdType = number | "mainTab" | "communityTab";
  type TabFront = Pick<
    Tab,
    "id" | "title" | "order" | "isUsingMicrophone" | "isInVoiceCall" | "loading"
  > & {
    // UI3 metadata for frontend
    surfaceType?: ProductSurfaceType;
    productIcon?: string;
    isDevMode?: boolean;
  };

  interface AddTabProps {
    id: number;
    url: string;
    title?: string;
    focused?: boolean;
    order?: number;
  }

  interface TabData {
    micAccess: boolean;
    view: import("electron").BrowserView;
  }

  interface WindowInitOpts {
    userId?: string;
    tabs?: Types.SavedTab[];
  }

  interface SavedTab {
    title?: string;
    url?: string;
  }

  interface ShortcutsMap {
    accelerator: string;
    value: string;
    type: "action" | "command" | "id";
  }

  type View = "TopPanel" | "Settings" | "ThemeCreator";
  type SettingsView = "General" | "Themes";

  interface FeatureFlags {
    desktop_beta_use_agent_for_fonts?: boolean;
  }

  interface WindowState {
    x: number;
    y: number;
    width: number;
    height: number;
    isMaximized: boolean;
    lastActiveTabPath: string;
    hasOpenedCommunityTab: boolean;
    userId: string;
    tabs: SavedTab[];
  }

  interface CommandSwitch {
    switch: string;
    value?: string;
  }
  interface SettingsInterface {
    clientId: string;
    userId: string;
    authedUserIDs: string[];
    patIssuedAt: number | null;
    app: {
      logLevel: number;
      lastTimeClearLogFile: number;
      enableColorSpaceSrgb: boolean;
      visibleNewProjectBtn: boolean;
      useZenity: boolean;
      disableThemes: boolean;
      panelHeight: number;
      saveLastOpenedTabs: boolean;
      exportDir: string;
      fontDirs: string[];
      recentlyClosedTabs: SavedTab[];
      commandSwitches: CommandSwitch[];
      windowsState: {
        [key: string]: WindowState;
      };
      lastOpenedTabs:
        | {
            [key: string]: SavedTab[];
          }
        | SavedTab[];
      featureFlags: FeatureFlags;
      savedExtensions: Extensions.ExtensionJson[];
      lastSavedPluginDir?: string;
      lastExportDir?: string;
      themeDropdownOpen: boolean;
      creatorsThemesDropdownOpen: boolean;
      useOldPreviewer: boolean;
      dontShowTutorialCreator: boolean;
    };
    ui: {
      scalePanel: number;
      scaleFigmaUI: number;
      // UI3 specific preferences
      useUi3Chrome: boolean;
      panelLayout: "top" | "bottom";
      showProductIcons: boolean;
      showVoiceIndicators: boolean;
      sidebarCollapsed: boolean;
      panelHeight: number;
      ui3_migration_version?: string;
      ui3_migration_date?: string;
    };
    theme: {
      currentTheme: string;
    };
    [path: string]: any;
  }
}
