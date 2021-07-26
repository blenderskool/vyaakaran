<template>
  <div class="playground">
    <EditorTabs @new-playground="() => showNewPlaygroundModal = true" />

    <Splitpanes class="view" :dbl-clicl-splitter="false">
      <Pane class="editor-wrapper" min-size="25" size="45">
        <Splitpanes class="editor-container" horizontal :dbl-click-splitter="false">
          <Pane>
            <Editor />
          </Pane>
          <Console />
        </Splitpanes>
        <CompileButton />
      </Pane>

      <Pane min-size="45">
        <component :is="getView()" class="output-container" />
      </Pane>
    </Splitpanes>
    <NewPlaygroundModal v-if="showNewPlaygroundModal" @close="() => showNewPlaygroundModal = false" />
  </div>
  <footer>
    <span>
      Designed & Developed in 🇮🇳 by
      {{ ' ' }}
      <a href="https://akashhamirwasia.com">Akash Hamirwasia</a>
    </span>
    <span>
      Vyaakaran v{{ pkg.version }}
    </span>
  </footer>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, provide, ref } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';

import { getActivePlayground } from '../store/code';
import pkg from '../../package.json';

import NewPlaygroundModal from '../components/NewPlaygroundModal.vue';
import CompileButton from '../components/ui/CompileButton.vue';
import Editor from '../components/Editor.vue';
import Console from '../components/Console.vue';
import EditorTabs from '../components/EditorTabs/EditorTabs.vue';
import RegularGrammarPlayground from '../components/playgrounds/RegularGrammar.vue';
import ContextFreeGrammarPlayground from '../components/playgrounds/ContextFreeGrammar.vue';

export default defineComponent({
  name: 'Playground',
  components: {
    RegularGrammarPlayground,
    ContextFreeGrammarPlayground,
    NewPlaygroundModal,
    CompileButton,
    EditorTabs,
    Splitpanes,
    Pane,
    Editor,
    Console,
  },
  setup() {
    const playground = computed(getActivePlayground);
    const showNewPlaygroundModal = ref(false);
    provide('store', playground);

    const getView = () => {
      switch(playground.value.type) {
        case 'RG':
          return RegularGrammarPlayground;
        case 'CFG':
          return ContextFreeGrammarPlayground;
      }
    };

    const handleNewPlaygroundKeybind = (e: KeyboardEvent) => {
      if (e.shiftKey && e.code === 'KeyN') {
        e.preventDefault();
        showNewPlaygroundModal.value = true;
      }
    };

    onMounted(() => {
      window.addEventListener('keydown', handleNewPlaygroundKeybind);
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', handleNewPlaygroundKeybind);
    });

    return { playground, getView, showNewPlaygroundModal, pkg };
  }
});
</script>


<style scoped>
  .playground {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .view {
    display: flex;
    position: relative;
    height: calc(100vh - 30px - 25px);
    width: 100vw;
  }

  .editor-wrapper {
    position: relative;
    overflow: visible;
  }

  .editor-container,
  .output-container {
    height: 100%;
  }

  footer {
    height: 25px;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    padding: 0 1.25rem;
    background-color: var(--gray-900);
    color: var(--cool-gray-500);
    border-top: 1px solid var(--gray-800);
    font-weight: 600;
    justify-content: flex-end;
  }

  footer span {
    margin: 0 0.5rem;
  }

  footer a {
    color: var(--cyan-300);
  }
</style>

<style>
  .automata-large-message {
    margin-top: 3rem;
    padding: 0 1.25rem;
    color: var(--cool-gray-500);
    font-weight: 500;
    text-align: center;
  }

  .automata-large-message button {
    margin-top: 1.5rem;

    padding: 0.5rem 0.75rem;
    font-weight: 600;
    border-radius: 4px;
    border: 1px solid var(--cyan-500);
    box-shadow: 0 3px 8px rgba(var(--black-rgb), 0.3);
    outline: none;
    cursor: pointer;
    color: var(--gray-900);
    background-color: var(--cyan-300);
    transition: all 0.2s ease;
  }
  .automata-large-message button:hover {
    background-color: var(--cyan-400);
    transform: scale(1.1);
  }
</style>