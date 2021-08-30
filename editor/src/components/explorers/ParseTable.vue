<template>
  <Pane class="pt-2" min-size="5" size="93">
    <PaneHeader>
      <div class="flex justify-between">
        <span>Parsing table</span>
        <RadioTabs name="FA-type" :options="['LL(1)', 'LR(0)', 'SLR(1)', 'LR(1)', 'LALR(1)']" v-model="tableType" />
      </div>
    </PaneHeader>
    <div class="px-12 pb-16 h-full">
      <LL1ParseTable v-if="tableType === 'LL(1)'" :compiled="store.value.compiled" :table="parser.parseTable" />
      <LR0ParseTable
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
      :key="`Bottom-up automata ${tableType} ${store.value.progKey}`"
      :graph="parser.graph"
      :states="parser.states"
      :automataExists="tableType !== 'LL(1)'"
      :name="`${store.value.name} - ${tableType}`"
    />
  </Pane>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';

import LL1ParseTable from './ParseTables/LL1.vue';
import LR0ParseTable from './ParseTables/LR0.vue';

import PaneHeader from '../ui/PaneHeader.vue';
import RadioTabs from '../ui/RadioTabs.vue';
import BottomUpAutomata from './BottomUpAutomata.vue';

export default defineComponent({
  name: 'ParseTableExplorer',
  components: {
    PaneHeader,
    RadioTabs,
    LL1ParseTable,
    LR0ParseTable,
    Splitpanes,
    Pane,
    BottomUpAutomata,
  },
  inject: ['store'],
  data() {
    return {
      tableType: 'LL(1)',
    };
  },
  computed: {
    parser() {
      const compiled = this.store.value.compiled;
      switch (this.tableType) {
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
    },
  },
  mounted() {
    this.$forceUpdate();
  },
});
</script>

<style scoped>
  li::marker {
    @apply text-cool-gray-600;
  }
</style>

<style>
  .parse-table {
    @apply mt-4 overflow-auto max-w-full text-xs;
    max-height: calc(100% - 9rem);
  }

  .parse-table td.conflict {
    @apply bg-red-500 bg-opacity-10;
  }
</style>