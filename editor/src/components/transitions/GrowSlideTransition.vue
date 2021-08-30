<template>
  <transition
    enter-from-class="translate-y-4 scale-95"
    enter-to-class="translate-y-0 scale-100"
    enter-active-class="transition transform"
    leave-active-class="transition transform"
    leave-from-class="translate-y-0 scale-100"
    leave-to-class="translate-y-4 scale-95"
    v-bind="$attrs"
  >
    <slot />
  </transition>
</template>
