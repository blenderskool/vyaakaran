<template>
  <transition name="fade" enter-active-class="transition" leave-active-class="transition" enter-from-class="opacity-0" leave-to-class="opacity-0" appear>
    <slot />
  </transition>
</template>
