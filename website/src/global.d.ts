/// <reference types="@sveltejs/kit" />

declare global {
  interface Window {
    hcaptcha: any;
    submitRequest: any;
    submitFeedback: any;
    dataLayer: any;
    gtag: any;
  }
}
