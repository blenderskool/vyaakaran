<template>
  <header class="pt-0.5 px-5 pb-2 font-medium relative z-10 text-xs bg-gray-800 select-none">
    <div class="info">
      <slot />
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PaneHeader',
});
</script>
