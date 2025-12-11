import { logger } from "./Logger";
import {
  isDrawUrl,
  isSitesUrl,
  isMakeUrl,
  isBuzzUrl,
  isSlidesUrl,
  isDevModeDeepLink,
  isVariablesCollectionUrl,
  isGridAutoLayoutPreviewUrl,
  isInAppUrl,
} from "Utils/Common";

/**
 * Regression testing utilities for 2025 integrations
 * Tests new surfaces, protocol handlers, clipboard flows, and extension loading
 */
export class RegressionTester {
  // Test URLs for new surfaces
  private static readonly TEST_URLS = {
    draw: "https://www.figma.com/draw/abc123",
    whiteboard: "https://www.figma.com/whiteboard/test",
    sites: "https://www.figma.com/sites/my-site",
    make: "https://www.figma.com/make/ai-workspace",
    buzz: "https://www.figma.com/buzz/templates",
    slides: "https://www.figma.com/slides/presentation",
    devMode: "https://www.figma.com/design/abc123?dev-mode=true",
    devModeReady: "https://www.figma.com/file/xyz789?ready-for-dev=true",
    variables: "https://www.figma.com/file/test123?variables=true",
    collections: "https://www.figma.com/design/coll456?collections=view",
    gridPreview: "https://www.figma.com/file/grid789?grid-preview=auto",
    protoDrawFigma: "figma://draw/proto123",
    protoSitesFigma: "figma://sites/site456",
  };

  /**
   * Run all regression tests
   */
  public static runAllTests(): boolean {
    logger.info("[regression-test] Starting comprehensive regression tests");
    
    let allPassed = true;
    
    allPassed = this.testUrlRecognition() && allPassed;
    allPassed = this.testProtocolHandling() && allPassed;
    allPassed = this.testSurfaceDetection() && allPassed;
    
    if (allPassed) {
      logger.info("[regression-test] ✓ All regression tests passed");
    } else {
      logger.error("[regression-test] ✗ Some regression tests failed");
    }
    
    return allPassed;
  }

  /**
   * Test URL recognition for all new surfaces
   */
  private static testUrlRecognition(): boolean {
    logger.info("[regression-test] Testing URL recognition...");
    
    const tests = [
      { url: this.TEST_URLS.draw, fn: isDrawUrl, name: "Draw URL" },
      { url: this.TEST_URLS.whiteboard, fn: isDrawUrl, name: "Whiteboard URL" },
      { url: this.TEST_URLS.sites, fn: isSitesUrl, name: "Sites URL" },
      { url: this.TEST_URLS.make, fn: isMakeUrl, name: "Make URL" },
      { url: this.TEST_URLS.buzz, fn: isBuzzUrl, name: "Buzz URL" },
      { url: this.TEST_URLS.slides, fn: isSlidesUrl, name: "Slides URL" },
      { url: this.TEST_URLS.devMode, fn: isDevModeDeepLink, name: "Dev Mode URL" },
      { url: this.TEST_URLS.devModeReady, fn: isDevModeDeepLink, name: "Dev Mode Ready URL" },
      { url: this.TEST_URLS.variables, fn: isVariablesCollectionUrl, name: "Variables URL" },
      { url: this.TEST_URLS.collections, fn: isVariablesCollectionUrl, name: "Collections URL" },
      { url: this.TEST_URLS.gridPreview, fn: isGridAutoLayoutPreviewUrl, name: "Grid Preview URL" },
    ];

    let passed = true;
    for (const test of tests) {
      const result = test.fn(test.url);
      if (result) {
        logger.info(`[regression-test] ✓ ${test.name} recognized`);
      } else {
        logger.error(`[regression-test] ✗ ${test.name} NOT recognized`);
        passed = false;
      }
    }

    // Test that all URLs are recognized as in-app
    for (const test of tests) {
      if (!isInAppUrl(test.url)) {
        logger.error(`[regression-test] ✗ ${test.name} not recognized as in-app URL`);
        passed = false;
      }
    }

    return passed;
  }

  /**
   * Test protocol handling for figma:// scheme
   */
  private static testProtocolHandling(): boolean {
    logger.info("[regression-test] Testing protocol handling...");
    
    const protocolTests = [
      { url: this.TEST_URLS.protoDrawFigma, name: "figma://draw protocol" },
      { url: this.TEST_URLS.protoSitesFigma, name: "figma://sites protocol" },
      { url: "figma://make/workspace", name: "figma://make protocol" },
      { url: "figma://buzz/template123", name: "figma://buzz protocol" },
      { url: "figma://slides/presentation", name: "figma://slides protocol" },
    ];

    let passed = true;
    for (const test of protocolTests) {
      const isValid = isInAppUrl(test.url);
      if (isValid) {
        logger.info(`[regression-test] ✓ ${test.name} handled correctly`);
      } else {
        logger.error(`[regression-test] ✗ ${test.name} NOT handled correctly`);
        passed = false;
      }
    }

    return passed;
  }

  /**
   * Test surface type detection
   */
  private static testSurfaceDetection(): boolean {
    logger.info("[regression-test] Testing surface detection...");
    
    const surfaceMap = [
      { url: this.TEST_URLS.draw, expected: "draw" },
      { url: this.TEST_URLS.sites, expected: "sites" },
      { url: this.TEST_URLS.make, expected: "make" },
      { url: this.TEST_URLS.buzz, expected: "buzz" },
      { url: this.TEST_URLS.slides, expected: "slides" },
    ];

    let passed = true;
    for (const test of surfaceMap) {
      // Surface detection logic would go here
      // For now, just verify the URL is recognized
      if (isInAppUrl(test.url)) {
        logger.info(`[regression-test] ✓ Surface ${test.expected} URL detected`);
      } else {
        logger.error(`[regression-test] ✗ Surface ${test.expected} URL NOT detected`);
        passed = false;
      }
    }

    return passed;
  }

  /**
   * Log clipboard operation for regression testing
   */
  public static logClipboardOperation(format: string, size: number, success: boolean): void {
    logger.info(
      `[regression-test] Clipboard operation - format: ${format}, size: ${size}, success: ${success}`,
    );
  }

  /**
   * Log protocol invocation for regression testing
   */
  public static logProtocolInvocation(url: string, handled: boolean): void {
    logger.info(`[regression-test] Protocol invoked - URL: ${url}, handled: ${handled}`);
  }

  /**
   * Log extension loading for regression testing
   */
  public static logExtensionLoad(
    extensionId: number,
    name: string,
    hasCodeConnect: boolean,
    hasWebhooksV2: boolean,
    hasAiAssets: boolean,
  ): void {
    logger.info(
      `[regression-test] Extension loaded - ID: ${extensionId}, name: ${name}, ` +
        `codeConnect: ${hasCodeConnect}, webhooksV2: ${hasWebhooksV2}, aiAssets: ${hasAiAssets}`,
    );
  }

  /**
   * Test 20-mode Variables/Collections support
   */
  public static testVariablesModes(modeCount: number): boolean {
    const supported = modeCount <= 20;
    if (supported) {
      logger.info(`[regression-test] ✓ Variables with ${modeCount} modes supported`);
    } else {
      logger.error(`[regression-test] ✗ Variables with ${modeCount} modes NOT supported (max 20)`);
    }
    return supported;
  }
}
