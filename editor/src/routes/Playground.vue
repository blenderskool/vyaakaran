<template>
  <div class="playground">
    <EditorTabs @new-playground="() => showNewPlaygroundModal = true" />

    <div class="view">
      <Splitpanes class="editor-container" horizontal :dbl-click-splitter="false">
        <Pane>
          <Editor />
        </Pane>
        <Console />
      </Splitpanes>

      <component :is="getView()" class="output-container" />
    </div>
    <NewPlaygroundModal v-if="showNewPlaygroundModal" @close="() => showNewPlaygroundModal = false" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, provide, ref } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';

import { getActivePlayground } from '../store/code';

import NewPlaygroundModal from '../components/NewPlaygroundModal.vue';
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

    return { playground, getView, showNewPlaygroundModal };
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
    height: calc(100vh - 40px);
    width: 100vw;
  }

  .editor-container, .output-container {
    width: 50%;
  }
</style>
