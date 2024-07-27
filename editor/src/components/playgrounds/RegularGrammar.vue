<template>
  <Splitpanes
    horizontal
    v-if="store.progKey && !store.compiled.errors.length"
    :dbl-click-splitter="false"
  >
    <Pane min-size="6.5">
      <FiniteAutomataExplorer
        :getGraph="getAutomataGraph"
        :key="`FA ${store.progKey}`"
        :name="store.name"
      />
    </Pane>
    <Pane min-size="3.5" max-size="16" size="16">
      <RegExExplorer
        :compiled="(store.compiled as RegularGrammar)"
        :key="`RegEx ${store.progKey}`"
      />
    </Pane>
  </Splitpanes>
  <Empty v-else />
</template>

<script lang="ts" setup>
import { ComputedRef, inject } from "vue";
import { Pane, Splitpanes } from "splitpanes";
import {
  type FAGraph,
  RegularGrammar,
} from "@vyaakaran/compiler/regular-grammar";

import Empty from "./Empty.vue";
import FiniteAutomataExplorer from "../explorers/FiniteAutomata.vue";
import RegExExplorer from "../explorers/RegEx.vue";
import { Playground } from "../../store/code";

const store = inject("store") as ComputedRef<Playground>;

const getAutomataGraph = (faType: "ε-NFA" | "NFA" | "DFA"): FAGraph => {
  const compiled = store.value.compiled as RegularGrammar;
  switch (faType) {
    case "ε-NFA":
      return compiled.toFA().optimizeFA().result;
    case "NFA":
      return compiled.toEpsilonFreeFA().optimizeFA().result;
    case "DFA":
      return compiled.toDFA().optimizeFA().result;
  }
};
</script>
