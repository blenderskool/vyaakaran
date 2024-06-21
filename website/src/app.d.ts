// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
  interface Window {
    hcaptcha: any;
    submitRequest: any;
    submitFeedback: any;
    dataLayer: any;
    gtag: any;
  }
}

export {};
