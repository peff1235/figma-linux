<script lang="ts">
  export let surfaceType: string;
  export let size: number = 16;
  export let active: boolean = false;

  // UI3 Product Surface Icons
  const iconPaths = {
    'design': 'M8 2l6 3v6c0 5-3 9-6 9s-6-4-6-9V5l6-3z',
    'figjam': 'M12 2l8 4v8c0 6-4 12-8 12s-8-6-8-12V6l8-4z',
    'draw': 'M6 2h8l4 4v12c0 2-2 4-4 4H6c-2 0-4-2-4-4V6c0-2 2-4 4-4z',
    'sites': 'M4 4h16v8H4V4zm0 10h16v6H4v-6z',
    'make': 'M8 2l12 6v12L8 32 2 20V8L8 2z',
    'buzz': 'M6 4h12l2 4v12c0 3-3 6-6 6H6c-3 0-6-3-6-6V8c0-3 3-4 6-4z',
    'slides': 'M4 6h16v12H4V6zm8 2v8h4V8h-4z',
    'dev-mode': 'M12 2l4 4-4 4-4-4 4-4zm-8 8l4 4-4 4-4-4 4-4zm8 8l4 4-4 4-4-4 4-4zm8-8l4 4-4 4-4-4 4-4z',
    'prototype': 'M8 4l8 4-8 4L0 8l8-4zm0 8l8 4-8 4-8-4 8-4z'
  };

  $: path = iconPaths[surfaceType as keyof typeof iconPaths] || iconPaths['design'];
  $: fillColor = active ? 'var(--accent-primary)' : 'var(--fg-default)';
</script>

<svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path 
    d={path} 
    fill={fillColor}
    stroke={active ? 'var(--accent-primary)' : 'var(--fg-default)'}
    stroke-width="1"
  />
</svg>

<style>
  svg {
    transition: all 0.2s ease;
  }
</style>