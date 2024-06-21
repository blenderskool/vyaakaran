<template>
  <section class="regex-explorer">
    <PaneHeader class="py-2 px-5">Regular Expression</PaneHeader>
    <p
      class="font-medium text-sm py-6 px-5 text-cyan-300 font-fira whitespace-nowrap w-full overflow-x-auto regex"
      v-html="regexHTML"
    />
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { RegularGrammar } from '@vyaakaran/compiler/regular-grammar';
import PaneHeader from '../ui/PaneHeader.vue';

const props = defineProps<{
  compiled: RegularGrammar
}>();

const regexHTML = computed(() => (
  props.compiled.toRegEx().result
    .replace(/(\*)/g, '<sup class="closure">$1</sup>')
    .replace(/(\+)/g, '<span class="union">$1</span>')
    .replace(/([\(\)])/g, '<span class="bracket">$1</span>')
    .replace(/(\.)/g, '<span class="concat">$1</span>')
));
</script>

<style scoped>
  .regex-explorer p {
    font-variant-ligatures: none;
  }
</style>

<style>
  .regex-explorer .closure,
  .regex-explorer .union {
    @apply text-steel-blue-400;
  }

  .regex-explorer .concat {
    @apply text-steel-blue-500;
  }

  .regex-explorer .bracket {
    @apply text-blue-gray-600;
  }
</style>