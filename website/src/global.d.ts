/// <reference types="@sveltejs/kit" />

declare global {
  interface Window {
    hcaptcha: any;
    submitRequest: any;
    dataLayer: any;
    gtag: any;
  }
}
