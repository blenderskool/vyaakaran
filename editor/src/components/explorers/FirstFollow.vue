<template>
  <div class="first-follow-explorer">
    <PaneHeader>First &amp; Follow sets</PaneHeader>
    <table>
      <thead>
        <tr>
          <th />
          <th>FIRST</th>
          <th>FOLLOW</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="nonterminal in compiled.nonterminals" :key="nonterminal">
          <td>{{ nonterminal }}</td>
          <td>
            <span class="bracket">{&nbsp;</span>
            <span v-html="hljs.highlight('vyaakaran', [...firstSets[nonterminal]].join('. ')).value" />
            <span class="bracket">&nbsp;}</span>
          </td>
          <td>
            <span class="bracket">{&nbsp;</span>
            <span v-html="hljs.highlight('vyaakaran', [...followSets[nonterminal]].join('. ')).value" />
            <span class="bracket">&nbsp;}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ContextFreeGrammar } from '../../../../compiler/src/context-free-grammar';
import PaneHeader from '../ui/PaneHeader.vue';

import { hljs } from '../../config/editor';

export default defineComponent({
  name: 'FirstFollowExplorer',
  components: {
    PaneHeader,
  },
  props: {
    compiled: { type: Object as PropType<ContextFreeGrammar> },
  },
  computed: {
    firstSets() {
      return this.compiled.findFirstSets();
    },
    followSets() {
      return this.compiled.findFollowSets();
    },
  },
  setup() {
    return { hljs };
  }
});
</script>

<style scoped>
  table {
    margin: 1rem 20px 0 20px;
    overflow: auto;
    max-width: 95%;
    max-height: calc(100% - 5.5rem);
  }

  .first-follow-explorer {
    height: 100%;
  }

  .bracket {
    color: #444c55;
  }
</style>