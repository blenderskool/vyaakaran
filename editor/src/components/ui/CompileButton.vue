<template>
  <button class="run" title="Compile the program [Alt + Enter]" @click="(e) => $emit('triggerCompile', e)">
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-play" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M7 4v16l13 -8z" />
    </svg>
  </button>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue';

export default defineComponent({
  name: 'CompileButton',
  emits: [ 'triggerCompile' ],
  setup(_, { emit }) {

    const handleCompileKeybind = (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'Enter') {
        e.preventDefault();
        emit('triggerCompile');
      }
    };

    onMounted(() => {
      window.addEventListener('keydown', handleCompileKeybind);
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', handleCompileKeybind);
    });
  },
});
</script>

<style scoped>
  .run {
    width: 65px;
    height: 65px;
    border-radius: 100%;
    position: absolute;
    top: 50px;
    left: 45%;
    transform: translateX(-50%);
    z-index: 20;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: 4px solid var(--gray-900);
    outline: none;
    cursor: pointer;
    color: var(--gray-900);
    background-color: var(--emerald-350);
    transition: all 0.2s ease;
  }
  .run:hover {
    background-color: var(--emerald-400);
    transform: scale(1.1) translateX(-45%);
    box-shadow: 0 3px 8px rgba(var(--black-rgb), 0.3);
  }
</style>