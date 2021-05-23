<template>
  <Pane class="parser-explorer" min-size="5" size="93">
    <PaneHeader>
      <div class="header">
        <span>Parsing table</span>
        <RadioTabs name="FA-type" :options="['LL(1)', 'LR(0)', 'SLR(1)', 'LR(1)', 'LALR(1)']" v-model="tableType" />
      </div>
    </PaneHeader>
    <div class="output-container">
      <LL1ParseTable v-if="tableType === 'LL(1)'" :compiled="store.value.compiled" :table="parser.parseTable" />
      <LR0ParseTable
        v-if="tableType !== 'LL(1)'"
        :actionTable="parser.actionTable"
        :gotoTable="parser.gotoTable"
        :actionTableColumns="parser.actionTableColumns"
        :gotoTableColumns="parser.gotoTableColumns"
      />
      <div class="notes">
        <h4 v-if="parser.conclusions.length">Analysis</h4>
        <ul>
          <li v-for="conclusion in parser.conclusions" :key="conclusion">{{ conclusion }}</li>
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
  .header {
    display: flex;
    justify-content: space-between;
  }

  .parser-explorer {
    padding-top: 10px;
  }

  .output-container {
    padding: 0 3rem 3rem;
    max-height: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .notes {
    margin-top: 2rem;
    font-size: 0.875rem;
  }

  .notes ul {
    list-style-type: disc;
  }

  .notes li {
    line-height: 1.75;
  }

  .notes li::marker {
    color: var(--cool-gray-600);
  }

  .notes h4 {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
    font-size: 0.75rem;
    color: var(--cool-gray-500);
    margin-bottom: 0.25rem;
  }
</style>

<style>
  .parse-table {
    margin-top: 1rem;
    overflow: auto;
    max-width: 100%;
    max-height: calc(100% - 9rem);
    font-size: 0.875rem;
  }

  .parse-table td.conflict {
    background-color: rgba(var(--red-500-rgb), 0.15);
  }
</style>