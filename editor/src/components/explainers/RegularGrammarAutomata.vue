<template>
  <Pane class="bg-gray-900 py-5 px-8" min-size="25" size="45">
    <header class="flex justify-between">
      <h2 class="text-2xl font-semibold">Finite Automata conversion</h2>
      <button class="secondary-btn" @click="$router.back()">
        Exit explanation
      </button>
    </header>
    <div class="grid grid-cols-2 gap-4 my-10 h-8">
      <button class="secondary-btn" @click="prev">
        Previous step
      </button>
      <button class="secondary-btn" @click="next">
        Next step
      </button>
    </div>
    <div class="space-y-2">
      <p v-if="step.rule">
        <span class="text-cool-gray-500 font-semibold">⚙ Processing production:&nbsp;&nbsp;</span>
        <span class="font-fira font-medium" v-html="hljs.highlight('vyaakaran grammar', step.rule).value" />
      </p>
      <p>
        <span class="text-cool-gray-500 font-semibold">Description:&nbsp;&nbsp;</span>
        {{ step.step }}
      </p>
    </div>
    <h3 class="text-lg font-semibold mt-8">Grammar productions</h3>
    <table class="mt-6">
      <tbody>
        <tr v-for="rule in rules" :key="rule">
          <td v-html="hljs.highlight('vyaakaran grammar', rule).value" :class="{ 'rounded-sm z-10 relative ring-2 ring-cyan-300': rule === step.rule }" />
        </tr>
      </tbody>
    </table>
  </Pane>
  <Pane min-size="45">
    <FiniteAutomataExplorer
      v-if="step.graph"
      :getGraph="() => step.graph"
      :showTypeSelector="false"
      :showExplainationOption="false"
    />
  </Pane>
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject, onMounted, ref } from 'vue';
import { Pane } from 'splitpanes';
import { hljs } from '../../config/highlight';

import { RegularGrammar } from '../../../../compiler/src/regular-grammar';
import { IterateGenerator, SimplifiedGrammarRepresentation } from '../../../../compiler/src/utils';
import { Playground } from '../../store/code';
import FiniteAutomataExplorer from '../explorers/FiniteAutomata.vue';

export default defineComponent({
  name: 'RegularGrammarAutomataExplainer',
  components: {
    FiniteAutomataExplorer,
    Pane,
  },
  setup() {
    const playground: ComputedRef<Playground> = inject('store');
    const compiled = playground.value.compiled as RegularGrammar;
    const step = ref({ graph: null, step: '', rule: '' });
    const rules = ref<string[]>([]);

    let generator;

    const next = () => {
      const nextValue = generator.next();
      if (nextValue === undefined) return;
      step.value = nextValue.value;
    };

    const prev = () => {
      const prevValue = generator.prev();
      if (prevValue === undefined) return;
      step.value = prevValue.value;
    };

    onMounted(() => {
      if (!compiled) return;

      generator = new IterateGenerator(compiled.toFAGenerator());
      next();
      rules.value = new SimplifiedGrammarRepresentation(compiled.parseTree).rules.map((rule) => rule.toString());
    });


    return { next, prev, step, rules, hljs };
  },
});
</script>
