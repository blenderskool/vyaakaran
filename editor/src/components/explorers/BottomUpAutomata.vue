<template>
  <PaneHeader>
    <div class="header">
      Parsing Automaton
      <a :download="`${name} - parsing automaton`" v-if="automataExists && !isGraphHuge" class="secondary-btn" @click="saveFigure">
        Save figure
      </a>
    </div>
  </PaneHeader>
  <p v-if="!automataExists" class="no-automata-message">
    LL(1) parser has no automaton
  </p>
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
import { exportToImg, fillBg } from '../../utils/canvas';
import { edgeConfig, getNodeConfig } from '../../config/graph';
import PaneHeader from '../ui/PaneHeader.vue';

export default defineComponent({
  name: 'BottomUpAutomata',
  props: {
    graph: {
      type: Object as PropType<Record<number, Record<string, number>>>,
      default: {},
    },
    states: {
      type: Array as PropType<OrderedHashSet<State>[]>,
      default: [],
    },
    automataExists: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    name: {
      type: String as PropType<string>,
    },
  },
  components: {
    PaneHeader,
  },
  setup({ graph, states }) {
    const outputRef = ref<HTMLElement>(null);
    const canvasRef = ref<HTMLCanvasElement>(null);
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

      network.on('beforeDrawing', (ctx: CanvasRenderingContext2D) => {
        canvasRef.value = ctx.canvas;
        fillBg(ctx);
      });
    };

    const saveFigure = (e) => {
      if (!network || !canvasRef.value) return;
      e.target.href = exportToImg(canvasRef.value);
    }

    watch(() => states.length, () => {
      isGraphHuge.value = states.length > 50;
      if (isGraphHuge.value && network) {
        network.destroy();
      }
    });

    onUpdated(() => !isGraphHuge.value && generateVisGraph());
    onMounted(() => !isGraphHuge.value && generateVisGraph());
    onUnmounted(() => network && network.destroy());

    return { outputRef, isGraphHuge, saveFigure };
  }
});
</script>

<style scoped>
  .output {
    height: 100%;
    outline: none;
  }

  .header {
    display: flex;
    justify-content: space-between;
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

  .no-automata-message {
    margin-top: 1rem;
    padding: 0 1.25rem;
    color: var(--cool-gray-500);
    font-weight: 500;
  }
</style>