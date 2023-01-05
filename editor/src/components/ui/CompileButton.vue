<template>
  <button title="Compile the program [Alt + Enter]" @click="compile" class="w-16 h-16 rounded-full absolute top-12 -right-16 transform -translate-x-1/2 z-20 inline-flex justify-center items-center border-4 border-solid border-gray-900 focus:outline-none cursor-pointer text-gray-900 bg-cyan-300 transition hover:(bg-cyan-400 scale-110 -translate-x-[45%] shadow-lg)">
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M7 4v16l13 -8z" />
    </svg>
  </button>
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject, onMounted, onUnmounted } from 'vue';
import { Playground } from '../../store/code';

export default defineComponent({
  name: 'CompileButton',
  emits: [ 'triggeredCompile' ],
  setup(_, { emit }) {
    const store = inject<ComputedRef<Playground>>('store');

    const compile = () => {
      store.value.compile();
      emit('triggeredCompile');
    };

    const handleCompileKeybind = (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'Enter') {
        e.preventDefault();
        compile();
      }
    };

    onMounted(() => {
      window.addEventListener('keydown', handleCompileKeybind);
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', handleCompileKeybind);
    });

    return { compile };
  },
});
</script>
