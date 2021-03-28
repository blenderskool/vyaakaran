<template>
  <div class="fa-explorer">
    <PaneHeader>
      <div class="header">
        <span>Finite Automata</span>
        <RadioTabs name="FA-type" :options="['ε-NFA', 'NFA']" v-model="faType" />
      </div>
    </PaneHeader>
    <div class="output" ref="outputRef" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, onUpdated, PropType, ref, watch } from 'vue';
import { Network } from 'vis-network/peer/esm/vis-network';
import { DataSet } from 'vis-data/peer/esm/vis-data';

import { RegularGrammar } from '../../../../compiler/src/regular-grammar/index';
import { edgeConfig, getNodeConfig } from '../../config/graph';
import PaneHeader from '../ui/PaneHeader.vue';
import RadioTabs from '../ui/RadioTabs.vue';
import { SymbolType } from '../../../../compiler/src/regular-grammar/types';

export default defineComponent({
  name: 'FiniteAutomataExplorer',
  props: {
    compiled: { type: Object as PropType<RegularGrammar> },
  },
  components: {
    PaneHeader,
    RadioTabs,
  },
  setup({ compiled }) {
    const faType = ref<'ε-NFA' | 'NFA'>('ε-NFA');
    const outputRef = ref<HTMLElement>(null);
    let network: Network;

    const generateVisGraph = () => {
      let graph;

      switch (faType.value) {
        case 'ε-NFA':
          graph = compiled.toFA().optimizeFA().result;
          break;
        case 'NFA':
          graph = compiled.toEpsilonFreeFA().optimizeFA().result;
          break;
      }

      const nodes: any[] = [
        { id: '_START', opacity: 0 },
        ...Object.keys(graph).map(node => getNodeConfig(node, graph[node].final)),
      ];

      let edges: object = { '_START S': [] };
      for(const from in graph) {
        for(const via in graph[from].nodes) {
          graph[from].nodes[via].forEach(to => {
            const key = `${from} ${to}`;
            if (!edges[key]) {
              edges[key] = [];
            }
            edges[key].push(via === SymbolType.Empty ? 'ε' : via);
          });
        }
      }

      edges = Object.keys(edges).map((edge) => {
        const [from, to] = edge.split(' ');
        return {
          ...edgeConfig, from, to,
          label: `*_${edges[edge].join(',')}_*`,
        };
      });

      if (network) {
        network.destroy();
      }

      network = new Network(outputRef.value, {
        nodes: new DataSet(nodes),
        edges: new DataSet(edges),
      }, {});
    };


    onUpdated(generateVisGraph);
    onMounted(generateVisGraph);
    watch(() => faType.value, generateVisGraph);
    onUnmounted(() => network && network.destroy());

    return { outputRef, faType };
  }
});
</script>

<style scoped>
  .fa-explorer {
    height: 100vh;
    padding-top: 10px;
  }

  .header {
    display: flex;
    justify-content: space-between;
  }

  .output {
    height: 100%;
  }
</style>

<style>
  .fa-explorer .vis-network:focus {
    outline: none !important;
  }
</style>