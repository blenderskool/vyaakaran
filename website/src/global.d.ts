/// <reference types="@sveltejs/kit" />

declare global {
  interface Window {
    hcaptcha: any;
    submitRequest: any;
  }
}
