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
    padding: 0px 20px 12px;
    font-weight: 500;
    position: relative;
    z-index: 10;
    font-size: 14px;
    background-color: var(--gray-800);
    user-select: none;
  }
</style>