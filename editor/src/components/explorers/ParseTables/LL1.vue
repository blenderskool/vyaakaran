<template>
  <table class="output-table">
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
            v-html="hljs.highlight('vyaakaran grammar', rule).value"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { ContextFreeGrammar } from '@vyaakaran/compiler/context-free-grammar';
import { hljs } from '../../../config/highlight';

const props = defineProps<{
  compiled: ContextFreeGrammar,
  table: string[][][]
}>();
</script>