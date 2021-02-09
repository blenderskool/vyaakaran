<template>
  <div class="playground">
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
  },
});
</script>

<style scoped>
  .playground {
    position: relative;
    display: flex;
  }

  .editor-container {
    height: 100vh;
    width: 50vw;
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
  }
</style>