<template>
  <div class="flex flex-col items-center justify-center">
    <p class="font-medium text-lg leading-8 font-fira text-cool-gray-500 text-center">
      {{
        store.type === "TM"
        ? "Write some state transitions and click"
        : "Write some grammar and click"
      }}
      <br />
      <span class="text-cyan-300">
        Play button
      </span>
      for some magic 🪄
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ComputedRef, inject } from 'vue';
import { Playground } from '../../store/code';

const store = inject('store') as ComputedRef<Playground>;
</script>
