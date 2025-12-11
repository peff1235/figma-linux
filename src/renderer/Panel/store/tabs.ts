import { writable } from "svelte/store";

function getDefaultProductIcon(surfaceType: Types.ProductSurfaceType): string {
  const surfaceIcons: Record<string, string> = {
    'design': 'figma-design',
    'figjam': 'figma-figjam', 
    'draw': 'figma-draw',
    'sites': 'figma-sites',
    'make': 'figma-make',
    'buzz': 'figma-buzz',
    'slides': 'figma-slides',
    'dev-mode': 'dev-mode-icon',
    'prototype': 'prototype-icon',
    'community': 'community-icon',
    'recent-files': 'recent-files-icon',
    'login': 'login-icon'
  };
  return surfaceIcons[surfaceType] || 'default-surface';
}

function createTabs() {
  const { subscribe, set, update } = writable<Types.TabFront[]>([]);
  let state: Types.TabFront[] = [];

  subscribe((s) => (state = s));

  return {
    set,
    subscribe,
    addTab: (data: Types.AddTabProps & { surfaceType?: Types.ProductSurfaceType; productIcon?: string; isDevMode?: boolean }) =>
      update((tabs) =>
        [
          ...tabs,
          {
            id: data.id,
            title: data.title ?? "Figma",
            url: data.url,
            moves: false,
            order: data.order ?? tabs.length + 1,
            focused: data.focused,
            isUsingMicrophone: false,
            isInVoiceCall: false,
            loading: true,
            // UI3 metadata
            surfaceType: data.surfaceType ?? 'design',
            productIcon: data.productIcon ?? 'figma-design',
            isDevMode: data.isDevMode ?? false,
          },
        ].sort((a, b) => (a.order > b.order ? 1 : -1)),
      ),
    deleteTab: (id: number) => update((tabs) => tabs.filter((t) => t.id !== id)),
    clear: () => update((tabs) => (tabs = [])),
    updateTab: (tab: Types.TabFront) =>
      update((tabs) =>
        tabs
          .map((t) => (t.id === tab.id ? { ...t, ...tab } : t))
          .sort((a, b) => (a.order > b.order ? 1 : -1)),
      ),
    updateUi3Metadata: (tabId: number, metadata: Partial<Pick<Types.TabFront, 'surfaceType' | 'productIcon' | 'isDevMode'>>) =>
      update((tabs) =>
        tabs
          .map((t) => (t.id === tabId ? { ...t, ...metadata } : t))
          .sort((a, b) => (a.order > b.order ? 1 : -1)),
      ),
    updateSurfaceType: (tabId: number, surfaceType: Types.ProductSurfaceType, productIcon?: string) =>
      update((tabs) =>
        tabs
          .map((t) => 
            t.id === tabId 
              ? { 
                  ...t, 
                  surfaceType,
                  productIcon: productIcon || getDefaultProductIcon(surfaceType)
                } 
              : t
          )
          .sort((a, b) => (a.order > b.order ? 1 : -1)),
      ),
    getTab: (id: number) => state.find((tab) => tab.id === id),
    getTabByTitle: (title: string) => state.find((tab) => tab.title === title),
    getTabsBySurface: (surfaceType: Types.ProductSurfaceType) => state.filter((tab) => tab.surfaceType === surfaceType),
    getDevModeTabs: () => state.filter((tab) => tab.isDevMode),
  };
}

export const tabs = createTabs();
