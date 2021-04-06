<template>
  <span class="key">
    <slot />
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'KeyboardKey',
})
</script>

<style scoped>
  .key {
    background-color: var(--gray-900);
    padding: 4px 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 0.625rem;
    text-align: center;
  }
</style>