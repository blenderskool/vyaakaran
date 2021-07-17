<script lang="ts" context="module">
	export const prerender = true;
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import IntersectionObserver from 'svelte-intersection-observer';

  import Button from '../components/Button.svelte';
  import LinkCta from '../components/LinkCta.svelte';
  import { hljs } from '../../../editor/src/config/highlight';

  let sectionRG, sectionCFG, sectionConsole;

  let code = '';
  let timeIdx = 0;

  let codeIdx = 0;
  const finalCode = 'S -> a I | F.NI -> a I | b F.NF -> #.'

  $: timeIdx === 5 && setInterval(() => {
      if (codeIdx < finalCode.length) { 
        code += finalCode[codeIdx];
        ++codeIdx;
      }
    }, 175);

  onMount(() => {
    setInterval(() => {
      ++timeIdx;
    }, 175);
  });
</script>

<svelte:head>
  <title>Vyaakaran - Visualize automata, parsers, grammars for free</title>
  <meta name="title" content="Vyaakaran - Visualize automata, parsers, grammars for free">
  <meta property="og:title" content="Vyaakaran - Visualize automata, parsers, grammars for free">
  <meta property="twitter:title" content="Vyaakaran - Visualize automata, parsers, grammars for free">

  <link rel="preload" href="automata.png" as="image" type="image/png">
</svelte:head>

<div class="absolute bg-cyan-500 w-96 h-96 rounded-full filter blur-3xl opacity-[0.07] top-10 left-20" />
<div class="absolute bg-green-500 w-80 h-80 rounded-full filter blur-3xl opacity-[0.07] top-100 right-20 hidden md:block" />

