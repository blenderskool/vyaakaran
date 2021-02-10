<template>
  <div class="playground">
    <Sidebar class="sidebar" />
    <div class="editor-container">
      <Splitpanes watch-slots horizontal>
        <Pane>
          <Editor />
        </Pane>
        <Console />
      </Splitpanes>
    </div>
    <Output />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';

import Sidebar from './components/Sidebar.vue';
import Editor from './components/Editor.vue';
import Output from './components/Output.vue';
import Console from './components/Console.vue';

export default defineComponent({
  name: 'App',
  components: {
    Editor,
    Output,
    Console,
    Splitpanes,
    Pane,
    Sidebar,
  },
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

  .editor-container {
    height: 100vh;
    width: calc(50vw - 60px/2);
  }
</style>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #27272A;
    font-family: 'Poppins', sans-serif;
    color: #d6e9ff;
    overflow: hidden;
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
</style>