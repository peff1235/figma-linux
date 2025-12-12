import { parse } from "url";
import {
  app,
  shell,
  Rectangle,
  WebContents,
  BrowserView,
  BrowserWindow,
  HandlerDetails,
  DidCreateWindowDetails,
  BrowserViewConstructorOptions,
} from "electron";

import { preloadScriptPathDev, preloadScriptPathProd } from "Utils/Main";
import {
  isDev,
  isFigmaUrl,
  isValidProjectLink,
  isPrototypeUrl,
  isAppAuthRedeem,
  isFigmaDocLink,
  isInAppUrl,
} from "Utils/Common";
import { dialogs } from "Main/Dialogs";
import { logger } from "Main/Logger";

export default class Tab {
  public id: number;
  public title?: string;
  public url?: string;
  public moves?: boolean;
  public fileKey?: string;
  public isUsingMicrophone?: boolean;
  public isInVoiceCall?: boolean;
  public view: BrowserView;
  // UI3 metadata
  public metadata?: Types.Ui3TabMetadata;

  constructor(private windowId: number) {
    this.initTab();
    this.registerEvents();
  }

  public loadUrl(url: string) {
    this.url = url;
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
        contextIsolation: true,
        sandbox: true,
        zoomFactor: 1,
        preload: isDev ? preloadScriptPathDev : preloadScriptPathProd,
        spellcheck: true,
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      } as any,
    };

    this.view = new BrowserView(options);
    this.id = this.view.webContents.id;

    this.setAutosize(true);

    app.emit("requestBoundsForTabView", this.windowId);
  }

  public updateScale(scale: number) {
    this.view.webContents.setZoomFactor(scale);
  }
  public reloadCurrentTheme() {
    app.emit("reloadCurrentTheme");
  }

  private onDomReady(event: any) {
    this.reloadCurrentTheme();
  }
  private onMainWindowWillNavigate(event: any, newUrl: string) {
    const currentUrl = event.sender.getURL();

    if (isAppAuthRedeem(newUrl)) {
      return;
    }

    if (newUrl === currentUrl) {
      event.preventDefault();
      return;
    }

    if (isFigmaDocLink(newUrl)) {
      shell.openExternal(newUrl);

      event.preventDefault();
      return;
    }

    const from = parse(currentUrl);
    const to = parse(newUrl);

    if (from.pathname === "/login") {
      // TODO:
      // this.tabManager.reloadAll();

      event.preventDefault();
      return;
    }

    if (to.pathname === "/logout") {
      app.emit("signOut");
    }

    if (to.search && to.search.match(/[\?\&]redirected=1/)) {
      event.preventDefault();
      return;
    }
  }
  private onNewWindow(window: BrowserWindow, details: DidCreateWindowDetails) {
    const url = details.url;
    logger.debug("newWindow, url: ", url);

    if (/start_google_sso/.test(url)) return;

    if (isInAppUrl(url)) {
      app.emit("openUrlInNewTab", url);
      return;
    }

    shell.openExternal(url);
  }

  private permissionHandler(
    webContents: WebContents,
    permission:
      | "clipboard-read"
      | "clipboard-sanitized-write"
      | "display-capture"
      | "fullscreen"
      | "geolocation"
      | "idle-detection"
      | "media"
      | "mediaKeySystem"
      | "midi"
      | "midiSysex"
      | "notifications"
      | "pointerLock"
      | "openExternal"
      | "window-management"
      | "unknown",
    callback: (permissionGranted: boolean) => void,
  ) {
    const allowByDefault = [
      "fullscreen",
      "pointerLock",
      "clipboard-read",
      "clipboard-write",
      "clipboard-sanitized-write",
    ];

    if (allowByDefault.includes(permission)) {
      return callback(true);
    }

    if (permission === "media") {
      if (this.isUsingMicrophone) {
        return callback(true);
      }

      const id = dialogs.showMessageBoxSync({
        type: "question",
        title: "Figma",
        message: "Microphone access required for voice call.",
        detail: `Allow microphone access?`,
        textOkButton: "Allow",
        textCancelButton: "Deny",
        defaultFocusedButton: "Ok",
      });

      if (id === 0) {
        this.isUsingMicrophone = true;

        return callback(true);
      }
    }

    return callback(false);
  }

  private windowOpenHandler(details: HandlerDetails) {
    const { url } = details;

    if (isInAppUrl(url)) {
      app.emit("openUrlInNewTab", url);
    } else {
      shell.openExternal(url);
    }

    return { action: "deny" };
  }

  // UI3 Surface and Metadata Management
  public openProductSurface(surfaceType: string, args: any) {
    // Update internal metadata first
    if (!this.metadata) {
      this.metadata = this.createDefaultMetadata();
    }
    
    this.metadata.surfaceType = surfaceType as Types.ProductSurfaceType;
    
    // Forward to web contents
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

  // Enhanced UI3 Methods
  public requestAiCredits(request: any) {
    this.view.webContents.send("requestAiCredits", request);
  }

  public exportVariables(variables: any) {
    this.view.webContents.send("exportVariables", variables);
    
    // Update metadata
    if (this.metadata) {
      this.metadata.hasVariables = true;
    }
  }

  public devModeReady(ready: boolean) {
    this.view.webContents.send("devModeReady", ready);
    
    // Update metadata
    if (this.metadata) {
      this.metadata.isDevMode = ready;
    }
  }

  public webhooksV2Update(update: any) {
    this.view.webContents.send("webhooksV2Update", update);
  }

  // UI3 Voice and Component Tracking
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
      surfaceType: 'design',
      productIcon: 'figma-design',
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
    this.view.webContents.on("will-navigate", this.onMainWindowWillNavigate.bind(this));
    this.view.webContents.on("dom-ready", this.onDomReady.bind(this));
    this.view.webContents.on("did-create-window", this.onNewWindow.bind(this));

    this.view.webContents.session.setPermissionRequestHandler(this.permissionHandler.bind(this));
  }
}
