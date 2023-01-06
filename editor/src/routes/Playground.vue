<template>
  <div class="relative flex flex-col" v-if="getView().type !== 'default'">
    <EditorTabs @new-playground="() => showNewPlaygroundModal = true" />
    <Splitpanes class="flex relative w-screen view" :dbl-click-splitter="false">
      <component :is="getView().view" />
    </Splitpanes>
  </div>
  <div class="relative flex flex-col" v-else>
    <EditorTabs @new-playground="() => showNewPlaygroundModal = true" />

    <Splitpanes class="flex relative w-screen view" :dbl-click-splitter="false">
      <Pane class="relative overflow-visible" min-size="25" size="45">
        <Splitpanes class="h-full editor-console-split" horizontal :dbl-click-splitter="false">
          <Pane>
            <Editor />
          </Pane>
          <Console />
        </Splitpanes>
        <CompileButton />
      </Pane>

      <Pane min-size="45">
        <component :is="getView().view" class="h-full" />
      </Pane>
    </Splitpanes>
  </div>
  <NewPlaygroundModal :show="showNewPlaygroundModal" @close="showNewPlaygroundModal = false" />
  <footer class="h-6 text-xxs flex items-center px-5 bg-gray-900 text-cool-gray-500 border-t border-solid border-gray-800 font-semibold justify-end space-x-2">
    <span>
      A side project designed & developed by
      {{ ' ' }}
      <a class="text-cyan-300" href="https://akashhamirwasia.com">Akash Hamirwasia</a>
    </span>
    <span>
      Vyaakaran v{{ pkg.version }}
    </span>
  </footer>
</template>

<script lang="ts">
import { Component, computed, defineComponent, provide, ref } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';
import { useRoute } from 'vue-router';

import { getActivePlayground, PlaygroundType } from '../store/code';
import pkg from '../../package.json';

import NewPlaygroundModal from '../components/NewPlaygroundModal.vue';
import CompileButton from '../components/ui/CompileButton.vue';
import Editor from '../components/Editor.vue';
import Console from '../components/Console.vue';
import EditorTabs from '../components/EditorTabs/EditorTabs.vue';
import RegularGrammarPlayground from '../components/playgrounds/RegularGrammar.vue';
import ContextFreeGrammarPlayground from '../components/playgrounds/ContextFreeGrammar.vue';
import TuringMachinePlayground from '../components/playgrounds/TuringMachine.vue';

import RegularGrammarAutomataExplainer from '../components/explainers/RegularGrammarAutomata.vue';
import useKeyShortcut from '../utils/useKeyShortcut';

const views: Record<PlaygroundType, Record<string, { params?: string[], view: Component }>> = {
  RG: {
    nfa: {
      params: [],
      view: RegularGrammarAutomataExplainer,
    },
    'ε-nfa': {
      params: [],
      view: RegularGrammarAutomataExplainer,
    },
    default: {
      view: RegularGrammarPlayground,
    },
  },
  CFG: {
    default: {
      view: ContextFreeGrammarPlayground,
    },
  },
  TM: {
    default: {
      view: TuringMachinePlayground,
    },
  },
};

export default defineComponent({
  name: 'Playground',
  components: {
    RegularGrammarPlayground,
    ContextFreeGrammarPlayground,
    RegularGrammarAutomataExplainer,
    NewPlaygroundModal,
    CompileButton,
    EditorTabs,
    Splitpanes,
    Pane,
    Editor,
    Console,
    TuringMachinePlayground,
  },
  setup() {
    const playground = computed(getActivePlayground);
    const showNewPlaygroundModal = ref(false);
    const route = useRoute();
    provide('store', playground);

    const getView = () => {
      let explain = (
        (Array.isArray(route.query['explain']) ? route.query['explain'][0] : route.query['explain'])
        ??
        'default'
      );

      if (explain === 'default' || playground.value.errors.length || !playground.value.compiled) {
        return { type: 'default', view: views[playground.value.type].default.view };
      }

      const params = views[playground.value.type][explain].params ?? [];

      for(const param of params) {
        if (route.query[param] === undefined) {
          return { type: 'default', view: views[playground.value.type].default.view };
        }
      }

      return { type: explain, view: views[playground.value.type][explain].view };
    };

    // New playground hotkey
    useKeyShortcut((e) => e.shiftKey && e.code === 'KeyN', () => {
      showNewPlaygroundModal.value = true;
    });

    return { playground, getView, showNewPlaygroundModal, pkg };
  }
});
</script>

<style scoped>
.view {
  height: calc(100vh - 1.75rem - 1.5rem);
}
</style>

<style>
.automata-large-message {
  @apply mt-12 px-5 text-cool-gray-500 font-medium text-center;
}

.automata-large-message button {
  @apply mt-6 py-2 px-3 font-semibold rounded border border-solid border-cyan-500 shadow-md cursor-pointer text-gray-900 bg-cyan-300 transition transform focus:outline-none hover:(bg-cyan-400 scale-110);
}
</style>
