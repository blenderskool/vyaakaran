<a {...$$props} class={`text-cyan-300 inline-block group ${$$props.class || ''}`}>
  <slot />
  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline ml-1 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
</a>