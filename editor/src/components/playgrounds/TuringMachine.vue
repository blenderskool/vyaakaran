<template>
  <Splitpanes
    horizontal
    :dbl-click-splitter="false"
    v-if="store.progKey && !store.compiled.errors.length"
  >
    <Pane size="45" class="pt-3">
      <PaneHeader>Turing Machine</PaneHeader>
      <Tape
        :showButtons="showButtons"
        ref="childComponentRef"
        :instructions="tapeInstructions"
        @toggleShowButtons="
          showButtons = false;
          inputString = '';
        "
        :isAccepted="isAccepted"
      ></Tape>
      <form
        class="form"
        @submit.prevent="handleInputSubmit"
        v-if="!showButtons"
      >
        <div class="input-container">
          <input
            class="input-box"
            type="text"
            placeholder="Enter the string"
            v-model="inputString"
          />
          <button type="submit" class="submit-btn">Submit</button>
        </div>
      </form>
    </Pane>
    <Pane size="55" max-size="95">
      <TMStateTransitionGraph
        :key="`TM ${store.progKey}`"
        :getGraph="(store.compiled.parseTree as TuringMachineParseTree)"
        class="h-full w-full"
      ></TMStateTransitionGraph>
    </Pane>
  </Splitpanes>
  <Empty v-else />
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject, ref } from 'vue';
import { Pane, Splitpanes } from 'splitpanes';
import { TestInput } from '../../../../compiler/src/turing-machine/input';
import { TuringMachineParseTree } from '../../../../compiler/src/turing-machine/types';
import PaneHeader from '../ui/PaneHeader.vue';
import Tape from '../explorers/Tape.vue';
import TMStateTransitionGraph from '../explorers/TMStateTransitionGraph.vue';
import Empty from './Empty.vue';
import { Playground } from '../../store/code';

interface Instructions {
  charArray: string[];
  moveDir: number;
}

export default defineComponent({
  name: 'TuringMachinePlayground',
  components: {
    Splitpanes,
    Pane,
    PaneHeader,
    Tape,
    TMStateTransitionGraph,
    Empty,
  },
  setup() {
    const childComponentRef = ref();
    const showButtons = ref<boolean>(false);
    const inputString = ref<string>('');
    const tapeInstructions = ref<Instructions[]>([]);
    const store = inject('store') as ComputedRef<Playground>;
    const isAccepted = ref<boolean>(false);

    const handleInputSubmit = () => {
      showButtons.value = true;
      childComponentRef.value.loadTM(inputString.value);
      let testobj = new TestInput(
        inputString.value,
        (store.value.compiled.parseTree as TuringMachineParseTree)
      );

      let strgen = testobj.CheckString();
      let tmp = new Array();
      do {
        let tr = strgen.next();
        tmp.push(JSON.parse(JSON.stringify(tr)));
      } while (!strgen.next().done);

      isAccepted.value = tmp[tmp.length - 1].value.accepted;

      tapeInstructions.value = tmp.map((inst) => {
        return {
          moveDir: inst.value.moveDir,
          charArray: inst.value.string,
        };
      });
    };

    return {
      store,
      showButtons,
      inputString,
      handleInputSubmit,
      tapeInstructions,
      childComponentRef,
      isAccepted,
    };
  },
});
</script>

<style scoped>
.form {
  @apply flex justify-center mt-5;
}

.input-container {
  @apply flex items-center border-b-[1.5px] border-cyan-400 py-2;
}

.input-box {
  @apply appearance-none bg-transparent border-none w-full text-cyan-300 mr-3 py-1 px-2 text-xs placeholder-cool-gray-500 leading-tight text-lg outline-none;
}

.submit-btn {
  @apply rounded border-1 border-solid border-cyan-400 bg-cyan-500 bg-opacity-10 text-cyan-400 px-2 py-1 text-sm font-semibold outline-none hover:bg-opacity-20;
}
</style>
