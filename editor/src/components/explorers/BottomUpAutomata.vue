<template>
  <div v-if="isGraphHuge" class="huge-graph-warning">
    <p>This automaton is large and might make the system unresponsive for sometime</p>
    <button @click="() => isGraphHuge = false">Render Anyway?</button>
  </div>
  <div v-show="!isGraphHuge" class="output" ref="outputRef" />
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, onUpdated, PropType, ref, watch } from 'vue';
import { Network } from 'vis-network/peer/esm/vis-network';
import { DataSet } from 'vis-data/peer/esm/vis-data';

import { State, OrderedHashSet } from '../../../../compiler/src/utils';
import { edgeConfig, getNodeConfig } from '../../config/graph';

export default defineComponent({
  name: 'BottomUpAutomata',
  props: {
    graph: {
      type: Object as PropType<Record<number, Record<string, number>>>,
      required: true,
    },
    states: {
      type: Array as PropType<OrderedHashSet<State>[]>,
      required: true,
    },
  },
  setup({ graph, states }) {
    const outputRef = ref<HTMLElement>(null);
    const isGraphHuge = ref<boolean>(states.length > 50);
    let network: Network;

    const generateVisGraph = () => {
      const nodes: object[] = states.map((state, i) => {
        return ({
          ...getNodeConfig('', false),
          id: i,
          shape: 'box',
          size: 150,
          label: `S${i}:\n\n` + state.unorderedList().join('\n'),
          font: {
            color: '#d6e9ff',
            face: 'Fira Code',
            align: 'left',
            size: 12,
          },
          shapeProperties: {
            borderRadius: 4,
          },
        });
      });

      let edges = [];
      for(const from in graph) {
        for(const via in graph[from]) {
          edges.push({
            ...edgeConfig,
            from,
            to: graph[from][via],
            label: `*${via}*`,
          });
        }
      }

      if (network) {
        network.destroy();
      }

      network = new Network(outputRef.value, {
        nodes: new DataSet(nodes),
        edges: new DataSet(edges),
      }, {
        physics: {
          barnesHut: {
            springConstant: 0,
            avoidOverlap: 0.4,
          },
        }
      });
    };

    watch(() => states.length, () => {
      isGraphHuge.value = states.length > 50;
      if (isGraphHuge.value && network) {
        network.destroy();
      }
    });

    onUpdated(() => !isGraphHuge.value && generateVisGraph());
    onMounted(() => !isGraphHuge.value && generateVisGraph());
    onUnmounted(() => network && network.destroy());

    return { outputRef, isGraphHuge };
  }
});
</script>

<style scoped>
  .output {
    height: 100%;
    outline: none;
  }

  .huge-graph-warning {
    margin-top: 3rem;
    padding: 0 1.25rem;
    color: var(--cool-gray-500);
    font-weight: 500;
    text-align: center;
  }

  .huge-graph-warning button {
    margin-top: 1.5rem;

    padding: 0.5rem 0.75rem;
    font-weight: 600;
    border-radius: 4px;
    border: 1px solid var(--emerald-500);
    box-shadow: 0 3px 8px rgba(var(--black-rgb), 0.3);
    outline: none;
    cursor: pointer;
    color: var(--gray-900);
    background-color: var(--emerald-350);
    transition: all 0.2s ease;
  }
  .huge-graph-warning button:hover {
    background-color: var(--emerald-400);
    transform: scale(1.1);
  }
</style>