<template>
  <div>
    <CompileButton @click="() => store.value.compile()" />

    <Splitpanes horizontal v-if="store.value.progKey && !store.value.compiled.errors.length" :dbl-click-splitter="false">
      <Pane min-size="4">
        <ParseTableExplorer :compiled="store.value.compiled" />
      </Pane>
      <Pane min-size="4" max-size="50">
        <FirstFollowExplorer :compiled="store.value.compiled" />
      </Pane>
    </Splitpanes>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';

import Editor from '../Editor.vue';
import Console from '../Console.vue';
import CompileButton from '../ui/CompileButton.vue';
import ParseTableExplorer from '../explorers/ParseTable.vue';
import FirstFollowExplorer from '../explorers/FirstFollow.vue';

export default defineComponent({
  name: 'ContextFreeGrammarPlayground',
  components: {
    Splitpanes,
    Pane,
    Editor,
    Console,
    CompileButton,
    ParseTableExplorer,
    FirstFollowExplorer,
  },
  inject: ['store'],
});
</script>