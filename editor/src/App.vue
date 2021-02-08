<template>
  <div class="container">
    <Editor />
    <Output />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Editor from './components/Editor.vue';
import Output from './components/Output.vue';

export default defineComponent({
  name: 'App',
  components: { Editor, Output },
});
</script>

<style scoped>
  .container {
    position: relative;
    display: flex;
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