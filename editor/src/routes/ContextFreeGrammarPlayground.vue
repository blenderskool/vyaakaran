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
          <ParseTableExplorer :compiled="store.value.compiled" />
        </Pane>
      </Splitpanes>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';

import Editor from '../components/Editor.vue';
import Console from '../components/Console.vue';
import CompileButton from '../components/ui/CompileButton.vue';
import ParseTableExplorer from '../components/explorers/ParseTable.vue';

import { compile } from '../store/code';

export default defineComponent({
  name: 'ContextFreeGrammarPlayground',
  components: {
    Splitpanes,
    Pane,
    Editor,
    Console,
    CompileButton,
    ParseTableExplorer,
  },
  inject: ['store'],
  setup() {
    return { compile };
  },
});
</script>

<style scoped>
  .output-container, .editor-container {
    width: 50%;
  }
</style>