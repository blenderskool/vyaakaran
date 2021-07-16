<template>
  <div class="container">
    <img class="illustration" src="../../assets/empty-playground.svg" />
    <p>
      Write the grammar and click
      <span class="highlight">
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

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .illustration {
    opacity: 0.8;
    width: 14rem;
  }

  p {
    margin-top: 2rem;
    font-weight: 500;
    font-size: 1.25rem;
    color: var(--cool-gray-500);
    text-align: center;
    line-height: 1.75;
  }

  .highlight {
    color: var(--cyan-300);
  }
</style>