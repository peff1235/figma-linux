import * as Url from "url";
import { PROTOCOL, HOMEPAGE } from "Const";

export const isPrototypeUrl = (url: string): boolean =>
  /figma\.com\/proto\/.+\/.+?node-id=.+/.test(url);

export const isCommunityUrl = (url: string): boolean => /figma\.com\/community\/.+/.test(url);
export const isFigmaUrl = (url: string): boolean =>
  /^(https?:\/\/w{0,3}?\.?figma\.com\/.*)/.test(url);

// New surface type URL helpers for UI3 integration
export const isDrawUrl = (url: string): boolean =>
  /^(figma:\/\/|https?:\/\/w{0,3}?\.?figma\.com\/(draw|whiteboard))/.test(url);

export const isSitesUrl = (url: string): boolean =>
  /^(figma:\/\/|https?:\/\/w{0,3}?\.?figma\.com\/sites)/.test(url);

export const isMakeUrl = (url: string): boolean =>
  /^(figma:\/\/|https?:\/\/w{0,3}?\.?figma\.com\/make)/.test(url);

export const isBuzzUrl = (url: string): boolean =>
  /^(figma:\/\/|https?:\/\/w{0,3}?\.?figma\.com\/buzz)/.test(url);

export const isSlidesUrl = (url: string): boolean =>
  /^(figma:\/\/|https?:\/\/w{0,3}?\.?figma\.com\/slides)/.test(url);

export const isGridAutoLayoutPreviewUrl = (url: string): boolean =>
  /figma\.com\/(file|design|proto)\/.*[\?&]grid-preview=/.test(url);

export const isDevModeDeepLink = (url: string): boolean =>
  /^(figma:\/\/|https?:\/\/w{0,3}?\.?figma\.com\/(file|design))\/.*[\?&](dev-mode=true|mode=dev|ready-for-dev=true)/.test(url);

export const isVariablesCollectionUrl = (url: string): boolean =>
  /figma\.com\/(file|design)\/.*[\?&](variables|collections|modes)=/.test(url);

export const isFigmaProtocolUrl = (url: string): boolean => {
  const regex = new RegExp(`^${PROTOCOL}://.+`);

  return regex.test(url);
};

export const parseURL = (url: string): URL | undefined => {
  try {
    return new URL(url);
  } catch (_a) {}
  return undefined;
};

export const normalizeUrl = (url: string): string => {
  if (!isFigmaProtocolUrl(url)) {
    return url;
  }

  const replaceRegExp = new RegExp(`^${PROTOCOL}:/`);

  return url.replace(replaceRegExp, HOMEPAGE);
};

export const getParsedUrl = (data: string): Url.UrlWithStringQuery => {
  let url = data;

  if (isFigmaProtocolUrl(url)) {
    url = normalizeUrl(url);
  }

  return Url.parse(url);
};

export const isAppAuthGrandLink = (url: string) => /\/app_auth\/.*\/grant/.test(url);
export const isAppAuthRedeem = (url: string) => /\/app_auth\/redeem\?g_secret=.+/.test(url);

export const isAppAuthLink = (url: string) => /figma:\/\/app_auth\/redeem\?g_secret=.*/.test(url);

export const isRecentFilesLink = (url: string) =>
  /^(figma:\/\/|https?:\/\/w{0,3}?\.?figma\.com\/files\/recent)/.test(url);

export const isValidProjectLink = (url: string) =>
  /^(figma:\/\/|https?:\/\/w{0,3}?\.?figma\.com\/file\/)/.test(url);

export const isValidFigjamLink = (url: string) =>
  /^(figma:\/\/|https?:\/\/w{0,3}?\.?figma\.com\/(jam|board))/.test(url);

export const isFigmaDocLink = (url: string) =>
  /^https:\/\/w{0,3}?.figma.com\/plugin-docs/.test(url);
export const isFigmaBoardLink = (url: string) =>
  /^https:\/\/w{0,3}?.figma.com\/board/.test(url);
export const isFigmaDesignLink = (url: string) =>
  /^https:\/\/w{0,3}?.figma.com\/design/.test(url);

// Comprehensive check for all in-app URL types that should open in tabs
export const isInAppUrl = (url: string): boolean =>
  isValidProjectLink(url) ||
  isValidFigjamLink(url) ||
  isPrototypeUrl(url) ||
  isFigmaBoardLink(url) ||
  isFigmaDesignLink(url) ||
  isDrawUrl(url) ||
  isSitesUrl(url) ||
  isMakeUrl(url) ||
  isBuzzUrl(url) ||
  isSlidesUrl(url) ||
  isGridAutoLayoutPreviewUrl(url) ||
  isDevModeDeepLink(url) ||
  isVariablesCollectionUrl(url);
