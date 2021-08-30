<template>
  <div class="flex flex-col items-center justify-center">
    <img class="opacity-80 w-56" src="../../assets/empty-playground.svg" />
    <p class="mt-8 font-medium text-xl text-cool-gray-500 text-center">
      Write some grammar and click
      <span class="text-cyan-300">
        Play
      </span>
      for some magic 🪄
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EmptyPlayground', 
});
</script>
