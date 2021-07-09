<script lang="ts">
  import Button from "../components/Button.svelte";
  import "virtual:windi.css"

  // if you want to enable windi devtools
  import { browser } from "$app/env";
  if (browser) import("virtual:windi-devtools");
</script>


<div class="text-blue-gray-200 bg-blue-gray-900">

  <header class="flex container mx-auto px-8 xl:px-36 pt-8 fixed inset-0 bottom-auto items-center z-50 bg-gradient-to-b from-blue-gray-900 to-transparent text-shadow-md">
    <a class="font-fira tracking-widest font-semibold text-2xl" href="/">
      व<span class="text-cyan-300">y</span>
    </a>
    <nav class="hidden space-x-4 items-center justify-between flex-1 ml-10 font-medium md:flex">
      <div>
        <a class="px-4 py-3 hover:text-cyan-300" href="#">
          How it works
        </a>
        <a class="px-4 py-3 hover:text-cyan-300" href="/request-api">
          API
        </a>
        <a class="px-4 py-3 pr-6 hover:text-cyan-300" href="#">
          About
        </a>
      </div>
      <Button>
        Launch Editor
        <svg xmlns="http://www.w3.org/2000/svg" class="-mt-0.5 inline h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
        </svg>
      </Button>
    </nav>
  </header>

  <main class="pt-40 lg:pt-36 relative overflow-x-hidden">
    <slot />
  </main>

  <footer class="container mx-auto px-8 xl:px-36 pb-10 flex flex-col items-center justify-between md:flex-row">
    <div>
      Vyaakaran
    </div>

    <div class="mt-6 md:mt-0">
      A project by
      <a href="https://akashhamirwasia.com" target="_blank" class="text-cyan-300 font-medium">
        Akash Hamirwasia
      </a>
    </div>
  </footer>

</div>

<style global>
  :root {
    color-scheme: dark;
  }
</style>