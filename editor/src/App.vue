<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --white-rgb: 255, 255, 255;
    --blue-gray-500: #586f89;
    --cool-gray-500: #6B7280;
    --cool-gray-600: #444c55;
    --gray-800: #27272A;
    --gray-900: #18181B;
    --black: #000000;
    --black-rgb: 0, 0, 0;


    --emerald-350: #34febb;
    --emerald-350-rgb: 52, 254, 187;
    --emerald-400: #34D399;
    --emerald-500: #32ae85;

    --red-500: #EF4444;
    --red-500-rgb: 239, 68, 68;

    --orange-400: #FB923C;
    --orange-400-rgb: 251, 146, 60;

    --steel-blue-100: #d6e9ff;
    --steel-blue-100-rgb: 214, 233, 255;
    --steel-blue-400: #88b4e7;
    --steel-blue-500: #5d8cc0;

    --font-family-sans: 'Inter', sans-serif;
    --font-family-code: 'Fira Code', monospace;
  }

  ul, ol {
    list-style: none;
  }

  body {
    background-color: var(--gray-800);
    font-family: var(--font-family-sans);
    color: var(--steel-blue-100);
    overflow: hidden;
  }

  button {
    border: none;
    color: inherit;
    font-family: var(--font-family-sans);
    background-color: transparent;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
  }
  .secondary-btn {
    padding: 2px 15px;
    background-color: rgba(var(--white-rgb), 0.05);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
    border: 1px solid var(--cool-gray-500);
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(var(--black-rgb), 0.15);
  }

  input {
    font-family: var(--font-family-sans);
    font-weight: 500;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
 
  *::-webkit-scrollbar-track {
    background-color: transparent;
  }
  
  *::-webkit-scrollbar-thumb {
    background-color: rgba(var(--steel-blue-100-rgb), 0.2);
  }

  table {
    border-collapse: separate;
    border-spacing: 0;
    table-layout: fixed;
    font-family: var(--font-family-code);
    display: inline-block;
    font-weight: 500;
    white-space: nowrap;
    border: 1px solid var(--blue-gray-500);
  }

  td, th {
    border: 1px solid var(--blue-gray-500);
    padding: 0.5rem 1rem;
  }

  table thead th {
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--gray-800);
  }
  table tbody th {
    position: sticky;
    left: 0;
    background: var(--gray-800);
    z-index: 1;
  }

  .splitpanes__splitter:active::after {
    box-shadow: 0 0 5px rgba(var(--black-rgb), 0.9);
    background-color: var(--blue-gray-500);
  }

  .splitpanes--vertical > .splitpanes__splitter {
    min-width: 11px !important;
  }

  .splitpanes--horizontal > .splitpanes__splitter {
    min-height: 21px !important;
    position: relative;
  }
  .splitpanes--horizontal > .splitpanes__splitter::after {
    content: '';
    position: absolute;
    left: 0;
    top: 10px;
    right: 0;
    height: 1px;
    background-color: var(--cool-gray-600);
    transition: box-shadow 0.2s ease;
  }

  .hljs-terminal {
    color: var(--emerald-350);
    font-style: italic;
  }
  .hljs-separator {
    color: var(--blue-gray-500);
  }
  .hljs-operator {
    color: var(--steel-blue-500);
  }
  .hljs-keyword {
    color: var(--emerald-500);
    font-weight: 600;
  }
</style>