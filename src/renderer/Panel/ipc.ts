import { ipcRenderer } from "electron";
import { NEW_FILE_TAB_TITLE } from "Const";

import {
  currentTab,
  tabs,
  isMenuOpen,
  panelZoom,
  newFileVisible,
  communityTabVisible,
} from "./store";

// UI3 state stores
import { writable } from "svelte/store";

// UI3 bottom navigation state
export const bottomNavState = writable<Types.BottomNavState>({
  activeSurface: 'design',
  visible: true,
  focusIndex: 0,
  surfaces: []
});

// UI3 surface change events
export const surfaceChanges = writable<{
  tabId: number;
  surfaceType: string;
  timestamp: number;
} | null>(null);

// Voice indicators state
export const voiceIndicators = writable<Record<number, {
  active: boolean;
  participants: number;
}>>({});

export function initIpc() {
  ipcRenderer.send("frontReady");

  // Core tab management
  ipcRenderer.on("closeAllTabs", () => {
    tabs.set([]);
  });
  
  ipcRenderer.on("didTabAdd", (_, data) => {
    tabs.addTab({
      id: data.id,
      url: data.url,
      title: data.title ?? "Recent Files",
      focused: data.focused,
      order: data.title === NEW_FILE_TAB_TITLE ? 0 : undefined,
    });

    if (data.focused) {
      currentTab.set(data.id);
    }

    if (data.title === NEW_FILE_TAB_TITLE) {
      currentTab.set(data.id);
      ipcRenderer.send("setTabFocus", data.id);
    }
  });

  ipcRenderer.on("setTitle", (_, data) => {
    if (data.title === "New Tab") {
      return;
    }

    tabs.updateTab({ id: data.id, title: data.title });
  });

  ipcRenderer.on("tabWasClosed", (_, tabId) => {
    tabs.deleteTab(tabId);
    // Clean up voice indicators for closed tab
    voiceIndicators.update(indicators => {
      const newIndicators = { ...indicators };
      delete newIndicators[tabId];
      return newIndicators;
    });
  });

  ipcRenderer.on("focusTab", (_, tabId) => {
    currentTab.set(tabId);
  });

  ipcRenderer.on("newFileBtnVisible", (_, visible) => {
    newFileVisible.set(visible);
  });

  ipcRenderer.on("setUsingMicrophone", (_, data) => {
    tabs.updateTab({ id: data.id, isUsingMicrophone: data.isUsingMicrophone });
    
    // Update voice indicators
    voiceIndicators.update(indicators => ({
      ...indicators,
      [data.id]: {
        ...(indicators[data.id] || { active: false, participants: 0 }),
        active: data.isUsingMicrophone,
        participants: data.isUsingMicrophone ? (indicators[data.id]?.participants || 1) : 0
      }
    }));
  });

  ipcRenderer.on("setIsInVoiceCall", (_, data) => {
    tabs.updateTab({ id: data.id, isInVoiceCall: data.isInVoiceCall });
    
    // Update voice indicators
    voiceIndicators.update(indicators => ({
      ...indicators,
      [data.id]: {
        ...(indicators[data.id] || { active: false, participants: 0 }),
        active: data.isInVoiceCall,
        participants: data.isInVoiceCall ? (indicators[data.id]?.participants || 1) : 0
      }
    }));
  });

  // UI3 Surface Changes
  ipcRenderer.on("surfaceChanged", (_, data) => {
    const { tabId, surfaceType, metadata } = data;
    
    // Update tab metadata in store
    tabs.updateUi3Metadata(tabId, {
      surfaceType,
      productIcon: metadata.productIcon,
      isDevMode: metadata.isDevMode
    });
    
    // Trigger surface change event for UI updates
    surfaceChanges.set({
      tabId,
      surfaceType,
      timestamp: data.timestamp
    });
  });

  // UI3 Bottom Navigation State Updates
  ipcRenderer.on("bottomNavStateUpdate", (_, data) => {
    const { tabId, state } = data;
    
    // Update bottom navigation state
    bottomNavState.set(state);
    
    // Update specific tab's bottom nav state in store
    const currentTabData = tabs.getTab(tabId);
    if (currentTabData) {
      // Could trigger additional UI updates for the specific tab
      console.log(`Bottom nav updated for tab ${tabId}:`, state);
    }
  });

  ipcRenderer.on("bottomNavFocusChange", (_, data) => {
    const { tabId, focusIndex, timestamp } = data;
    
    // Update focus in bottom nav state
    bottomNavState.update(state => ({
      ...state,
      focusIndex,
      timestamp
    }));
  });

  // UI3 Feature Event Handlers
  ipcRenderer.on("aiCreditsRequest", (_, data) => {
    console.log(`AI credits requested for tab ${data.tabId}:`, data.request);
    // Could trigger UI notifications or credit display updates
  });

  ipcRenderer.on("variablesExported", (_, data) => {
    console.log(`Variables exported from tab ${data.tabId}:`, data.variablesCount);
    // Could update UI to show export success or variable counts
  });

  ipcRenderer.on("devModeStateChange", (_, data) => {
    const { tabId, isReady } = data;
    
    // Update tab metadata to reflect dev mode state
    tabs.updateUi3Metadata(tabId, { isDevMode: isReady });
    
    console.log(`Dev mode ${isReady ? 'enabled' : 'disabled'} for tab ${tabId}`);
  });

  ipcRenderer.on("webhooksV2Update", (_, data) => {
    console.log(`Webhooks v2 update for tab ${data.tabId}:`, data.update);
    // Could trigger real-time UI updates based on webhook data
  });

  // Core IPC handlers
  ipcRenderer.on("isMainMenuOpen", (_, isOpen) => {
    isMenuOpen.set(isOpen);
  });

  ipcRenderer.on("setPanelScale", (_, scale: number) => {
    panelZoom.set(scale);
  });

  ipcRenderer.on("loadSettings", (_, settings: Types.SettingsInterface) => {
    panelZoom.set(settings.ui.scalePanel);
    
    // Load UI3 specific preferences
    // These would be used by the Svelte components
    console.log('UI3 Settings loaded:', {
      useUi3Chrome: settings.ui.useUi3Chrome,
      panelLayout: settings.ui.panelLayout,
      showProductIcons: settings.ui.showProductIcons,
      showVoiceIndicators: settings.ui.showVoiceIndicators
    });
  });

  ipcRenderer.on("openCommunity", (_) => {
    communityTabVisible.set(true);
    currentTab.set("communityTab");
  });

  ipcRenderer.on("communityTabWasClose", (_) => {
    communityTabVisible.set(false);
    currentTab.set("mainTab");
  });

  ipcRenderer.on("setLoading", (_, tabId, loading) => {
    tabs.updateTab({ id: tabId, loading });
  });

  // New IPC handlers for UI3 metadata updates
  ipcRenderer.on("updateTabSurfaceMetadata", (_, data) => {
    const { tabId, metadata } = data;
    tabs.updateUi3Metadata(tabId, {
      surfaceType: metadata.surfaceType,
      productIcon: metadata.productIcon,
      isDevMode: metadata.isDevMode
    });
  });
}
