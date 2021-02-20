<template>
  <div class="editor" ref="editorRef" />
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

import { editorConfig } from '../config/editor';
import { Playground } from '../store/code';
import router from '../router';

export default defineComponent({
  name: 'Editor',
  setup() {
    const store = inject<ComputedRef<Playground>>('store');
    const editorRef = ref<HTMLElement>(null);
    let editor: monaco.editor.IStandaloneCodeEditor;

    onMounted(() => {
      editor = monaco.editor.create(editorRef.value, {
        ...editorConfig,
        language: 'Vyaakaran Regular Grammar',
        value: store.value.program,
      });
      editor.onDidChangeModelContent(() => {
        store.value.program = editor.getValue();
      });
    });

    watch(() => router.currentRoute.value, () => {
      if (editor) {
        editor.setValue(store.value.program);
      }
    });

    onUnmounted(() => {
      editor.dispose();
    });

    return { editorRef, editor, store };
  },
})
</script>

<style scoped>
  .editor {
    text-align: left;
    overflow: hidden;
    height: 100vh;
  }
</style>

<style>
.monaco-editor .margin-view-overlays .line-numbers {
  font-size: 12px;
}
</style>