export {};

declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: any) => void;
    adsbygoogle?: any[];
    googletag?: any;
    _taboola?: any;
    outbrain?: any;
  }
}
