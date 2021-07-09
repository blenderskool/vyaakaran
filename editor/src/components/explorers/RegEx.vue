<template>
  <section class="regex-explorer">
    <PaneHeader>Regular Expression</PaneHeader>
    <p v-html="regexHTML" />
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { RegularGrammar } from '../../../../compiler/src/regular-grammar';
import PaneHeader from '../ui/PaneHeader.vue';

export default defineComponent({
  name: 'RegExExplorer',
  props: {
    compiled: { type: Object as PropType<RegularGrammar> },
  },
  components: {
    PaneHeader,
  },
  computed: {
    regexHTML() {
      return this.compiled.toRegEx().result
        .replace(/(\*)/g, '<sup class="closure">$1</sup>')
        .replace(/(\+)/g, '<span class="union">$1</span>')
        .replace(/([\(\)])/g, '<span class="bracket">$1</span>')
        .replace(/(\.)/g, '<span class="concat">$1</span>');
    }
  },
});
</script>

<style scoped>
  .regex-explorer p {
    font-weight: 500;
    font-size: 0.875rem;
    padding: 1.5rem 1.25rem;
    color: var(--cyan-300);
    font-family: var(--font-family-code);
    white-space: nowrap;
    max-width: 100%;
    overflow-x: auto;
    font-variant-ligatures: none;
  }

  header .info {
    padding: 0.625rem 1.25rem;
  }
</style>

<style>
  .regex-explorer .closure,
  .regex-explorer .union {
    color: var(--steel-blue-400);
  }

  .regex-explorer .concat {
    color: var(--steel-blue-500);
  }

  .regex-explorer .bracket {
    color: var(--blue-gray-500);
  }
</style>