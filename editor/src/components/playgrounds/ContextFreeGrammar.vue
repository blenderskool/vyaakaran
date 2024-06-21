<template>
  <Splitpanes horizontal v-if="store.progKey && !store.compiled.errors.length" :dbl-click-splitter="false">
    <ParseTableExplorer />
    <Pane min-size="4" size="4">
      <FirstFollowExplorer :compiled="(store.compiled as ContextFreeGrammar)" />
    </Pane>
  </Splitpanes>
  <Empty v-else />
</template>

<script lang="ts" setup>
import { ComputedRef, inject } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';
import { ContextFreeGrammar } from '@vyaakaran/compiler/context-free-grammar';

import ParseTableExplorer from '../explorers/ParseTable.vue';
import FirstFollowExplorer from '../explorers/FirstFollow.vue';
import { Playground } from '../../store/code';
import Empty from './Empty.vue';

const store = inject('store') as ComputedRef<Playground>;
</script>

<style>
  .output-table {
    @apply mt-4 overflow-auto max-w-full text-xs border border-solid border-blue-gray-600 whitespace-nowrap font-medium inline-block font-fira table-fixed;
    border-collapse: separate;
    border-spacing: 0;
    outline: none;
  }

  .output-table td.conflict {
    @apply bg-red-500 bg-opacity-10;
  }

  .output-table td, .output-table th {
    @apply border border-solid border-blue-gray-600 py-2 px-4;
  }

  .output-table thead th {
    @apply sticky top-0 bg-gray-800;
    z-index: 2;
  }
  .output-table tbody th {
    @apply sticky left-0 bg-gray-800;
    z-index: 1;
  }
</style>