<template>
  <Splitpanes horizontal v-if="store.progKey && !store.compiled.errors.length" :dbl-click-splitter="false">
    <Pane min-size="6.5">
      <FiniteAutomataExplorer :getGraph="getAutomataGraph" :key="`FA ${store.progKey}`" :name="store.name" />
    </Pane>
    <Pane min-size="3.5" max-size="16" size="16">
      <RegExExplorer :compiled="(store.compiled as RegularGrammar)" :key="`RegEx ${store.progKey}`" />
    </Pane>
  </Splitpanes>
  <Empty v-else />
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject } from 'vue';
import { Pane, Splitpanes } from 'splitpanes';

import Console from '../Console.vue';
import Editor from '../Editor.vue';
import Empty from './Empty.vue';
import FiniteAutomataExplorer from '../explorers/FiniteAutomata.vue';
import RegExExplorer from '../explorers/RegEx.vue';
import { Playground } from '../../store/code';
import { FAGraph, RegularGrammar } from '../../../../compiler/src/regular-grammar';

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
  setup() {
    const store = inject('store') as ComputedRef<Playground>;

    const getAutomataGraph = (faType: 'ε-NFA' | 'NFA'): FAGraph => {
      const compiled = store.value.compiled as RegularGrammar;
      switch (faType) {
        case 'ε-NFA':
          return compiled.toFA().optimizeFA().result;
        case 'NFA':
          return compiled.toEpsilonFreeFA().optimizeFA().result;
      }
    };

    return { store, getAutomataGraph };
  },
});
</script>
