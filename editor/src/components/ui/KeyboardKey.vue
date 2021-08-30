<template>
  <span class="bg-gray-900 rounded py-0.5 px-1.5 inline-flex items-center justify-center text-xxs font-semibold text-center">
    <slot />
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'KeyboardKey',
})
</script>
