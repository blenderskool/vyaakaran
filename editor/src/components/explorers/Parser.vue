<template>
  <div class="parser-explorer">
    <PaneHeader>
      <div class="header">
        <span>Parsing table</span>
        <RadioTabs name="FA-type" :options="['LL(1)']" v-model="tableType" />
      </div>
    </PaneHeader>
    <div class="output">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import PaneHeader from '../ui/PaneHeader.vue';
import RadioTabs from '../ui/RadioTabs.vue';

export default defineComponent({
  name: 'ParserExplorer',
  components: {
    PaneHeader,
    RadioTabs,
  },
  inject: ['store'],
  data() {
    return {
      tableType: 'LL(1)',
    };
  },
});
</script>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
  }
</style>