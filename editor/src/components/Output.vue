<template>
  <div>
    <button class="run" @click="compile">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-play" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M7 4v16l13 -8z" />
      </svg>
    </button>
    <Splitpanes class="output-container" horizontal v-if="codeStore.compiled && !codeStore.compiled.errors.length">
      <Pane min-size="6.5">
        <FiniteAutomataExplorer :compiled="codeStore.compiled" />
      </Pane>
      <Pane min-size="6.5" max-size="20.8">
        <RegExExplorer :compiled="codeStore.compiled" />
      </Pane>
    </Splitpanes>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';

import { FAGraph, RegularGrammar } from '../../../compiler/src/regular-grammar';
import { codeStore, compile } from '../store/code';
import FiniteAutomataExplorer from './FiniteAutomataExplorer.vue';
import RegExExplorer from './RegExExplorer.vue';

export default defineComponent({
  name: 'Output',
  components: {
    FiniteAutomataExplorer,
    RegExExplorer,
    Splitpanes,
    Pane,
  },
  setup() {
    const FA = ref<FAGraph>(null);

    return { compile, codeStore };
  }
})
</script>

<style scoped>
  .output-container {
    width: calc(50vw - 14px);
    height: 100vh;
  }

  .run {
    width: 65px;
    height: 65px;
    border-radius: 100%;
    position: absolute;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: 4px solid #1e1e1e;
    outline: none;
    cursor: pointer;
    color: #1e1e1e;
    background-color: #34febb;
    transition: all 0.2s ease;
  }
  .run:hover {
    background-color: #34D399;
    transform: scale(1.1) translateX(-45%);
  }

  .run.compiling {
    border-color: white;
  }
</style>

<style>
  .splitpanes__splitter {
    min-height: 21px !important;
    position: relative;
  }
  .splitpanes__splitter::after {
    content: '';
    position: absolute;
    left: 0;
    top: 10px;
    right: 0;
    height: 1px;
    background-color: #444c55;
  }
  .splitpanes__splitter:active::after {
    background-color: #586f89;
  }
</style>