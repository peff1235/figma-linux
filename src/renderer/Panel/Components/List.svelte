<script lang="ts">
  import { tabs } from "../store";
  import { voiceIndicators } from "../ipc";

  export let items: Types.TabFront[] = [];
  export let currentTabId: number | undefined;
  export let onClickTitle: (event: MouseEvent, id: number) => void;
  export let onClickClose: (event: MouseEvent, id: number) => void;
  export let onDndConsider: (event: any) => void;
  export let onDndFinalize: (event: any) => void;

  let voiceState: Record<number, { active: boolean; participants: number }> = {};
  
  voiceIndicators.subscribe(state => {
    voiceState = state;
  });

  function handleTabClick(event: MouseEvent, tab: any) {
    if (event.button === 0) { // left click
      onClickTitle(event, tab.id);
    }
  }

  function handleCloseClick(event: MouseEvent, tabId: number) {
    event.stopPropagation();
    onClickClose(event, tabId);
  }

  function getVoiceIndicator(tabId: number) {
    return voiceState[tabId] || { active: false, participants: 0 };
  }

  function shouldShowProductIcon(tab: any): boolean {
    return tab.surfaceType && tab.surfaceType !== 'design';
  }
</script>

<div class="tab-list">
  {#each items as tab (tab.id)}
    <div
      class="tab-item"
      class:active={currentTabId === tab.id}
      class:loading={tab.loading}
      class:dev-mode={tab.isDevMode}
      data-id={tab.id}
    >
      <button
        class="tab-content"
        on:click={(e) => handleTabClick(e, tab)}
        on:contextmenu={(e) => e.preventDefault()}
        title={tab.title}
      >
        <!-- Product Icon for UI3 surfaces -->
        {#if shouldShowProductIcon(tab) && tab.surfaceType}
          <div class="product-icon">
            <!-- <Ui3ProductIcons 
              surfaceType={tab.surfaceType} 
              size={14} 
              active={currentTabId === tab.id}
            /> -->
            <span class="surface-icon">{tab.surfaceType}</span>
          </div>
        {/if}

        <!-- Tab Title -->
        <span class="tab-title">{tab.title || 'Untitled'}</span>

        <!-- Loading indicator -->
        {#if tab.loading}
          <div class="loading-indicator">
            <div class="spinner"></div>
          </div>
        {/if}

        <!-- Voice indicators -->
        {#if getVoiceIndicator(tab.id).active}
          <div class="voice-indicator" class:multi-participant={getVoiceIndicator(tab.id).participants > 1}>
            <div class="voice-icon">
              {#if getVoiceIndicator(tab.id).participants > 1}
                👥
              {:else}
                🎤
              {/if}
            </div>
            {#if getVoiceIndicator(tab.id).participants > 1}
              <span class="participant-count">{getVoiceIndicator(tab.id).participants}</span>
            {/if}
          </div>
        {/if}

        <!-- Dev mode indicator -->
        {#if tab.isDevMode}
          <div class="dev-mode-indicator" title="Dev Mode Active">
            <span class="dev-icon">⚡</span>
          </div>
        {/if}

        <!-- Close button -->
        <button
          class="close-button"
          on:click={(e) => handleCloseClick(e, tab.id)}
          title="Close tab"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 4.5L9.5 1l1.5 1.5L7.5 6l3.5 3.5-1.5 1.5L6 7.5 2.5 11 1 9.5 4.5 6 1 2.5 2.5 1 6 4.5z"/>
          </svg>
        </button>
      </button>
    </div>
  {/each}
</div>

<style>
  .tab-list {
    display: flex;
    align-items: stretch;
    gap: 1px;
    background-color: var(--border-subtle);
    border-radius: 6px;
    overflow: hidden;
  }

  .tab-item {
    display: flex;
    background-color: var(--bg-header);
    border: none;
    position: relative;
    min-width: 0;
    flex-shrink: 0;
  }

  .tab-item.active {
    background-color: var(--bg-header-active);
  }

  .tab-item.dev-mode {
    border-left: 2px solid var(--accent-warning);
  }

  .tab-item.loading .tab-title {
    opacity: 0.7;
  }

  .tab-content {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: none;
    background: transparent;
    color: var(--fg-tab);
    cursor: pointer;
    white-space: nowrap;
    min-width: 0;
    position: relative;
    transition: all 0.15s ease;
    font-size: var(--text-size-tab);
    line-height: 1.2;
  }

  .tab-content:hover {
    background-color: var(--bg-hover);
  }

  .tab-item.active .tab-content {
    color: var(--fg-tab-active);
  }

  .product-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .surface-icon {
    font-size: 10px;
    padding: 2px 4px;
    background-color: var(--accent-info);
    color: white;
    border-radius: 4px;
    text-transform: uppercase;
    font-weight: 600;
  }

  .tab-title {
    flex: 1;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    font-weight: 500;
  }

  .loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
  }

  .spinner {
    width: 12px;
    height: 12px;
    border: 2px solid var(--border-subtle);
    border-top: 2px solid var(--fg-muted);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .voice-indicator {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 2px 4px;
    background-color: var(--accent-success);
    color: white;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .voice-indicator.multi-participant {
    background-color: var(--accent-info);
  }

  .voice-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .participant-count {
    font-size: 9px;
    font-weight: 700;
  }

  .dev-mode-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    background-color: var(--accent-warning);
    color: white;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .dev-icon {
    font-size: 10px;
  }

  .close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: none;
    background: transparent;
    color: var(--fg-muted);
    cursor: pointer;
    border-radius: 4px;
    flex-shrink: 0;
    opacity: 0;
    transition: all 0.15s ease;
  }

  .tab-content:hover .close-button {
    opacity: 1;
  }

  .close-button:hover {
    background-color: var(--bg-hover);
    color: var(--fg-default);
  }

  .close-button svg {
    transition: transform 0.15s ease;
  }

  .close-button:hover svg {
    transform: scale(1.1);
  }
</style>