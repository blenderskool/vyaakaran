<template>
  <div class="font-fira fixed inset-0 bg-black flex justify-center z-50 h-0">
    <div
      class="h-100 relative bg-black p-6 rounded-lg shadow-xl max-w-md w-full"
      v-draggable
    >
      <button
        @click="$emit('close')"
        class="absolute top-0 right-0 my-4 mx-2 px-2 py-1 bg-black text-white rounded"
      >
        <svg
          class="svg-icon"
          style="
            width: 2em;
            height: 2em;
            vertical-align: middle;
            fill: currentColor;
            overflow: hidden;
          "
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M512 806.764618C349.188606 806.764618 217.235382 674.811394 217.235382 512s131.953223-294.764618 294.764618-294.764618 294.764618 131.953223 294.764618 294.764618-131.953223 294.764618-294.764618 294.764618z m0-39.301949c141.087856 0 255.462669-114.374813 255.462669-255.462669S653.087856 256.537331 512 256.537331 256.537331 370.912144 256.537331 512s114.374813 255.462669 255.462669 255.462669zM549.152624 512l99.329535 99.252774-37.152624 37.152623L512 549.152624 412.747226 648.405397l-37.152623-37.152623L474.847376 512 374.443178 411.595802l37.152624-37.152624L512 474.847376l100.404198-100.404198 37.152624 37.152624L549.152624 512z m0 0"
          />
        </svg>
      </button>
      <h2 class="font-merri text-cyan-500 text-2xl font-bold mb-4">
        Syntax Cheat-sheet
      </h2>
      <div class="grid gap-2">
        <div
          v-for="(rule, index) in syntaxRules"
          :key="index"
          class="grid grid-cols-2 gap-2"
        >
          <span class="font-medium text-white">{{ rule.name }}</span>
          <span class="text-cyan-500">{{ rule.syntax }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const syntaxRules = [
  { name: 'Start symbol', syntax: 'S' },
  { name: 'Follow (->)', syntax: '->' },
  { name: 'ε or λ', syntax: 'ε or λ or #' },
  { name: 'Or (|)', syntax: '|' },
  { name: 'End each rule', syntax: '.' },
  { name: 'Comments', syntax: '// comment' },
  { name: 'Non-terminals', syntax: 'start with uppercase character' },
  { name: 'Terminals', syntax: 'start with any other character' },
];

defineEmits(['close']);
</script>
