<script lang="ts">
  export let variant: 'primary' | 'secondary' = 'primary';
</script>

{#if variant === 'primary'}
  <button {...$$props} class={`bg-cyan-300 rounded text-blue-gray-900 px-5 py-2 font-semibold shadow-lg transition transform hover:(scale-105 bg-cyan-400) ${$$props.class}`}>
    <slot />
  </button>
{:else if variant === 'secondary'}
  <button {...$$props} class={`bg-cyan-300 bg-opacity-10 rounded text-cyan-300 px-5 py-2 font-medium shadow-lg transition transform hover:(scale-105 bg-opacity-20) disabled:(cursor-not-allowed opacity-75 scale-100) ${$$props.class}`}>
    <slot />
  </button>
{/if}
