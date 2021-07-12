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