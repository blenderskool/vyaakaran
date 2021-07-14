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
        <a class="px-4 py-3 hover:text-cyan-300" href="https://akashhamirwasia.com/projects/vyaakaran" target="_blank" rel="external">
          How it works
        </a>
        <a class="px-4 py-3 hover:text-cyan-300" href="/request-api">
          API
        </a>
        <a class="px-4 py-3 pr-6 hover:text-cyan-300" href="#">
          About
        </a>
      </div>
      <Button as="a" href="https://vyaakaran.vercel.app/playground/" rel="external">
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

  .hljs-terminal {
    color: #67e8f9;
    font-style: italic;
    font-weight: 600;
  }
  .hljs-non-terminal {
    color: rgb(226, 232, 240);
    font-weight: 500;
  }
  .hljs-separator {
    color: #64748b;
  }
  .hljs-operator, .hljs-comment {
    color: #64748b;
  }
  .hljs-keyword {
    color: #0891b2;
    font-weight: 600;
  }

  .bg-pattern {
    background-color: #0f172a;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%23334155' fill-opacity='0.41' fill-rule='evenodd'/%3E%3C/svg%3E");
  }
</style>