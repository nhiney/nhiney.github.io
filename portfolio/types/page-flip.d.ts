// Ambient types for `page-flip` (StPageFlip). The published package ships a
// prebuilt UMD/ESM bundle but no .d.ts, so we declare just the slice of the API
// the FlipBookReader uses. Keep in sync with node_modules/page-flip/src.
declare module "page-flip" {
  export type SizeType = "fixed" | "stretch";

  export interface FlipSetting {
    startPage: number;
    size: SizeType;
    width: number;
    height: number;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    drawShadow: boolean;
    flippingTime: number;
    usePortrait: boolean;
    startZIndex: number;
    autoSize: boolean;
    maxShadowOpacity: number;
    showCover: boolean;
    mobileScrollSupport: boolean;
    clickEventForward: boolean;
    useMouseEvents: boolean;
    swipeDistance: number;
    showPageCorners: boolean;
    disableFlipByClick: boolean;
  }

  export interface WidgetEvent {
    data: number | string | boolean | object;
    object: PageFlip;
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: Partial<FlipSetting>);
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    updateFromHtml(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    update(): void;
    clear(): void;
    destroy(): void;
    turnToNextPage(): void;
    turnToPrevPage(): void;
    turnToPage(page: number): void;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    flip(page: number, corner?: "top" | "bottom"): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    getOrientation(): "portrait" | "landscape";
    on(eventName: "flip" | "changeOrientation" | "changeState" | "init", cb: (e: WidgetEvent) => void): PageFlip;
    off(eventName: string): void;
  }
}
