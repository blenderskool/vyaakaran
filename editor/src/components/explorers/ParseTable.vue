<template>
  <Pane class="pt-3" min-size="5" size="92">
    <PaneHeader>
      <div class="flex justify-between">
        <span>Parsing table</span>
        <RadioTabs name="FA-type" :options="['LL(1)', 'LR(0)', 'SLR(1)', 'LR(1)', 'LALR(1)']" v-model="tableType" />
      </div>
    </PaneHeader>
    <div class="px-12 pb-16 h-full">
      <LL1ParseTable v-if="tableType === 'LL(1)'" :compiled="(store.compiled as ContextFreeGrammar)" :table="parser.parseTable" />
      <LRParseTable
        v-if="tableType !== 'LL(1)'"
        :actionTable="parser.actionTable"
        :gotoTable="parser.gotoTable"
        :actionTableColumns="parser.actionTableColumns"
        :gotoTableColumns="parser.gotoTableColumns"
      />
      <div class="mt-6 text-sm">
        <h4 class="uppercase tracking-[1px] font-semibold text-xs text-cool-gray-500 mb-1" v-if="parser.conclusions.length">
          Analysis
        </h4>
        <ul class="list-disc">
          <li v-for="conclusion in parser.conclusions" :key="conclusion" class="leading-7">
            {{ conclusion }}
          </li>
        </ul>
      </div>
    </div>
  </Pane>
  <Pane min-size="4" size="4">
    <BottomUpAutomata
      :key="`Bottom-up automata ${tableType} ${store.progKey}`"
      :graph="parser.graph"
      :states="parser.states"
      :automataExists="tableType !== 'LL(1)'"
      :name="`${store.name} - ${tableType}`"
    />
  </Pane>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, getCurrentInstance, inject, onMounted, ref } from 'vue';
import { Pane } from 'splitpanes';
import { ContextFreeGrammar } from '@vyaakaran/compiler/context-free-grammar';

import LL1ParseTable from './ParseTables/LL1.vue';
import LRParseTable from './ParseTables/LR.vue';

import PaneHeader from '../ui/PaneHeader.vue';
import RadioTabs from '../ui/RadioTabs.vue';
import BottomUpAutomata from './BottomUpAutomata.vue';
import { Playground } from '../../store/code';

const tableType = ref('LL(1)');
const store = inject('store') as ComputedRef<Playground>;

const parser = computed(() => {
  const compiled = store.value.compiled as ContextFreeGrammar;
  switch (tableType.value) {
    case 'LL(1)':
      return compiled.toLL1().result;
    case 'LR(0)':
      return compiled.toLR0().result;
    case 'SLR(1)':
      return compiled.toSLR1().result;
    case 'LR(1)':
      return compiled.toLR1().result;
    case 'LALR(1)':
      return compiled.toLALR1().result;
    default:
      return compiled.toLL1().result;
  }
});

onMounted(() => {
  const instance = getCurrentInstance();
  instance?.proxy?.$forceUpdate();
});
</script>

<style scoped>
  li::marker {
    @apply text-cool-gray-600;
  }

  .output-table {
    max-height: calc(100% - 9rem);
  }
</style>
