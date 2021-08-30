<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    // Configure Google Analytics
    if (import.meta.env.PROD && typeof window !== undefined) {
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-82138003-6';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {window.dataLayer.push(arguments);}
      window.gtag('js', new Date());
      window.gtag('config', 'UA-82138003-6');
    }
  }
});
</script>

<style>
  :root {
    --white-rgb: 255, 255, 255;
    --blue-gray-500: #475569;
    --cool-gray-500: #6B7280;
    --cool-gray-600: #444c55;
    --gray-800: #27272A;
    --gray-900: #18181B;
    --black: #000000;
    --black-rgb: 0, 0, 0;

    --green-400: #34D399;

    --cyan-300: #67E8F9;
    --cyan-300-rgb: 56, 189, 248;
    --cyan-400: #22D3EE;
    --cyan-500: #06B6D4;
    --cyan-600: #0891B2;

    --red-500: #EF4444;
    --red-500-rgb: 239, 68, 68;

    --orange-400: #FB923C;
    --orange-400-rgb: 251, 146, 60;

    --steel-blue-100: #d6e9ff;
    --steel-blue-100-rgb: 214, 233, 255;
    --steel-blue-400: #88b4e7;
    --steel-blue-500: #64748B;

    --font-family-sans: 'Inter', sans-serif;
    --font-family-code: 'Fira Code', monospace;
  }

  body {
    @apply bg-gray-800 font-sans text-steel-blue-100 overflow-hidden;
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

  table {
    @apply border border-solid !border-blue-gray-600 whitespace-nowrap font-medium inline-block font-fira table-fixed !border-separate;
    border-spacing: 0;
    outline: none;
  }

  td, th {
    @apply border border-solid border-blue-gray-600 py-2 px-4;
  }

  table thead th {
    @apply sticky top-0 bg-gray-800;
    z-index: 2;
  }
  table tbody th {
    @apply sticky left-0 bg-gray-800;
    z-index: 1;
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