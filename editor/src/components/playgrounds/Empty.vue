<template>
  <div class="flex flex-col items-center justify-center">
    <p class="font-medium text-lg leading-8 font-fira text-cool-gray-500 text-center">
      Write some grammar and click<br />
      <span class="text-cyan-300">
        Play button
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
