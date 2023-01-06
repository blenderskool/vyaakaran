<template>
  <div>
    <router-view />

    <!-- Phones unsupported message -->
    <div class="fixed inset-0 z-50 bg-gray-900 flex flex-col justify-center p-8 md:hidden">
      <div class="mb-auto" />
      <div class="filter saturate-0 opacity-70 text-3xl -ml-1">
        📵
      </div>
      <h1 class="text-2xl font-semibold mt-4">Oops, this screen is too small!</h1>
      <p class="mt-4 text-gray-500">
        Vyaakaran editor does not work on mobile phones. Try switching to a laptop or desktop instead. 💻
      </p>

      <div class="mt-auto">
        <svg fill="none" class="h-10 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 274 64">
          <path
            d="M79.594 18.546h-6.15l9.039 26.182h7.133l9.026-26.182h-6.136l-6.341 19.892h-.243l-6.328-19.892zm25.459 33.545c4.053 0 6.2-2.07 7.313-5.241l7.632-21.733-5.766-.026-4.104 14.42h-.204l-4.066-14.42h-5.727l7.044 20.2-.319.83c-.716 1.841-2.084 1.93-4.002 1.342l-1.227 4.066c.78.332 2.045.562 3.426.562zm22.769-6.993c2.902 0 4.781-1.265 5.74-3.093h.153v2.723h5.165V31.483c0-4.679-3.963-6.647-8.335-6.647-4.705 0-7.799 2.25-8.553 5.83l5.037.408c.371-1.304 1.534-2.263 3.49-2.263 1.854 0 2.915.934 2.915 2.544v.077c0 1.266-1.343 1.432-4.756 1.764-3.886.358-7.376 1.662-7.376 6.047 0 3.887 2.774 5.855 6.52 5.855zm1.559-3.758c-1.675 0-2.876-.78-2.876-2.276 0-1.534 1.265-2.288 3.183-2.557 1.189-.166 3.132-.447 3.784-.882v2.084c0 2.058-1.7 3.63-4.091 3.63zm19.323 3.758c2.902 0 4.782-1.265 5.74-3.093h.154v2.723h5.165V31.483c0-4.679-3.963-6.647-8.336-6.647-4.704 0-7.798 2.25-8.552 5.83l5.037.408c.37-1.304 1.534-2.263 3.49-2.263 1.854 0 2.915.934 2.915 2.544v.077c0 1.266-1.343 1.432-4.756 1.764-3.886.358-7.377 1.662-7.377 6.047 0 3.887 2.775 5.855 6.52 5.855zm1.56-3.758c-1.675 0-2.876-.78-2.876-2.276 0-1.534 1.265-2.288 3.183-2.557 1.189-.166 3.132-.447 3.784-.882v2.084c0 2.058-1.7 3.63-4.091 3.63zm13.724 3.388h5.446v-6.239l1.47-1.675 5.356 7.914h6.38l-7.658-11.135 7.287-8.502h-6.251l-6.29 7.453h-.294V18.546h-5.446v26.182zm26.552.37c2.902 0 4.782-1.265 5.74-3.093h.154v2.723h5.165V31.483c0-4.679-3.964-6.647-8.336-6.647-4.704 0-7.798 2.25-8.552 5.83l5.037.408c.37-1.304 1.534-2.263 3.49-2.263 1.853 0 2.915.934 2.915 2.544v.077c0 1.266-1.343 1.432-4.756 1.764-3.887.358-7.377 1.662-7.377 6.047 0 3.887 2.775 5.855 6.52 5.855zm1.56-3.758c-1.675 0-2.876-.78-2.876-2.276 0-1.534 1.265-2.288 3.183-2.557 1.189-.166 3.132-.447 3.784-.882v2.084c0 2.058-1.7 3.63-4.091 3.63zm13.724 3.388h5.446v-11.11c0-2.416 1.764-4.078 4.167-4.078.755 0 1.79.128 2.301.294v-4.832a8.169 8.169 0 00-1.713-.192c-2.198 0-4.001 1.278-4.717 3.707h-.204v-3.426h-5.28v19.637zm19.767.37c2.902 0 4.781-1.265 5.74-3.093h.154v2.723h5.164V31.483c0-4.679-3.963-6.647-8.335-6.647-4.704 0-7.798 2.25-8.552 5.83l5.036.408c.371-1.304 1.535-2.263 3.491-2.263 1.853 0 2.914.934 2.914 2.544v.077c0 1.266-1.342 1.432-4.755 1.764-3.887.358-7.377 1.662-7.377 6.047 0 3.887 2.774 5.855 6.52 5.855zm1.56-3.758c-1.675 0-2.877-.78-2.877-2.276 0-1.534 1.266-2.288 3.184-2.557 1.188-.166 3.132-.447 3.784-.882v2.084c0 2.058-1.701 3.63-4.091 3.63zm19.169-7.965c.013-2.53 1.522-4.014 3.721-4.014 2.186 0 3.503 1.432 3.49 3.835v11.532h5.446V32.225c0-4.577-2.685-7.39-6.776-7.39-2.915 0-5.024 1.432-5.906 3.72h-.23v-3.464h-5.191v19.637h5.446V33.375z"
            fill="currentColor"
          />
          <path
            d="M38.928 47.1c3.602 0 5.511-1.84 6.5-4.659l6.784-19.318-5.125-.023-3.648 12.818h-.182L39.644 23.1h-5.091l6.261 17.955-.284.738c-.636 1.637-1.852 1.716-3.557 1.194l-1.09 3.613c.692.296 1.817.5 3.045.5z"
            fill="#737373"
          />
          <path
            d="M55.699 16.9v4.032h-27.13v20.124h-5.111v-4.86c-1.32 1.176-2.988 1.764-5.004 1.764-2.208 0-4.068-.66-5.58-1.98-1.488-1.32-2.232-3.132-2.232-5.436 0-2.208.732-4.032 2.196-5.472 1.488-1.464 3.432-2.196 5.832-2.196.96 0 1.8.096 2.52.288v4.392c-.816-.216-1.524-.324-2.124-.324-.936 0-1.716.288-2.34.864-.624.576-.936 1.344-.936 2.304 0 1.128.312 2.004.936 2.628.648.6 1.572.9 2.772.9.96 0 1.86-.312 2.7-.936.84-.648 1.26-1.452 1.26-2.412v-9.648H8.302V16.9h47.397z"
            fill="currentColor"
          />
      </svg>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    // Configure Google Analytics
    if (import.meta.env.PROD && typeof window !== undefined) {
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-K4KBEY7FZJ';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-K4KBEY7FZJ');
    }
  }
});
</script>

