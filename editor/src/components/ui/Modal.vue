<template>
  <teleport to="body">
    <div class="modal-wrapper">
      <div class="modal">
        <header>
          <span>{{ title }}</span>
          <button class="close-btn" @click="() => $emit('close')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <slot />
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, PropType } from 'vue';

export default defineComponent({
  name: 'Modal',
  props: {
    title: {
      type: String as PropType<string>,
      required: true,
    },
  },
  emits: ['close'],
  setup(_, { emit }) {
    const handleEscapeKeybind = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        emit('close');
      }
    };

    onMounted(() => {
      window.addEventListener('keydown', handleEscapeKeybind);
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', handleEscapeKeybind);
    });
  }
});
</script>

<style scoped>
  .modal-wrapper {
    position: fixed;
    z-index: 50;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(var(--black-rgb), 0.6);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal {
    background-color: var(--gray-800);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(var(--black-rgb), 0.8);
    padding: 1rem;
  }

  .modal header {
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal header .close-btn {
    width: 20px;
    height: 20px;
    color: var(--blue-gray-500);
    outline: none;
    transition: all 0.2s ease;
  }
  .modal header .close-btn:hover {
    color: var(--steel-blue-100);
  }
</style>