<script lang="ts">
  import { browser, dev } from '$app/env';
  import { page } from '$app/stores';
  import Button from '../components/Button.svelte';
  import 'virtual:windi.css';
  
  // enable windi devtools while in development
  if (browser && dev) import('virtual:windi-devtools');

  let mobileMenuOpen = false;

  function handleMobileOpen() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  // Configure Google Analytics
  if (browser && typeof window !== undefined) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-K4KBEY7FZJ');
  }

  if (browser) {
    page.subscribe((value) => {
      mobileMenuOpen = false;

      // Send updated page path to Google analytics
      if (window.gtag !== undefined) {
        window.gtag('config', 'UA-82138003-6', {
          page_path: value.url.pathname,
        });
      }
    });
  }
</script>


<svelte:head>
  <!-- Primary Meta Tags -->
  <meta name="description" content="Visualize automata, parsers and formal languages right on the browser in an easy to use interface with Vyaakaran.">
  <meta name="theme-color" content="#0f172a">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://vyaakaran.vercel.app/">
  <meta property="og:description" content="Visualize automata, parsers and formal languages right on the browser in an easy to use interface with Vyaakaran.">
  <meta property="og:image" content="https://vyaakaran.vercel.app/site-preview.jpg">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://vyaakaran.vercel.app/">
  <meta property="twitter:description" content="Visualize automata, parsers and formal languages right on the browser in an easy to use interface with Vyaakaran.">
  <meta property="twitter:image" content="https://vyaakaran.vercel.app/site-preview.jpg">

  {#if !dev}
    <script async defer src="https://www.googletagmanager.com/gtag/js?id=G-K4KBEY7FZJ"></script>
  {/if}
</svelte:head>

<div class="text-blue-gray-200 bg-blue-gray-900">

  <header class="flex container mx-auto px-8 xl:px-36 pt-8 fixed inset-0 bottom-auto items-center z-50 bg-gradient-to-b from-blue-gray-900 via-blue-gray-900/75 to-transparent text-shadow-md">
    <a href="/" aria-label="Vyaakaran">
      <svg fill="none" class="h-10 text-blue-gray-200 hover:text-cyan-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 274 64">
        <path d="M79.594 18.546h-6.15l9.039 26.182h7.133l9.026-26.182h-6.136l-6.341 19.892h-.243l-6.328-19.892zm25.459 33.545c4.053 0 6.2-2.07 7.313-5.241l7.632-21.733-5.766-.026-4.104 14.42h-.204l-4.066-14.42h-5.727l7.044 20.2-.319.83c-.716 1.841-2.084 1.93-4.002 1.342l-1.227 4.066c.78.332 2.045.562 3.426.562zm22.769-6.993c2.902 0 4.781-1.265 5.74-3.093h.153v2.723h5.165V31.483c0-4.679-3.963-6.647-8.335-6.647-4.705 0-7.799 2.25-8.553 5.83l5.037.408c.371-1.304 1.534-2.263 3.49-2.263 1.854 0 2.915.934 2.915 2.544v.077c0 1.266-1.343 1.432-4.756 1.764-3.886.358-7.376 1.662-7.376 6.047 0 3.887 2.774 5.855 6.52 5.855zm1.559-3.758c-1.675 0-2.876-.78-2.876-2.276 0-1.534 1.265-2.288 3.183-2.557 1.189-.166 3.132-.447 3.784-.882v2.084c0 2.058-1.7 3.63-4.091 3.63zm19.323 3.758c2.902 0 4.782-1.265 5.74-3.093h.154v2.723h5.165V31.483c0-4.679-3.963-6.647-8.336-6.647-4.704 0-7.798 2.25-8.552 5.83l5.037.408c.37-1.304 1.534-2.263 3.49-2.263 1.854 0 2.915.934 2.915 2.544v.077c0 1.266-1.343 1.432-4.756 1.764-3.886.358-7.377 1.662-7.377 6.047 0 3.887 2.775 5.855 6.52 5.855zm1.56-3.758c-1.675 0-2.876-.78-2.876-2.276 0-1.534 1.265-2.288 3.183-2.557 1.189-.166 3.132-.447 3.784-.882v2.084c0 2.058-1.7 3.63-4.091 3.63zm13.724 3.388h5.446v-6.239l1.47-1.675 5.356 7.914h6.38l-7.658-11.135 7.287-8.502h-6.251l-6.29 7.453h-.294V18.546h-5.446v26.182zm26.552.37c2.902 0 4.782-1.265 5.74-3.093h.154v2.723h5.165V31.483c0-4.679-3.964-6.647-8.336-6.647-4.704 0-7.798 2.25-8.552 5.83l5.037.408c.37-1.304 1.534-2.263 3.49-2.263 1.853 0 2.915.934 2.915 2.544v.077c0 1.266-1.343 1.432-4.756 1.764-3.887.358-7.377 1.662-7.377 6.047 0 3.887 2.775 5.855 6.52 5.855zm1.56-3.758c-1.675 0-2.876-.78-2.876-2.276 0-1.534 1.265-2.288 3.183-2.557 1.189-.166 3.132-.447 3.784-.882v2.084c0 2.058-1.7 3.63-4.091 3.63zm13.724 3.388h5.446v-11.11c0-2.416 1.764-4.078 4.167-4.078.755 0 1.79.128 2.301.294v-4.832a8.169 8.169 0 00-1.713-.192c-2.198 0-4.001 1.278-4.717 3.707h-.204v-3.426h-5.28v19.637zm19.767.37c2.902 0 4.781-1.265 5.74-3.093h.154v2.723h5.164V31.483c0-4.679-3.963-6.647-8.335-6.647-4.704 0-7.798 2.25-8.552 5.83l5.036.408c.371-1.304 1.535-2.263 3.491-2.263 1.853 0 2.914.934 2.914 2.544v.077c0 1.266-1.342 1.432-4.755 1.764-3.887.358-7.377 1.662-7.377 6.047 0 3.887 2.774 5.855 6.52 5.855zm1.56-3.758c-1.675 0-2.877-.78-2.877-2.276 0-1.534 1.266-2.288 3.184-2.557 1.188-.166 3.132-.447 3.784-.882v2.084c0 2.058-1.701 3.63-4.091 3.63zm19.169-7.965c.013-2.53 1.522-4.014 3.721-4.014 2.186 0 3.503 1.432 3.49 3.835v11.532h5.446V32.225c0-4.577-2.685-7.39-6.776-7.39-2.915 0-5.024 1.432-5.906 3.72h-.23v-3.464h-5.191v19.637h5.446V33.375z" fill="currentColor"/>
        <path d="M38.928 47.1c3.602 0 5.511-1.84 6.5-4.659l6.784-19.318-5.125-.023-3.648 12.818h-.182L39.644 23.1h-5.091l6.261 17.955-.284.738c-.636 1.637-1.852 1.716-3.557 1.194l-1.09 3.613c.692.296 1.817.5 3.045.5z" fill="#67E8F9"/>
        <path d="M55.699 16.9v4.032h-27.13v20.124h-5.111v-4.86c-1.32 1.176-2.988 1.764-5.004 1.764-2.208 0-4.068-.66-5.58-1.98-1.488-1.32-2.232-3.132-2.232-5.436 0-2.208.732-4.032 2.196-5.472 1.488-1.464 3.432-2.196 5.832-2.196.96 0 1.8.096 2.52.288v4.392c-.816-.216-1.524-.324-2.124-.324-.936 0-1.716.288-2.34.864-.624.576-.936 1.344-.936 2.304 0 1.128.312 2.004.936 2.628.648.6 1.572.9 2.772.9.96 0 1.86-.312 2.7-.936.84-.648 1.26-1.452 1.26-2.412v-9.648H8.302V16.9h47.397z" fill="currentColor"/>
      </svg>
    </a>
    <nav class="hidden space-x-4 items-center justify-between flex-1 ml-6 font-medium lg:flex">
      <div>
        <a class="px-4 py-3 hover:text-cyan-300" href="/#features">
          Features
        </a>
        <a class="px-4 py-3 hover:text-cyan-300" href="/docs/syntax">
          Syntax
        </a>
        <a class="px-4 py-3 hover:text-cyan-300" href="https://akashhamirwasia.com/blog/vyaakaran" target="_blank" rel="external">
          How it works
        </a>
      </div>
      <Button as="a" href="https://vyaakaran.vercel.app/playground/" rel="external">
        Launch Editor
        <svg xmlns="http://www.w3.org/2000/svg" class="-mt-0.5 inline h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
        </svg>
      </Button>
    </nav>
    <button
      class="ml-auto p-2 -mr-4 focus:ring-2 focus:outline-none rounded focus:ring-cyan-600 lg:hidden"
      on:click={handleMobileOpen}
      aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
    >
      {#if mobileMenuOpen}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      {/if}
    </button>
    {#if mobileMenuOpen}
      <nav class="absolute top-24 left-4 right-4 bg-20 flex flex-col px-8 py-12 rounded-lg bg-blue-gray-800 border border-blue-gray-700 bg-opacity-80 backdrop-filter backdrop-blur-md shadow-2xl space-y-3 lg:hidden">
        <a class="pb-3 hover:text-cyan-300" href="/#features">
          Features
        </a>
        <a class="py-3 hover:text-cyan-300" href="/docs/syntax">
          Syntax
        </a>
        <a class="py-3 hover:text-cyan-300" href="https://akashhamirwasia.com/blog/vyaakaran" target="_blank" rel="external">
          How it works
        </a>
        <div class="pt-6">
          <Button as="a" href="https://vyaakaran.vercel.app/playground/" rel="external">
            Launch Editor
            <svg xmlns="http://www.w3.org/2000/svg" class="-mt-0.5 inline h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
          </Button>
        </div>
      </nav>
    {/if}
  </header>

  <main class="pt-40 lg:pt-36 relative overflow-x-hidden">
    <slot />
  </main>

  <footer class="container mx-auto px-8 xl:px-36 pb-10 flex flex-col items-center justify-between text-center md:flex-row">
    <div>
      <img src="/vyaakaran-icon.png" class="h-10 filter drop-shadow-lg" alt="Vyaakaran icon" />
    </div>

    <div class="text-sm mt-6 md:mt-0">
      A side project designed & developed by
      <a href="https://akashhamirwasia.com" target="_blank" class="text-cyan-300 font-medium">
        Akash Hamirwasia
      </a>
    </div>
  </footer>

</div>

<style global>
  :root {
    color-scheme: dark;
  }

  .hljs-terminal {
    color: #67e8f9;
    font-style: italic;
    font-weight: 600;
  }
  .hljs-non-terminal {
    color: rgb(226, 232, 240);
    font-weight: 500;
  }
  .hljs-separator {
    color: #64748b;
  }
  .hljs-operator, .hljs-comment {
    color: #64748b;
  }
  .hljs-keyword {
    color: #0891b2;
    font-weight: 600;
  }

  .bg-pattern {
    background-color: #0f172a;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%23334155' fill-opacity='0.41' fill-rule='evenodd'/%3E%3C/svg%3E");
  }
</style>