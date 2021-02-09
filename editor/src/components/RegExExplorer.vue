<template>
  <section class="regex-explorer">
    <PaneHeader>Regular Expression</PaneHeader>
    <p v-html="regexHTML" />
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { RegularGrammar } from '../../../compiler/src/regular-grammar';
import PaneHeader from './ui/PaneHeader.vue';

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
    padding: 35px 20px;
    color: #34febb;
    font-family: 'Fira Code';
    white-space: nowrap;
    max-width: 100%;
    overflow-x: auto;
  }

  header .info {
    padding: 10px 20px;
  }
</style>

<style>
  .regex-explorer .closure,
  .regex-explorer .union {
    color: #88b4e7;
  }

  .regex-explorer .concat {
    color: #5d8cc0;
  }

  .regex-explorer .bracket {
    color: #586f89;
  }
</style>