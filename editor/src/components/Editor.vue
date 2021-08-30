<template>
  <div class="text-left overflow-hidden h-full w-full" ref="editorRef" />
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

import { editorConfig } from '../config/editor';
import { Playground } from '../store/code';

export default defineComponent({
  name: 'Editor',
  setup() {
    const store = inject<ComputedRef<Playground>>('store');
    const editorRef = ref<HTMLElement>(null);
    let editor: monaco.editor.IStandaloneCodeEditor;

    const getEditorValue = () => editor.getValue().replace(/\r\n/g, '\n');

    onMounted(() => {
      editor = monaco.editor.create(editorRef.value, {
        ...editorConfig,
        language: 'Vyaakaran Grammar',
        value: store.value.program,
      });
      editor.onDidChangeModelContent(() => {
        store.value.program = getEditorValue();
      });
    });

    watch(() => store.value.program, () => {
      if (editor && getEditorValue() !== store.value.program) {
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

<style>
.monaco-editor .margin-view-overlays .line-numbers {
  @apply text-xs;
}
</style>