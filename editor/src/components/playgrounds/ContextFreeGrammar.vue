<template>
  <Splitpanes horizontal v-if="store.value.progKey && !store.value.compiled.errors.length" :dbl-click-splitter="false">
    <ParseTableExplorer />
    <Pane min-size="4" max-size="50" size="4">
      <FirstFollowExplorer :compiled="store.value.compiled" />
    </Pane>
  </Splitpanes>
  <Empty v-else />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';

import Editor from '../Editor.vue';
import Console from '../Console.vue';
import Empty from './Empty.vue';
import ParseTableExplorer from '../explorers/ParseTable.vue';
import FirstFollowExplorer from '../explorers/FirstFollow.vue';

export default defineComponent({
  name: 'ContextFreeGrammarPlayground',
  components: {
    Splitpanes,
    Pane,
    Editor,
    Console,
    Empty,
    ParseTableExplorer,
    FirstFollowExplorer,
  },
  inject: ['store'],
});
</script>

<style>
  .output-table {
    @apply mt-4 overflow-auto max-w-full text-xs border border-solid !border-blue-gray-600 whitespace-nowrap font-medium inline-block font-fira table-fixed !border-separate;
    max-height: calc(100% - 9rem);
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