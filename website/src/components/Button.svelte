<script lang="ts">
  export let as: string = 'button';
  export let variant: 'primary' | 'secondary' = 'primary';

  let classes = {
    primary: `bg-cyan-300 rounded text-blue-gray-900 px-5 py-2 font-semibold shadow-lg text-shadow-none transition transform hover:(scale-105 bg-cyan-400) ${$$props.class}`,
    secondary: `bg-cyan-300 bg-opacity-10 rounded text-cyan-300 px-5 py-2 font-medium shadow-lg text-shadow-none transition transform hover:(scale-105 bg-opacity-20) disabled:(cursor-not-allowed opacity-75 scale-100) ${$$props.class}`,
  };
</script>

{#if as === 'button'}
  <button {...$$props} class={classes[variant]}>
    <slot />
  </button>
{:else if as === 'a'}
  <a {...$$props} class={classes[variant]}>
    <slot />
  </a>
{/if}
