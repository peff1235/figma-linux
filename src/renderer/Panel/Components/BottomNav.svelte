<script lang="ts">
  import { bottomNavState } from "../ipc";

  export let active: boolean = false;
  export let onSurfaceChange: (surface: string) => void = () => {};

  let navState: any = {
    activeSurface: 'design',
    visible: true,
    focusIndex: 0,
    surfaces: []
  };
  
  bottomNavState.subscribe(state => {
    navState = state;
  });

  function handleSurfaceClick(surface: any) {
    if (surface.enabled) {
      onSurfaceChange(surface.type);
    }
  }
</script>

{#if navState?.visible}
  <div class="bottom-navigation" class:active>
    <div class="nav-surfaces">
      {#each navState.surfaces || [] as surface (surface.type)}
        <button
          class="surface-button"
          class:active={navState.activeSurface === surface.type}
          class:disabled={!surface.enabled}
          on:click={() => handleSurfaceClick(surface)}
          disabled={!surface.enabled}
          title={surface.label}
        >
          <div class="surface-icon">{surface.icon || surface.type}</div>
          <span class="surface-label">{surface.label}</span>
          {#if surface.badge}
            <span class="surface-badge">{surface.badge}</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>
{/if}

<style>
  .bottom-navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    background-color: var(--bg-header);
    border-top: 1px solid var(--border-subtle);
    padding: 0 16px;
    transition: all 0.2s ease;
  }

  .nav-surfaces {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .surface-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-width: 60px;
    height: 44px;
    padding: 6px 12px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--fg-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
  }

  .surface-button:hover:not(.disabled) {
    background-color: var(--bg-hover);
    color: var(--fg-default);
  }

  .surface-button.active {
    background-color: var(--accent-primary-alpha);
    color: var(--accent-primary);
  }

  .surface-button.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .surface-label {
    font-size: 11px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
  }

  .surface-badge {
    position: absolute;
    top: -2px;
    right: -2px;
    background-color: var(--accent-critical);
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .bottom-navigation.active {
    background-color: var(--bg-header-active);
  }
</style>