<template>
  <div>
    <Splitpanes class="editor-container" horizontal>
      <Pane>
        <Editor />
      </Pane>
      <Console />
    </Splitpanes>

    <div class="output-container">
      <CompileButton @click="compile" />

      <Splitpanes horizontal v-if="store.value.compiled && !store.value.compiled.errors.length">
        <Pane min-size="6.5">
          <FiniteAutomataExplorer :compiled="store.value.compiled" :key="`FA ${store.value.progKey}`" />
        </Pane>
        <Pane min-size="6.5" max-size="20.8" size="20.8">
          <RegExExplorer :compiled="store.value.compiled" :key="`RegEx ${store.value.progKey}`" />
        </Pane>
      </Splitpanes>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Pane, Splitpanes } from 'splitpanes';

import Console from '../components/Console.vue';
import Editor from '../components/Editor.vue';
import CompileButton from '../components/ui/CompileButton.vue';
import FiniteAutomataExplorer from '../components/FiniteAutomataExplorer.vue';
import RegExExplorer from '../components/RegExExplorer.vue';

import { compile } from '../store/code';

export default defineComponent({
  name: 'RegularGrammarPlayground',
  components: {
    Pane,
    Splitpanes,
    Console,
    Editor,
    CompileButton,
    FiniteAutomataExplorer,
    RegExExplorer,
  },
  inject: ['store'],
  setup() {
    return { compile };
  }
});
</script>

<style scoped>
  .output-container, .editor-container {
    width: 50%;
  }
</style>