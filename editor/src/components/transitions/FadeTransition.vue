<template>
  <transition enter-active-class="transition" leave-active-class="transition" enter-from-class="opacity-0" leave-to-class="opacity-0" v-bind="$attrs">
    <slot />
  </transition>
</template>
