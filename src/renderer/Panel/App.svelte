<script lang="ts">
  import { themeApp } from "../Common/Store/Themes";
  import { initCommonIpc } from "../Common/Ipc";
  import { getColorPallet } from "Utils/Render/themes";
  import { initIpc, bottomNavState } from "./ipc";
  import { panelZoom } from "./store";
  import { Left, Right, Tabs } from "./Components";
  import BottomNav from "./Components/BottomNav.svelte";
  import { onMount } from "svelte";

  initCommonIpc();
  initIpc();

  let pallet: string[] = [];
  let ui3Layout = false;
  let useBottomNav = false;
  let showProductIcons = true;
  let showVoiceIndicators = true;

  // Subscribe to theme changes
  themeApp.subscribe((theme) => {
    if (!theme) {
      return;
    }
    pallet = getColorPallet(theme);
  });

  // UI3 layout state
  let navState: Types.BottomNavState;
  
  bottomNavState.subscribe(state => {
    navState = state;
  });

  // Default bottom nav surfaces for UI3
  const defaultSurfaces = [
    { type: 'design', label: 'Design', icon: 'design', enabled: true },
    { type: 'figjam', label: 'FigJam', icon: 'figjam', enabled: true },
    { type: 'draw', label: 'Draw', icon: 'draw', enabled: true },
    { type: 'sites', label: 'Sites', icon: 'sites', enabled: true },
    { type: 'make', label: 'Make', icon: 'make', enabled: true },
    { type: 'buzz', label: 'Buzz', icon: 'buzz', enabled: true },
    { type: 'slides', label: 'Slides', icon: 'slides', enabled: true }
  ];

  function handleSurfaceChange(surfaceType: string) {
    // Send surface change to main process
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('openProductSurface', surfaceType, {});
  }

  onMount(() => {
    // Initialize UI3 layout based on settings
    // In a real implementation, these would come from settings
    ui3Layout = true;
    useBottomNav = true;
    showProductIcons = true;
    showVoiceIndicators = true;
  });
</script>

<div id="panel" class:ui3-layout={ui3Layout} style={`zoom: ${$panelZoom}; ${pallet.join("; ")}`}>
  {#if useBottomNav}
    <!-- UI3 Layout with Bottom Navigation -->
    <div class="ui3-container">
      <!-- Top Panel - Simplified -->
      <div class="top-panel">
        <Left />
        <div class="center-content">
          <Tabs />
        </div>
        <Right />
      </div>
      
      <!-- Bottom Navigation - UI3 Chrome -->
      <BottomNav 
        active={navState?.visible || false}
        onSurfaceChange={handleSurfaceChange}
      />
    </div>
  {:else}
    <!-- Legacy Layout -->
    <Left />
    <Tabs />
    <Right />
  {/if}
</div>

<style>
  #panel {
    display: flex;
    background-color: var(--bg-header);
    font-family: "Inter", sans-serif;
    font-size: var(--fontSize);
    font-weight: 400;
  }

  /* UI3 Layout Styles */
  .ui3-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
  }

  .top-panel {
    display: flex;
    align-items: center;
    height: 48px;
    background-color: var(--bg-header);
    border-bottom: 1px solid var(--border-subtle);
    flex-shrink: 0;
  }

  .center-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    margin: 0 16px;
  }

  /* Enhanced Legacy Layout */
  #panel:not(.ui3-layout) {
    height: 40px;
  }

  /* Common Styles */
  :global(html),
  :global(body) {
    margin: 0;
    padding: 0;
    border: none;

    --text-size-tab: 14px;
    --text-size-tab-view: 14px;
    --text-size-popup: 14px;

    font-family: "Inter", sans-serif;
    font-size: var(--fontSize);
    font-weight: 400;
  }

  /* UI3 Theme Variables */
  .ui3-layout {
    --bg-header: #1a1a1a;
    --bg-header-active: #2a2a2a;
    --bg-hover: #363636;
    --fg-default: #ffffff;
    --fg-muted: #a0a0a0;
    --fg-tab: #e0e0e0;
    --fg-tab-active: #ffffff;
    --border-subtle: #404040;
    --accent-primary: #0a84ff;
    --accent-primary-alpha: rgba(10, 132, 255, 0.2);
    --accent-success: #30d158;
    --accent-info: #64d2ff;
    --accent-warning: #ff9500;
    --accent-critical: #ff3b30;
  }

  /* Animations */
  .ui3-container {
    animation: ui3SlideUp 0.3s ease-out;
  }

  @keyframes ui3SlideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .top-panel {
    animation: panelSlideDown 0.3s ease-out;
  }

  @keyframes panelSlideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
