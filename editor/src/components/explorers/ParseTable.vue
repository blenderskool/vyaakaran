<template>
  <div class="parser-explorer">
    <PaneHeader>
      <div class="header">
        <span>Parsing table</span>
        <RadioTabs name="FA-type" :options="['LL(1)', 'LR(1)']" v-model="tableType" />
      </div>
    </PaneHeader>
    <div class="output">
      <table>
        <thead>
          <tr>
            <th />
            <th v-for="terminal in compiled.terminals" :key="terminal" class="hljs-terminal">{{ terminal }}</th>
            <th class="hljs-terminal">$</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in parser.parseTable" :key="i">
            <th>{{ compiled.nonterminals[i] }}</th>
            <td v-for="(rules, j) in row" :key="j" :class="{ conflict: rules.length > 1 }">
              <div
                v-for="rule in rules"
                :key="rule"
                v-html="hljs.highlight('vyaakaran', rule).value"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="notes">
        <h4 v-if="parser.conclusions.length">Analysis</h4>
        <ul>
          <li v-for="conclusion in parser.conclusions" :key="conclusion">{{ conclusion }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ContextFreeGrammar } from '../../../../compiler/src/context-free-grammar';

import PaneHeader from '../ui/PaneHeader.vue';
import RadioTabs from '../ui/RadioTabs.vue';
import { hljs } from '../../config/editor';

export default defineComponent({
  name: 'ParseTableExplorer',
  components: {
    PaneHeader,
    RadioTabs,
  },
  props: {
    compiled: { type: Object as PropType<ContextFreeGrammar> },
  },
  data() {
    return {
      tableType: 'LL(1)',
    };
  },
  computed: {
    parser() {
      switch (this.tableType) {
        case 'LL(1)':
          return this.compiled.toLL1().result;
        default:
          return this.compiled.toLL1().result;
      }
    },
  },
  setup() {
    return { hljs };
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

  .output {
    padding: 0 3rem;
  }
  table {
    margin-top: 2rem;
    overflow: auto;
    max-width: 100%;
    max-height: 50vh;
    font-size: 0.875rem;
  }

  td.conflict {
    background-color: rgba(var(--red-500-rgb), 0.15);
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