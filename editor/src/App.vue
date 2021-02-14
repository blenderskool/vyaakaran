<template>
  <div class="playground">
    <Sidebar class="sidebar" />

    <div>
      <EditorTabs />
      <router-view class="view" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import { getActiveStore } from './store/code';
import Sidebar from './components/Sidebar.vue';
import EditorTabs from './components/EditorTabs.vue';

export default defineComponent({
  name: 'App',
  components: {
    Sidebar,
    EditorTabs,
  },
  provide() {
    return {
      store: computed(getActiveStore),
    }
  },
  setup() {
    return { getActiveStore };
  }
});
</script>

<style scoped>
  .playground {
    position: relative;
    display: flex;
  }

  .sidebar {
    width: 60px;
  }

  .view {
    display: flex;
    position: relative;
    height: calc(100vh - 40px);
    width: calc(100vw - 60px);
  }
</style>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  ul, ol {
    list-style: none;
  }

  body {
    background-color: #27272A;
    font-family: 'Poppins', sans-serif;
    color: #d6e9ff;
    overflow: hidden;
  }

  button {
    border: none;
    color: inherit;
    font-family: 'Poppins', sans-serif;
    background-color: transparent;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
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
    background-color: rgba(255, 255, 255, 0.2);
  }

  
  .splitpanes__splitter {
    min-height: 21px !important;
    position: relative;
  }
  .splitpanes__splitter::after {
    content: '';
    position: absolute;
    left: 0;
    top: 10px;
    right: 0;
    height: 1px;
    background-color: #444c55;
  }
  .splitpanes__splitter:active::after {
    background-color: #586f89;
  }
</style>