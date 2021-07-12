<template>
  <Splitpanes horizontal v-if="store.value.progKey && !store.value.compiled.errors.length" :dbl-click-splitter="false">
    <Pane min-size="6.5">
      <FiniteAutomataExplorer :compiled="store.value.compiled" :key="`FA ${store.value.progKey}`" :name="store.value.name" />
    </Pane>
    <Pane min-size="4" max-size="16" size="16">
      <RegExExplorer :compiled="store.value.compiled" :key="`RegEx ${store.value.progKey}`" />
    </Pane>
  </Splitpanes>
  <Empty v-else />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Pane, Splitpanes } from 'splitpanes';

import Console from '../Console.vue';
import Editor from '../Editor.vue';
import Empty from './Empty.vue';
import FiniteAutomataExplorer from '../explorers/FiniteAutomata.vue';
import RegExExplorer from '../explorers/RegEx.vue';

export default defineComponent({
  name: 'RegularGrammarPlayground',
  components: {
    Pane,
    Splitpanes,
    Console,
    Editor,
    Empty,
    FiniteAutomataExplorer,
    RegExExplorer,
  },
  inject: ['store'],
});
</script>