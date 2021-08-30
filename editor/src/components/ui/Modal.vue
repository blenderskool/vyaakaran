<template>
  <teleport to="body">
    <FadeTransition appear>
      <div v-if="show" class="fixed z-50 inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center pointer-events-none">
        <GrowSlideTransition appear>
          <div v-if="show" class="bg-gray-800 rounded-md shadow-xl px-6 py-4 pointer-events-auto">
            <header class="mb-6 text-sm font-medium flex justify-between items-center">
              <h3 class="text-lg font-semibold">{{ title }}</h3>
              <button class="w-5 h-5 text-blue-gray-600 focus:outline-none transition hover:text-steel-blue-100" @click="() => $emit('close')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>
            <slot />
          </div>
        </GrowSlideTransition>
      </div>
    </FadeTransition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import useKeyShortcut from '../../utils/useKeyShortcut';

export default defineComponent({
  name: 'Modal',
  props: {
    show: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    title: {
      type: String as PropType<string>,
      required: true,
    },
  },
  emits: ['close'],
  setup(_, { emit }) {
    // Modal close hotkey
    useKeyShortcut('Escape', () => emit('close'));
  },
});
</script>
