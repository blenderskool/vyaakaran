<template>
  <div class="output" ref="outputRef" />
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, onUpdated, PropType, ref } from 'vue';
import { Network } from 'vis-network/peer/esm/vis-network';
import { DataSet } from 'vis-data/peer/esm/vis-data';

import { State, HashSet } from '../../../../compiler/src/utils';
import { edgeConfig, getNodeConfig } from '../../config/graph';

export default defineComponent({
  name: 'BottomUpAutomata',
  props: {
    graph: {
      type: Object as PropType<Record<number, Record<string, number>>>,
      required: true,
    },
    states: {
      type: Array as PropType<HashSet<State>[]>,
      required: true,
    },
  },
  setup({ graph, states }) {
    const outputRef = ref<HTMLElement>(null);
    let network: Network;

    const generateVisGraph = () => {
      const nodes: object[] = states.map((state, i) => {
        return ({
          ...getNodeConfig('', false),
          id: i,
          shape: 'box',
          size: 150,
          label: `S${i}:\n\n` + state.list().join('\n'),
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

    onUpdated(generateVisGraph);
    onMounted(generateVisGraph);
    onUnmounted(() => network && network.destroy());

    return { outputRef };
  }
});
</script>

<style scoped>
  .output {
    height: 100%;
    outline: none;
  }
</style>