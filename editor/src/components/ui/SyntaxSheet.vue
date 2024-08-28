<template>
  <button
    title="Show Syntax Guide [Alt + S]"
    @click="showSyntaxGuide"
    class="w-16 h-16 rounded-full absolute top-12 -right-16 transform -translate-x-1/2 z-20 inline-flex justify-center items-center border-4 border-solid border-gray-900 focus:outline-none cursor-pointer text-gray-900 bg-cyan-300 transition hover:(bg-cyan-400 scale-110 -translate-x-[50%] shadow-lg)"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
      <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
      <path d="M3 6l0 13" />
      <path d="M12 6l0 13" />
      <path d="M21 6l0 13" />
    </svg>
  </button>
  <Teleport to="body">
    <Transition name="fade">
      <SyntaxGuideModal v-if="isSyntaxGuideVisible" @close="closeSyntaxGuide" />
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import SyntaxGuideModal from './SyntaxGuideModel.vue';

const isSyntaxGuideVisible = ref(false);

const showSyntaxGuide = () => {
  isSyntaxGuideVisible.value = true;
};

const closeSyntaxGuide = () => {
  isSyntaxGuideVisible.value = false;
};

const handleSyntaxGuideKeybind = (e: KeyboardEvent) => {
  if (e.altKey && e.code === 'KeyS') {
    e.preventDefault();
    showSyntaxGuide();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleSyntaxGuideKeybind);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleSyntaxGuideKeybind);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
