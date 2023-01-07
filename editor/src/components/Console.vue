<template>
  <Pane class="console flex flex-col" min-size="3.5" v-life:updated="scrollToBottom" max-size="50">
    <PaneHeader class="!bg-gray-900 shadow-lg">
      <div class="flex justify-between items-center">
        <span>Console</span>
        <div class="space-x-4 text-xs">
          <span class="text-red-500" v-if="errorsCount">
            {{ errorsCount }} errors
          </span>
          <span class="text-orange-400" v-if="warningsCount">
            {{ warningsCount }} warnings
          </span>
        </div>
      </div>
    </PaneHeader>
    <ul class="bg-gray-1000 font-fira font-medium flex-grow list-none overflow-y-auto max-h-full" ref="consoleRef">
      <li
        v-for="error in store.consoleStream"
        :key="+error.timestamp"
        :class="error.type.toLowerCase()"
        class="border-b border-dashed border-gray-800 py-3 px-5 flex items-center text-sm"
      >
        <svg v-if="error.type === 'Error'" class="flex-shrink-0" width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="error.type === 'Warning'" class="flex-shrink-0" width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <svg v-else-if="error.type === 'Success'" class="flex-shrink-0" width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <!-- <div class="ml-2 text-xs text-gray-500 whitespace-nowrap">
          {{ error.timestamp.toLocaleTimeString() }}
        </div> -->
        <div class="ml-4">
          <span v-html="error.message.replace(/\n/g, '<br>')" />
        </div>
      </li>
    </ul>
    <div class="flex-shrink-0 w-full border-t border-solid border-gray-900 py-2.5 px-5 text-blue-gray-600 bg-gray-1000 font-fira text-sm font-medium">
      >
      <input
        v-model="inputCommand"
        placeholder="Type help for list of commands"
        @keydown="consoleKeyHandler"
        class="bg-transparent text-steel-blue-100 border-none focus:outline-none pr-5 w-11/12 placeholder-blue-gray-600"
      />
    </div>
  </Pane>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, inject, ref } from 'vue';
import { Pane }  from 'splitpanes';
import PaneHeader from './ui/PaneHeader.vue';
import { Playground } from '../store/code';

const store = inject('store') as ComputedRef<Playground>;
const consoleRef = ref<HTMLElement | null>(null);
const inputCommand = ref<string>('');
const errorsCount = computed(() => store.value.consoleStream.filter((err) => err.type === 'Error').length);
const warningsCount = computed(() => store.value.consoleStream.filter((err) => err.type === 'Warning').length);

const scrollToBottom = () => {
  if (!consoleRef.value) return;
  consoleRef.value.scrollTo(0, consoleRef.value.scrollHeight + 100);
};

const submitCommand = async () => {
  const { executeCommand } = await import('../config/console');
  executeCommand(inputCommand.value, store.value.consoleStream);
  inputCommand.value = '';
};

const consoleKeyHandler = async (e: KeyboardEvent) => {
  if (e.code === 'Enter') {
    submitCommand();
  } else if (e.code === 'KeyL' && e.ctrlKey) {
    e.preventDefault();
    const { executeCommand } = await import('../config/console');
    executeCommand('clear', store.value.consoleStream);
  }
}
</script>

<style scoped>
  .error {
    @apply text-red-500;
  }
  .warning {
    @apply text-orange-400;
  }
  .success {
    @apply text-green-400;
  }
</style>

<style>
  .console td {
    @apply align-top;
  }
  .console tr td:first-of-type {
    @apply whitespace-nowrap;
  }
  .console table {
    @apply border-separate;
    border-spacing: 1rem;
  }
</style>