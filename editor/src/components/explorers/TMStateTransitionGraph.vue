<template>
  <div class="tm-explorer">
    <PaneHeader>
      <div class="flex justify-between">
        <span>State Transitions</span>
        <a
          :download="'Turing Machine State Transitions.png'"
          class="secondary-btn"
          @click="saveFigure"
        >
          Save figure
        </a>
      </div>
    </PaneHeader>
    <div v-if="isVisLoading" class="automata-large-message">
      Loading visualization...
    </div>
    <div v-show="!isVisLoading" class="h-full" ref="outputRef" />
  </div>
</template>

<script lang="ts" setup>
import { Edge, Network } from 'vis-network/declarations/entry-esnext';
import { onUnmounted, onUpdated, ref, watch } from 'vue';
import { TuringMachineParseTree, TuringMachineStateTransition } from '../../../../compiler/src/turing-machine/types';
import { edgeConfig, getNodeConfig, tmEdgeConfig } from '../../config/graph';
import { exportToImg, fillBg } from '../../utils/canvas';
import useVisNetwork from '../../utils/useVisNetwork';
import PaneHeader from '../ui/PaneHeader.vue';

const props = defineProps<{
  getGraph: TuringMachineParseTree
}>();

const outputRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement>();
const [isVisLoading, networkLib, dataLib] = useVisNetwork();

let network: Network;

const generateVisGraph = () => {
  if (isVisLoading.value || !outputRef.value) return;

  const graph: TuringMachineParseTree = props.getGraph;

  let nodes: string[] = [];
  let edges: Edge[] = [];

  graph.forEach((value: TuringMachineStateTransition[], key: string) => {
    nodes.push(key);

    value.forEach((edge: TuringMachineStateTransition) => {
      if (!nodes.includes(edge.nextState)) {
        nodes.push(edge.nextState);
      }

      let i;
      for (i = 0; i < edges.length; ++i) {
        if (
          edges[i].from === key &&
          edges[i].to ===
            (edge.nextState[0] === '*'
              ? edge.nextState.slice(1)
              : edge.nextState)
        ) {
          edges[i].label =
            edges[i].label +
            `*_(${edge.readSymbol}/${edge.writeSymbol},${
              edge.transition === '>' ? 'R' : 'L'
            })_*\n`;
          break;
        }
      }

      if (i === edges.length) {
        edges.push({
          ...tmEdgeConfig,
          from: key,
          to:
            edge.nextState[0] === '*'
              ? edge.nextState.slice(1)
              : edge.nextState,
          label: `*_(${edge.readSymbol}/${edge.writeSymbol},${
            edge.transition === '>' ? 'R' : 'L'
          })_*\n`,
        });
      }
    });
  });

  nodes = [...new Set(nodes)];

  const finalNodes = [
    ...nodes.map((node) => {
      if (node[0] === '*') {
        return getNodeConfig(node.slice(1), true);
      } else {
        return getNodeConfig(node, false);
      }
    }),
  ];

  if (network) {
    network.destroy();
  }

  network = new networkLib.value.Network(
    outputRef.value,
    {
      nodes: new dataLib.value.DataSet([
        { id: '_START', opacity: 0 },
        ...finalNodes,
      ]),
      edges: new dataLib.value.DataSet([
        {
          from: '_START',
          to: 'S',
          ...(edgeConfig as Edge),
          length: 10,
        },
        ...edges,
      ]),
    },
    {}
  );
  network.on('beforeDrawing', (ctx: CanvasRenderingContext2D) => {
    canvasRef.value = ctx.canvas;
    fillBg(ctx);
  });
};

const saveFigure = (e: Event) => {
  if (!network || !canvasRef.value) return;
  (e.target as HTMLAnchorElement).href = exportToImg(canvasRef.value);
};

onUpdated(generateVisGraph);
watch(() => isVisLoading, generateVisGraph);
onUnmounted(() => network && network.destroy());
</script>

<style>
.tm-explorer .vis-network:focus {
  @apply !outline-none;
}
</style>
