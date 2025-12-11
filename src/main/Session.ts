import { session, Event, Cookie, app, dialog } from "electron";

import * as Const from "Const";
import { logger } from "./Logger";
import { isSameCookieDomain } from "Utils/Main";
import { storage } from "./Storage";

export default class Session {
  private _hasFigmaSession: boolean;
  private assessSessionTimer: NodeJS.Timer;
  private patExpiryCheckInterval: NodeJS.Timeout | null;

  constructor() {
    this._hasFigmaSession = null;
    this.assessSessionTimer = null;
    this.patExpiryCheckInterval = null;
  }

  public get hasFigmaSession() {
    return this._hasFigmaSession;
  }

  public handleAppReady = () => {
    session.defaultSession.setPermissionRequestHandler((_, permission, callback) => {
      const whitelist = ["fullscreen", "pointerLock", "clipboard-read", "clipboard-sanitized-write"];
      callback(whitelist.includes(permission));
    });

    const defaultUserAgent = session.defaultSession.getUserAgent();
    const userAgent = defaultUserAgent.replace(/Figma([^/]+)\/([^\s]+)/, "Figma$1/$2 Figma/$2");

    session.defaultSession.setUserAgent(userAgent);
    session.defaultSession.cookies
      .get({
        url: Const.HOMEPAGE,
      })
      .then((cookies) => {
        this._hasFigmaSession = !!cookies.find((cookie) => {
          return cookie.name === Const.FIGMA_SESSION_COOKIE_NAME;
        });

        logger.info("[wm] already signed in?", this._hasFigmaSession);

        // Start PAT expiry monitoring
        this.startPatExpiryMonitoring();
      })
      .catch((error: Error) =>
        logger.warn("[wm] failed to get cookies during handleAppReady:", Const.HOMEPAGE, error),
      );
  };

  // Track Personal Access Token (PAT) issuance and warn before 90-day expiry
  public trackPatIssuance() {
    const now = Date.now();
    if (!storage.settings.patIssuedAt) {
      storage.settings.patIssuedAt = now;
      storage.save();
      logger.info("[session] PAT issuance tracked at", new Date(now).toISOString());
    }
  }

  private startPatExpiryMonitoring() {
    // Check every 24 hours for PAT expiry
    this.patExpiryCheckInterval = setInterval(() => {
      this.checkPatExpiry();
    }, 24 * 60 * 60 * 1000);

    // Check immediately on startup
    this.checkPatExpiry();
  }

  private checkPatExpiry() {
    if (!storage.settings.patIssuedAt) {
      return;
    }

    const now = Date.now();
    const patAge = now - storage.settings.patIssuedAt;
    const daysRemaining = Math.floor((90 * 24 * 60 * 60 * 1000 - patAge) / (24 * 60 * 60 * 1000));

    logger.info(`[session] PAT expiry check: ${daysRemaining} days remaining`);

    // Warn at 14 days, 7 days, 3 days, and 1 day before expiry
    if (daysRemaining === 14 || daysRemaining === 7 || daysRemaining === 3 || daysRemaining === 1) {
      this.warnPatExpiry(daysRemaining);
    } else if (daysRemaining <= 0) {
      this.handlePatExpired();
    }
  }

  private warnPatExpiry(daysRemaining: number) {
    logger.warn(`[session] PAT expires in ${daysRemaining} days`);
    dialog.showMessageBox({
      type: "warning",
      title: "Personal Access Token Expiring Soon",
      message: `Your personal access token will expire in ${daysRemaining} day${daysRemaining > 1 ? "s" : ""}.`,
      detail: "Please visit Figma settings to regenerate your token to maintain access to clipboard and protocol features.",
      buttons: ["OK"],
    });
  }

  private async handlePatExpired() {
    logger.error("[session] PAT has expired - clearing session");
    
    try {
      await Promise.all([
        session.defaultSession.clearStorageData(),
        session.defaultSession.clearCache(),
      ]);
      
      // Reset PAT tracking
      storage.settings.patIssuedAt = null;
      storage.save();
      
      this._hasFigmaSession = false;
      
      dialog.showMessageBox({
        type: "error",
        title: "Personal Access Token Expired",
        message: "Your personal access token has expired.",
        detail: "Session data has been cleared. Please log in again and regenerate your token.",
        buttons: ["OK"],
      });
      
      app.emit("signOut");
    } catch (error) {
      logger.error("[session] Error handling PAT expiry:", error);
    }
  }

  public stopMonitoring() {
    if (this.patExpiryCheckInterval) {
      clearInterval(this.patExpiryCheckInterval);
      this.patExpiryCheckInterval = null;
    }
  }
}