<style>
  body {
    @apply bg-zinc-800 font-sans text-steel-blue-100 overflow-hidden;
  }

  button {
    @apply bg-transparent cursor-pointer inline-flex items-center justify-center text-sm;
  }
  .secondary-btn {
    @apply py-0.5 px-4 bg-cool-gray-400 bg-opacity-10 text-xs font-semibold cursor-pointer select-none rounded shadow
    @apply border border-solid border-cool-gray-500 transition;
    @apply hover:bg-opacity-20 focus:outline-none disabled:(opacity-50 cursor-not-allowed);
  }

  input {
    @apply font-sans font-medium;
  }

  *::-webkit-scrollbar {
    @apply w-2 h-2;
  }

  *::-webkit-scrollbar-track {
    @apply bg-transparent;
  }

  *::-webkit-scrollbar-thumb {
    @apply bg-steel-blue-100 bg-opacity-20;
  }

  .splitpanes__splitter:active::after {
    @apply bg-blue-gray-600 shadow;
  }

  .splitpanes--vertical > .splitpanes__splitter {
    min-width: 11px !important;
  }

  .splitpanes--horizontal > .splitpanes__splitter {
    @apply relative;
    min-height: 11px !important;
  }
  .splitpanes--horizontal > .splitpanes__splitter::after {
    @apply absolute left-0 top-1 right-0 h-px bg-cool-gray-600 transition;
    content: '';
  }

  .editor-console-split > .splitpanes__splitter {
    @apply bg-zinc-900;
  }

  .hljs-terminal {
    @apply text-cyan-300 italic;
  }
  .hljs-separator {
    @apply text-blue-gray-600;
  }
  .hljs-operator {
    @apply text-steel-blue-500;
  }
  .hljs-keyword {
    @apply text-cyan-600 font-semibold;
  }
</style>