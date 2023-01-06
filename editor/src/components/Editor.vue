<template>
  <div class="text-left overflow-hidden h-full w-full" ref="editorRef" />
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

import { getEditorConfig } from '../config/editor';
import { Playground } from '../store/code';

export default defineComponent({
  name: 'Editor',
  setup() {
    const store = inject('store') as ComputedRef<Playground>;
    const editorRef = ref<HTMLElement | null>(null);
    let editor: monaco.editor.IStandaloneCodeEditor;
    
    const getEditorValue = () => editor.getValue().replace(/\r\n/g, '\n');
    
    onMounted(() => {
      if (!editorRef.value) return;
      editor = monaco.editor.create(editorRef.value, {
        ...getEditorConfig(store.value.type),
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

    // Update language and theme based on playground type change
    watch(() => store.value.type, () => {
      const editorConfig = getEditorConfig(store.value.type);
      const editorModel = editor.getModel();
      if (!editorModel || !editorConfig.language) return;

      editor.updateOptions({ theme: editorConfig.theme });
      monaco.editor.setModelLanguage(editorModel, editorConfig.language);
    })
    
    onUnmounted(() => {
      editor.dispose();
    });
    
    return { editorRef, store };
  },
})
</script>

<style>
.monaco-editor .margin-view-overlays .line-numbers {
  @apply text-xs;
}
</style>