<section class="container mx-auto px-8 xl:px-36 flex sm:(flex-col) lg:(flex-col items-center h-screen)">
  <div class="flex flex-col lg:w-3/5 xl:w-1/2 text-center">
    <h1 class="text-3xl leading-snug font-semibold sm:(text-4xl leading-snug)">
      Visualize automata and parsers in <span class="text-cyan-300">Vyaakaran</span> for free.
    </h1>
    <p class="mt-8 text-blue-gray-400 sm:mt-6">
      Explore regular grammars, regular expressions, context free grammars, parsers, automata and much more
      in a beautiful editor right on the browser.
    </p>
    <div class="mt-14 flex flex-col space-y-6 md:(space-x-6 space-y-0 flex-row) justify-center">
      <Button as="a" href="https://vyaakaran.vercel.app/playground/" rel="external">
        Launch Editor
        <svg xmlns="http://www.w3.org/2000/svg" class="-mt-0.5 inline h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
        </svg>
      </Button>
      <!-- <Button variant="secondary">
        For Teachers
        <svg xmlns="http://www.w3.org/2000/svg" class="-mt-1 inline h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </Button> -->
    </div>
  </div>

  <div class="w-full mt-14 hidden sm:block lg:w-3/5 xl:w-1/2 relative">
    <div class="w-40 h-40 bg-cyan-500 rounded-full absolute top-4 left-4 filter blur-2xl" />
    <div class="bg-dark-900 bg-opacity-90 w-full h-80 rounded-md relative flex shadow-3xl font-medium border border-blue-gray-800">

      <div class="absolute flex space-x-1.5 ml-4 mt-4 mb-1">
        <div class="w-2.5 h-2.5 border-2 border-red-600 rounded-full" />
        <div class="w-2.5 h-2.5 border-2 border-yellow-600 rounded-full" />
        <div class="w-2.5 h-2.5 border-2 border-green-600 rounded-full" />
      </div>

      <div class="w-2/5 flex flex-col">
        <p class="pt-11 px-5 font-fira text-sm">
          {@html hljs.highlight('vyaakaran grammar', code).value.replace(/N/g, '<br />').replace(/> /g, '>&nbsp;')}
          <!-- {@html code.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;')} -->
          <span class="w-1 h-4.5 absolute bg-white inline-block" />
        </p>
        <div class="mt-auto border-t border-blue-gray-800 py-2 px-4 text-xs text-blue-gray-300">
          Console
        </div>
      </div>
      <div class="rounded-full w-10 h-10 bg-gray-900 text-cyan-500 absolute left-2/5 -ml-5 top-7">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="flex flex-col border-l w-3/5 border-blue-gray-800">
        {#if timeIdx > 45 &&  timeIdx < 49}
          <div class="flex justify-center items-center h-full text-blue-gray-300 text-sm">
            <svg class="animate-spin mr-2 h-5 w-5 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading
          </div>
        {:else if timeIdx >= 49}
          <div class="pt-4 px-5 flex-1" transition:fade>
            <div class="text-xs text-blue-gray-300">Finite Automaton</div>
            <img src="automata.png" alt="Generated Finite Automaton" class="mt-4 select-none">
          </div>

          <div class="mt-auto py-2 px-4 border-t border-blue-gray-800" transition:fade>
            <div class="text-xs text-blue-gray-300">Regular Expression</div>
            <p class="text-sm mt-4 mb-2 font-fira hljs-terminal">
              a<sup class="hljs-operator">*</sup> b c<sup class="hljs-operator">*</sup>
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>

</section>

<div id="features" class="bg-pattern pt-14 -mt-14">
  <div class="bg-gradient-to-b from-blue-gray-900 via-transparent to-blue-gray-900 pt-14 -mt-14">

    <section class="container mx-auto px-8 mt-20 pt-14 space-y-36 lg:space-y-56 xl:px-36">
      <IntersectionObserver let:intersecting element={sectionRG} rootMargin="-100px">
        <div bind:this={sectionRG} class="flex flex-col space-y-16 lg:(space-x-16 space-y-0 flex-row) items-center">
          <div class={`lg:w-2/5 text-shadow-lg transform transition duration-500 ${!intersecting ? 'opacity-0 lg:-translate-x-10' : ''}`}>
            <h3 class="text-3xl font-semibold tracking-wide">Regular languages</h3>
            <p class="text-blue-gray-400 mt-6 leading-relaxed font-medium">
              Vyaakaran makes it easy to learn, develop and test regular languages. It supports right linear grammar that gets converted
              to equivalent automata and regular expression. Both Epsilon and Epsilon-free NFAs are generated in the editor.
            </p>
            <LinkCta href="https://vyaakaran.vercel.app/playground/new/rg" rel="external" class="mt-10">Try regular languages</LinkCta>
          </div>
          <div class={`lg:w-3/5 relative transform transition duration-500 ${!intersecting ? 'opacity-0 lg:translate-x-10' : ''}`}>
            <div class="w-56 h-56 bg-cyan-500 rounded-full absolute top-4 left-2 filter blur-2xl opacity-80" />
            <img src="regular-grammar.jpg" class="rounded shadow-3xl border border-blue-gray-800 relative opacity-90" alt="Regular grammar in Vyaakaran" />
          </div>
        </div>
      </IntersectionObserver>

      <IntersectionObserver let:intersecting element={sectionCFG}>
        <div bind:this={sectionCFG} class="flex flex-col space-y-16 lg:(space-x-16 space-x-reverse space-y-0 flex-row-reverse) items-center">
          <div class={`lg:w-2/5 text-shadow-lg transform transition duration-500 ${!intersecting ? 'opacity-0 lg:translate-x-10' : ''}`}>
            <h3 class="text-3xl font-semibold tracking-wide">Context free languages</h3>
            <p class="text-blue-gray-400 mt-6 leading-relaxed font-medium">
              Context free languages are at the heart of parsers. Vyaakaran makes it possible to generate and visualize parse tables
              and automata from CFGs. All the common parser types &mdash; LL(1), LR(0), SLR(1), LALR(1), LR(1) are supported.
            </p>
            <LinkCta href="https://vyaakaran.vercel.app/playground/new/cfg" rel="external" class="mt-10">Try context free languages</LinkCta>
          </div>
          <div class={`lg:w-3/5 relative transform transition duration-500 ${!intersecting ? 'opacity-0 lg:-translate-x-10' : ''}`}>
            <div class="w-56 h-56 sm:(w-80 h-80) bg-cyan-500 rounded-full absolute top-2 left-1/7 filter blur-2xl opacity-50" />
            <img src="context-free-grammar.jpg" class="rounded shadow-3xl border border-blue-gray-800 relative opacity-90" alt="Context free grammar in Vyaakaran" />
          </div>
        </div>
      </IntersectionObserver>

      <IntersectionObserver let:intersecting element={sectionConsole}>
        <div bind:this={sectionConsole} class="flex flex-col space-y-16 lg:(space-x-16 space-y-0 flex-row) items-center">
          <div class={`lg:w-2/5 text-shadow-lg transform transition duration-500 ${!intersecting ? 'opacity-0 lg:-translate-x-10' : ''}`}>
            <h3 class="text-3xl font-semibold tracking-wide">Powerful testing tools</h3>
            <p class="text-blue-gray-400 mt-6 leading-relaxed font-medium">
              Testing grammars are crucial when writing them. Vyaakaran can check whether a string gets accepted by a grammar,
              generate a set of example strings from the grammar and perform a bunch of other checks like left-recursion, unreachability, etc.
            </p>
            <LinkCta href="https://vyaakaran.vercel.app/playground/" rel="external" class="mt-10">Try Vyaakaran console</LinkCta>
          </div>
          <div class={`lg:w-3/5 relative transform transition duration-500 ${!intersecting ? 'opacity-0 lg:translate-x-10' : ''}`}>
            <div class="w-56 h-56 bg-cyan-500 rounded-full absolute top-4 left-40 filter blur-2xl opacity-80" />
            <img src="console.jpg" class="max-h-lg rounded shadow-3xl border border-blue-gray-800 relative opacity-90 mx-auto" alt="Vyaakaran Console" />
          </div>
        </div>
      </IntersectionObserver>
    </section>

    <section class="container mx-auto px-8 mt-36 lg:mt-56 xl:px-36">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div class="flex flex-col justify-between bg-blue-gray-800 py-8 px-8 rounded-2xl shadow-lg text-shadow-md">
          <div>
            <h3 class="text-2xl font-medium flex items-center justify-between">
              Image exports
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 inline text-blue-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </h3>
            <p class="text-blue-gray-400 mt-6 text-sm leading-relaxed">
              Automata visualizations created in Vyaakaran can be exported as high resolution PNG images that can be easily embedded in slides and documents.
            </p>
          </div>
          <LinkCta href="https://vyaakaran.vercel.app/playground/" rel="external" class="mt-8">Try the editor</LinkCta>
        </div>

        <div class="flex flex-col justify-between bg-blue-gray-800 py-8 px-8 rounded-2xl shadow-lg text-shadow-md">
          <div>
            <h3 class="text-2xl font-medium flex items-center justify-between">
              Browser based
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 inline text-blue-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </h3>
            <p class="text-blue-gray-400 mt-6 text-sm leading-relaxed">
              Vyaakaran runs completely on the browser and does not require installation of any software on the system.
              All the development, compilation and testing happens on the browser and is not processed on any server.
            </p>
          </div>

          <LinkCta href="https://akashhamirwasia.com/projects/vyaakaran" rel="external" target="_blank" class="mt-8">See how it works</LinkCta>
        </div>

        <div class="flex flex-col justify-between bg-blue-gray-800 py-8 px-8 rounded-2xl shadow-lg text-shadow-md">
          <div>
            <h3 class="text-2xl font-medium flex items-center justify-between">
              Easy syntax
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 inline text-blue-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </h3>
            <p class="text-blue-gray-400 mt-6 text-sm leading-relaxed">
              Vyaakaran's grammar syntax is based on the syntax taught in colleges and found in various literatures. Thus, very minimal learning
              is required to get familiar with the Vyaakaran syntax.
            </p>
          </div>

          <LinkCta href="/docs/syntax" class="mt-8">Learn the syntax</LinkCta>
        </div>
      </div>
    </section>
  </div>
</div>

<section class="container mx-auto px-8 xl:px-36 my-42 text-center">
  <h2 class="text-3xl sm:text-4xl font-semibold">
    Try <span class="text-cyan-300">Vyaakaran</span> today
  </h2>
  <p class="mt-4 text-blue-gray-400">Vyaakaran is free to use</p>
  <div class="mt-12 flex flex-col space-y-6 md:(space-x-6 space-y-0 flex-row) justify-center">
    <Button as="a" href="https://vyaakaran.vercel.app/playground/" rel="external">
      Launch Editor
      <svg xmlns="http://www.w3.org/2000/svg" class="-mt-0.5 inline h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
      </svg>
    </Button>
    <!-- <Button variant="secondary">
      For Teachers
      <svg xmlns="http://www.w3.org/2000/svg" class="-mt-1 inline h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    </Button> -->
  </div>
</section>
