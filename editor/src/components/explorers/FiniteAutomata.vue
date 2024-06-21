<template>
  <div class="fa-explorer h-screen pt-3">
    <PaneHeader>
      <div class="flex justify-between">
        <span>Finite Automaton</span>
        <div class="flex space-x-2">
          <RadioTabs name="FA-type" :options="['ε-NFA', 'NFA']" v-model="faType" v-if="showTypeSelector" />
          <button class="secondary-btn" @click="explainConversion" v-if="showExplainationOption" :disabled="faType === 'NFA'">
            Explain conversion
          </button>
          <a :download="`${name} - finite automaton`" class="secondary-btn" @click="saveFigure">
            Save figure
          </a>
        </div>
      </div>
    </PaneHeader>
    <div v-if="isVisLoading" class="automata-large-message">
      Loading visualization...
    </div>
    <div v-show="!isVisLoading" class="h-full" ref="outputRef" />
  </div>
</template>

<script lang="ts" setup>
import { onUnmounted, onUpdated, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { SymbolType } from '@vyaakaran/compiler';
import { type FAGraph } from '@vyaakaran/compiler/regular-grammar';

import { edgeConfig, getNodeConfig } from '../../config/graph';
import { exportToImg, fillBg } from '../../utils/canvas';
import useVisNetwork from '../../utils/useVisNetwork';

import PaneHeader from '../ui/PaneHeader.vue';
import RadioTabs from '../ui/RadioTabs.vue';
import { Edge, Network } from 'vis-network/declarations/entry-esnext';

const props = withDefaults(defineProps<{
  name?: string,
  getGraph: (type: 'ε-NFA' | 'NFA') => FAGraph | null,
  showTypeSelector?: boolean,
  showExplainationOption?: boolean
}>(), {
  showTypeSelector: true,
  showExplainationOption: true,
});

const faType = ref<'ε-NFA' | 'NFA'>('ε-NFA');
const outputRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const [isVisLoading, networkLib, dataLib] = useVisNetwork();
const router = useRouter();
let network: Network;

const generateVisGraph = () => {
  if (isVisLoading.value || !outputRef.value) return;

  const graph = props.getGraph(props.showTypeSelector ? faType.value : 'ε-NFA');
  if (!graph) return;

  const nodes: any[] = [
    { id: '_START', opacity: 0 },
    ...Object.keys(graph).map(node => getNodeConfig(node, graph[node].final)),
  ];

  let edges: Record<string, string[]> = { '_START S': [] };
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

  const visEdges: Edge[] = Object.keys(edges).map((edge) => {
    const [from, to] = edge.split(' ');
    return {
      ...edgeConfig, from, to,
      label: `*_${edges[edge].join(',')}_*`,
    };
  });

  if (network) {
    network.destroy();
  }

  network = new networkLib.value.Network(outputRef.value, {
    nodes: new dataLib.value.DataSet(nodes),
    edges: new dataLib.value.DataSet(visEdges),
  }, {});
  network.on('beforeDrawing', (ctx: CanvasRenderingContext2D) => {
    canvasRef.value = ctx.canvas;
    fillBg(ctx);
  });
};

const saveFigure = (e: Event) => {
  if (!network || !canvasRef.value) return;
  (e.target as HTMLAnchorElement).href = exportToImg(canvasRef.value);
};

const explainConversion = () => {
  router.push({ ...router.currentRoute.value, query: { explain: faType.value.toLowerCase() } });
};

onUpdated(generateVisGraph);
watch(() => faType.value, generateVisGraph);
watch(() => isVisLoading, generateVisGraph);
onUnmounted(() => network && network.destroy());
</script>

<style>
  .fa-explorer .vis-network:focus {
    @apply !outline-none;
  }
</style>