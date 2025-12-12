import {
  app,
  shell,
  BrowserView,
  BrowserViewConstructorOptions,
  Rectangle,
  HandlerDetails,
} from "electron";

import { preloadScriptPathDev, preloadScriptPathProd, toggleDetachedDevTools } from "Utils/Main";
import {
  isDev,
  isValidProjectLink,
  isPrototypeUrl,
  isRecentFilesLink,
  isFigmaUrl,
  isValidFigjamLink,
} from "Utils/Common";
import { storage } from "Main/Storage";
import { logger } from "Main/Logger";

export default class CommunityTab {
  public userId: string;
  public id: number;
  public view: BrowserView;
  // UI3 metadata
  public metadata?: Types.Ui3TabMetadata;

  constructor(private windowId: number) {
    this.userId = storage.settings.userId;

    this.initTab();
    this.registerEvents();
  }

  public loadUrl(url: string) {
    this.view.webContents.loadURL(url);
  }
  public getUrl() {
    return this.view.webContents.getURL();
  }
  public setAutosize(flag: boolean) {
    this.view.setAutoResize({
      width: flag,
      height: flag,
      horizontal: flag,
      vertical: flag,
    });
  }
  public setBounds(bounds: Rectangle) {
    this.view.setBounds(bounds);
  }

  private initTab() {
    const options: BrowserViewConstructorOptions = {
      webPreferences: {
        nodeIntegration: false,
        webgl: true,
        contextIsolation: false,
        zoomFactor: 1,
        preload: isDev ? preloadScriptPathDev : preloadScriptPathProd,
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      } as any,
    };

    this.view = new BrowserView(options);
    this.id = this.view.webContents.id;

    this.setAutosize(true);

    isDev && toggleDetachedDevTools(this.view.webContents);

    app.emit("requestBoundsForTabView", this.windowId);
  }

  public updateScale(scale: number) {
    this.view.webContents.setZoomFactor(scale);
  }
  public reloadCurrentTheme() {
    app.emit("reloadCurrentTheme");
  }
  public loadTheme(theme: Themes.Theme) {
    this.view.webContents.send("loadCurrentTheme", theme);
  }

  private onCommunityTabWillNavigate(event: Event, url: string) {
    if (isFigmaUrl(url) && !isRecentFilesLink(url)) {
      return;
    }

    event.preventDefault();

    if (isRecentFilesLink(url)) {
      app.emit("openFileBrowser");
      return;
    }

    shell.openExternal(url);
  }
  private onDomReady(event: any) {
    this.reloadCurrentTheme();
  }
  private windowOpenHandler(details: HandlerDetails) {
    const url = details.url;

    if (isPrototypeUrl(url) || isValidProjectLink(url) || isValidFigjamLink(url)) {
      app.emit("openUrlFromCommunity", url);
      return { action: "deny" };
    }

    shell.openExternal(url);

    return { action: "deny" };
    }

  // UI3 specific methods
  public openProductSurface(surfaceType: string, args: any) {
    if (!this.metadata) {
      this.metadata = this.createDefaultMetadata();
    }
    this.metadata.surfaceType = surfaceType as Types.ProductSurfaceType;
    this.view.webContents.send("openProductSurface", surfaceType, args);
  }

  public setBottomNavState(state: Types.BottomNavState) {
    if (!this.metadata) {
      this.metadata = this.createDefaultMetadata();
    }
    this.metadata.bottomNavState = state;
    this.view.webContents.send("setBottomNavState", state);
  }

  public updateSurfaceMetadata(metadata: Types.Ui3TabMetadata) {
    if (!this.metadata) {
      this.metadata = this.createDefaultMetadata();
    }
    this.metadata = { ...this.metadata, ...metadata };
  }

  public updateBottomNavFocus(focusIndex: number) {
    if (this.metadata?.bottomNavState) {
      this.metadata.bottomNavState.focusIndex = focusIndex;
    }
  }

  public requestAiCredits(request: any) {
    this.view.webContents.send("requestAiCredits", request);
  }

  public exportVariables(variables: any) {
    this.view.webContents.send("exportVariables", variables);
    if (this.metadata) {
      this.metadata.hasVariables = true;
    }
  }

  public devModeReady(ready: boolean) {
    this.view.webContents.send("devModeReady", ready);
    if (this.metadata) {
      this.metadata.isDevMode = ready;
    }
  }

  public webhooksV2Update(update: any) {
    this.view.webContents.send("webhooksV2Update", update);
  }

  public updateVoiceState(active: boolean, participants: number = 0) {
    if (!this.metadata) {
      this.metadata = this.createDefaultMetadata();
    }
    this.metadata.voiceIndicators = {
      active,
      participants
    };
  }

  public updateComponentState(hasComponents: boolean) {
    if (this.metadata) {
      this.metadata.hasComponents = hasComponents;
    }
  }

  private createDefaultMetadata(): Types.Ui3TabMetadata {
    return {
      surfaceType: 'community',
      productIcon: 'figma-community',
      isDevMode: false,
      hasVariables: false,
      hasComponents: false,
      voiceIndicators: {
        active: false,
        participants: 0
      }
    };
  }

    private registerEvents() {
    this.view.webContents.setWindowOpenHandler(this.windowOpenHandler.bind(this));
    this.view.webContents.on("will-navigate", this.onCommunityTabWillNavigate.bind(this));
    this.view.webContents.on("dom-ready", this.onDomReady.bind(this));
  }
}
