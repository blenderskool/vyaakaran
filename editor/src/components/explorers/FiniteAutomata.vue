<template>
  <div class="fa-explorer">
    <PaneHeader>
      <div class="header">
        <span>Finite Automaton</span>
        <div class="controls">
          <RadioTabs name="FA-type" :options="['ε-NFA', 'NFA']" v-model="faType" v-if="showTypeSelector" />
          <a :download="`${name} - finite automaton`" class="secondary-btn save-figure" @click="saveFigure">
            Save figure
          </a>
        </div>
      </div>
    </PaneHeader>
    <div v-if="isVisLoading" class="automata-large-message">
      Loading visualization...
    </div>
    <div v-show="!isVisLoading" class="output" ref="outputRef" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, onUpdated, PropType, ref, watch } from 'vue';

import { edgeConfig, getNodeConfig, useVisNetwork } from '../../config/graph';
import { SymbolType } from '../../../../compiler/src/regular-grammar/types';
import { exportToImg, fillBg } from '../../utils/canvas';

import PaneHeader from '../ui/PaneHeader.vue';
import RadioTabs from '../ui/RadioTabs.vue';

export default defineComponent({
  name: 'FiniteAutomataExplorer',
  props: {
    name: { type: String as PropType<string> },
    getGraph: { type: Function as PropType<Function>, required: true },
    showTypeSelector: { type: Boolean as PropType<boolean>, default: true },
  },
  components: {
    PaneHeader,
    RadioTabs,
  },
  setup({ getGraph, showTypeSelector }) {
    const faType = ref<'ε-NFA' | 'NFA'>('ε-NFA');
    const outputRef = ref<HTMLElement>(null);
    const canvasRef = ref<HTMLCanvasElement>(null);
    const [isVisLoading, networkLib, dataLib] = useVisNetwork();
    let network;

    const generateVisGraph = () => {
      if (isVisLoading.value) return;

      const graph = getGraph(showTypeSelector ? faType.value : undefined);
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

      network = new networkLib.value.Network(outputRef.value, {
        nodes: new dataLib.value.DataSet(nodes),
        edges: new dataLib.value.DataSet(edges),
      }, {});
      network.on('beforeDrawing', (ctx: CanvasRenderingContext2D) => {
        canvasRef.value = ctx.canvas;
        fillBg(ctx);
      });
    };

    const saveFigure = (e) => {
      if (!network || !canvasRef.value) return;
      e.target.href = exportToImg(canvasRef.value);
    };

    onUpdated(generateVisGraph);
    watch(() => faType.value, generateVisGraph);
    watch(() => isVisLoading, generateVisGraph);
    onUnmounted(() => network && network.destroy());

    return { outputRef, faType, saveFigure, isVisLoading };
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
  .header .controls {
    display: flex;
  }
  .header .controls .save-figure {
    margin-left: 8px;
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