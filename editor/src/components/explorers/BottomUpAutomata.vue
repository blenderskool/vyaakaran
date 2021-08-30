<template>
  <PaneHeader>
    <div class="flex justify-between">
      Parsing Automaton
      <a :download="`${name} - parsing automaton`" v-if="automataExists && !isGraphHuge" class="secondary-btn" @click="saveFigure">
        Save figure
      </a>
    </div>
  </PaneHeader>
  <p v-if="!automataExists" class="mt-4 px-5 text-cool-gray-500 font-medium">
    LL(1) parser has no automaton
  </p>
  <div v-if="isGraphHuge" class="automata-large-message">
    <p>This automaton is large and might make the system unresponsive for sometime</p>
    <button @click="() => isGraphHuge = false">Render Anyway?</button>
  </div>
  <div v-else-if="isVisLoading" class="automata-large-message">
    Loading visualization...
  </div>
  <div v-show="!isGraphHuge || !isVisLoading" class="h-full outline-none" ref="outputRef" />
</template>

<script lang="ts">
import { defineComponent, onUnmounted, onUpdated, PropType, ref, watch } from 'vue';

import { State, OrderedHashSet } from '../../../../compiler/src/utils';
import { exportToImg, fillBg } from '../../utils/canvas';
import { edgeConfig, getNodeConfig } from '../../config/graph';
import useVisNetwork from '../../utils/useVisNetwork';
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
    const [isVisLoading, networkLib, dataLib] = useVisNetwork();
    let network;

    const generateVisGraph = () => {
      if (isVisLoading.value) return;

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

      network = new networkLib.value.Network(outputRef.value, {
        nodes: new dataLib.value.DataSet(nodes),
        edges: new dataLib.value.DataSet(edges),
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
    watch(() => isVisLoading, generateVisGraph);
    onUnmounted(() => network && network.destroy());

    return { outputRef, isGraphHuge, saveFigure, isVisLoading };
  }
});
</script>
