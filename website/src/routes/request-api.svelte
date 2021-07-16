<script lang="ts">
  import { onMount } from 'svelte';

  import Button from '../components/Button.svelte';
  let request;
  let status: 'LOADING' | 'SUCCESS' | 'ERROR' | undefined;

  onMount(() => {
    const script = document.createElement('script');
    script.src = 'https://hcaptcha.com/1/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    window.submitRequest = async () => {
      if (status === 'LOADING') return;

      try {
        status = 'LOADING';
        await fetch('/api/request-api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            request,
            hcaptcha: window.hcaptcha.getResponse(),
          }),
        });
        request = '';
        status = 'SUCCESS';
      } catch(err) {
        status = 'ERROR';
      } finally {
        window.hcaptcha.reset();
      }
    };
  });
</script>

<svelte:head>
  <title>Request API | Vyaakaran</title>
</svelte:head>


<div class="absolute bg-cyan-500 w-96 h-96 rounded-full filter blur-3xl opacity-[0.07] top-10 left-20" />
<div class="absolute bg-green-500 w-80 h-80 rounded-full filter blur-3xl opacity-[0.07] top-100 right-20 hidden md:block" />

<section class="container mx-auto px-8 justify-center h-screen xl:px-36 flex sm:(flex-col -mt-36) lg:( flex-col items-center)">
  <div class="lg:w-3/5 sm:text-center">
    <h1 class="text-3xl leading-snug font-semibold sm:(text-4xl leading-snug)">
      Build more with <span class="text-cyan-300">Vyaakaran</span> API.
    </h1>
    <p class="mt-8 text-blue-gray-400 text-lg sm:mt-6">
      Vyaakaran's API is still on the roadmap. Please let me know how you plan on using it,
      as it would help me in designing the API better.
    </p>
    <form on:submit|preventDefault class="mt-16 mx-auto flex flex-col relative justify-center space-y-6 md:w-3/5 lg:items-start">
      <textarea
        class="w-full p-4 resize-none rounded-md bg-dark-900 border border-blue-gray-800 shadow-3xl focus:outline-none focus:ring-2 ring-cyan-600 placeholder-blue-gray-400"
        placeholder="Enter the request..."
        rows="6"
        bind:value={request}
        required
        disabled={status === 'LOADING'}
      />
      <Button variant="secondary" disabled={!request || status === 'LOADING'} class="h-captcha" data-sitekey="b872a34f-dae3-4252-af26-e9234e41ef96" data-theme="dark" data-callback="submitRequest">
        {#if status === 'LOADING'}
          <div class="flex items-center">
            Submitting
            <svg class="animate-spin ml-2 h-5 w-5 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        {:else}
          Submit
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline -mt-1.5 transform rotate-45 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        {/if}
      </Button>
      <div>
        {#if status === 'SUCCESS'}
          <span class="text-green-400 flex items-center font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Thanks for the request!
          </span>
        {:else if status === 'ERROR'}
          <span class="text-red-400 flex items-center font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            There was an error, please try again.
          </span>
        {/if}
      </div>
    </form>
  </div>
</section>

<style>
  .h-captcha {
    color-scheme: initial;
  }
</style>