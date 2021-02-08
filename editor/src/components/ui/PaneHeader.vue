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
    padding: 10px 20px;
    font-weight: 500;
  }
</style>