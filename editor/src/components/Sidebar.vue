<template>
  <div class="sidebar-container">
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Sidebar',
});
</script>

<style scoped>
  .sidebar-container {
    position: relative;
    z-index: 20;
    box-shadow: 5px 0 30px rgba(0, 0, 0, 0.3);
  }
</style>