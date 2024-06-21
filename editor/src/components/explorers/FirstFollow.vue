<template>
  <div class="h-full">
    <PaneHeader>First &amp; Follow sets</PaneHeader>
    <table class="output-table mt-4 mx-5 text-sm overflow-auto">
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
            <span class="text-cool-gray-600">{&nbsp;</span>
            <span v-html="hljs.highlight('vyaakaran grammar', [...firstSets[nonterminal]].join('. ')).value" />
            <span class="text-cool-gray-600">&nbsp;}</span>
          </td>
          <td>
            <span class="text-cool-gray-600">{&nbsp;</span>
            <span v-html="hljs.highlight('vyaakaran grammar', [...followSets[nonterminal]].join('. ')).value" />
            <span class="text-cool-gray-600">&nbsp;}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { ContextFreeGrammar } from '@vyaakaran/compiler/context-free-grammar';
import PaneHeader from '../ui/PaneHeader.vue';

import { hljs } from '../../config/highlight';

const props = defineProps<{
  compiled: ContextFreeGrammar
}>();

const firstSets = computed(() => props.compiled.findFirstSets());
const followSets = computed(() => props.compiled.findFollowSets());
</script>

<style scoped>
  table {
    max-height: calc(100% - 3.5rem);
  }
</style>