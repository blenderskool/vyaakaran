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
      <ul class="notes">
        <li v-if="parser.conflicts">This grammar is not {{ tableType }}</li>
        <li v-if="parser.conflicts">There are {{ parser.conflicts }} conflicts</li>
      </ul>
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
  }

  td.conflict {
    background-color: rgba(220, 38, 38, 0.216);
  }

  .notes {
    margin-top: 2rem;
    list-style-type: disc;
  }
  .notes:not(:empty)::before {
    content: 'Notes';
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
    font-size: 0.85rem;
    color: #586f89;
    margin-bottom: 0.25rem;
  }
</style>