<template>
  <table class="parse-table">
    <thead>
      <tr>
        <th />
        <th v-for="terminal in compiled.terminals" :key="terminal" class="hljs-terminal">{{ terminal }}</th>
        <th class="hljs-terminal">$</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, i) in table" :key="i">
        <th>{{ compiled.nonterminals[i] }}</th>
        <td v-for="(rules, j) in row" :key="j" :class="{ conflict: rules.length > 1 }">
          <div
            v-for="rule in rules"
            :key="rule"
            v-html="hljs.highlight('vyaakaran', rule).value"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { hljs } from '../../../config/editor';
import { ContextFreeGrammar } from '../../../../../compiler/src/context-free-grammar';

export default defineComponent({
  name: 'LL1ParseTable',
  props: {
    compiled: {
      type: Object as PropType<ContextFreeGrammar>,
      required: true,
    },
    table: {
      type: Array as PropType<string[][][]>,
      required: true,
    },
  },
  setup() {
    return { hljs };
  },
});
</script>