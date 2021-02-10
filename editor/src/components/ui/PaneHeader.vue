<template>
  <header>
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

<style scoped>
  header {
    padding: 10px 20px 20px;
    font-weight: 500;
    position: relative;
    z-index: 10;
    background-color: #27272A;
  }
</style>