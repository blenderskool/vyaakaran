<template>
  <div class="relative h-full">
    <div class="text-left overflow-hidden h-full w-full" ref="editorRef" />
    <Menu v-slot="{ open }" as="div" class="absolute top-4 right-0 inline-block text-left mr-5">
      <MenuButton
        class="inline-flex items-center text-xs bg-gray-1000/80 px-3 py-1 rounded text-gray-400 font-medium backdrop-filter backdrop-blur-sm transition hover:(ring-1 ring-gray-800/60 bg-gray-1000/40) focus:outline-none"
        :class="{ 'text-gray-200': open }"
      >
        Select Example
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 ml-1"
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </MenuButton>

      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <MenuItems class="origin-top-right absolute right-0 mt-2 w-56 p-1 rounded shadow-lg bg-gray-1000/80 focus:outline-none ring-1 ring-gray-1000 backdrop-filter backdrop-blur-sm">
          <MenuItem
            v-slot="{ active }"
            v-for="example in codeExamples[store.type]"
            :key="example.name"
            @click="store.program = example.code"
          >
            <div
              :class="{
                'bg-gray-400 text-gray-200 bg-opacity-5': active,
                'text-gray-400': !active,
                'block px-2.5 py-1.5 text-xs rounded font-medium cursor-pointer transition': true
              }"
            >
              {{ example.name }}
            </div>
          </MenuItem>
        </MenuItems>
      </transition>
    </Menu>

  </div>
</template>

<script lang="ts" setup>
import { ComputedRef, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

import { getEditorConfig } from '../config/editor';
import codeExamples from '../utils/codeExamples';
import { Playground } from '../store/code';

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
</script>

<style>
.monaco-editor .margin-view-overlays .line-numbers {
  @apply text-xs;
}
</style>
