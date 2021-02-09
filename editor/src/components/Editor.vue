<template>
  <div class="editor" ref="editorRef" />
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

import { editorConfig } from '../config/editor';
import { codeStore } from '../store/code';

export default defineComponent({
  name: 'Editor',
  setup() {
    const editorRef = ref<HTMLElement>(null);
    let editor: monaco.editor.IStandaloneCodeEditor;

    onMounted(() => {
      editor = monaco.editor.create(editorRef.value, {
        ...editorConfig,
        language: 'Vyaakaran Regular Grammar',
        value: codeStore.program,
      });
      editor.onDidChangeModelContent(() => {
        codeStore.program = editor.getValue();
      });
    });

    onUnmounted(() => {
      editor.dispose();
    });

    return { editorRef, editor };
  }
})
</script>

<style scoped>
  .editor {
    text-align: left;
    overflow: hidden;
    height: 100vh;
  }
</style>