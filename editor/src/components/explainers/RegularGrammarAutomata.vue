<template>
  <Pane class="bg-gray-900 py-5 px-8" min-size="25" size="45">
    <header class="flex justify-between">
      <h2 class="text-2xl font-semibold">Finite Automata conversion</h2>
      <button class="secondary-btn" @click="router.back()">
        Exit explanation
      </button>
    </header>
    <div class="grid grid-cols-2 gap-4 my-10 h-8">
      <button class="secondary-btn" @click="prev">Previous step</button>
      <button class="secondary-btn" @click="next">Next step</button>
    </div>
    <div class="space-y-2">
      <p v-if="step.rule">
        <span class="text-cool-gray-500 font-semibold">
          ⚙ Processing production:&nbsp;&nbsp;
        </span>
        <span
          class="font-fira font-medium"
          v-html="hljs.highlight('vyaakaran grammar', step.rule).value"
        />
      </p>
      <p>
        <span class="text-cool-gray-500 font-semibold">
          Description:&nbsp;&nbsp;
        </span>
        {{ step.step }}
      </p>
    </div>
    <h3 class="font-semibold mt-8">Grammar productions</h3>
    <table class="output-table mt-6 !border-none">
      <tbody>
        <tr v-for="rule in rules" :key="rule">
          <td class="text-cyan-400 !border-none !pl-0">
            {{ rule === step.rule ? '->' : '' }}
          </td>
          <td v-html="hljs.highlight('vyaakaran grammar', rule).value" />
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

<script lang="ts" setup>
import { ComputedRef, inject, onMounted, ref } from 'vue';
import { Pane } from 'splitpanes';
import { useRouter } from 'vue-router';
import {
  RegularGrammar,
  type ParseTree,
} from '@vyaakaran/compiler/regular-grammar';
import {
  IterateGenerator,
  SimplifiedGrammarRepresentation,
} from '@vyaakaran/compiler/utils';

import { hljs } from '../../config/highlight';
import { Playground } from '../../store/code';
import FiniteAutomataExplorer from '../explorers/FiniteAutomata.vue';

const playground = inject('store') as ComputedRef<Playground>;
const compiled = playground.value.compiled as RegularGrammar;
const step = ref({ graph: null, step: '', rule: '' });
const rules = ref<string[]>([]);
const router = useRouter();

let generator: any;

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
  rules.value = new SimplifiedGrammarRepresentation(
    compiled.parseTree as ParseTree
  ).rules.map((rule) => rule.toString());
});
</script>
