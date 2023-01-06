<template>
  <div>
    <div class="h-10 flex flex-col justify-center">
      <p v-if="isDone() && isAccepted" class="flex justify-center bg-transparent text-green-400 text-sm font-semibold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        Input string has been accepted by the Turing Machine
      </p>
      <p v-else-if="isDone() && !isAccepted" class="flex justify-center bg-transparent text-red-500 text-sm font-semibold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        Input string has been rejected by the Turing Machine
      </p>
    </div>
    <div class="p-8">
      <div class="mx-auto max-w-full relative pl-1/2">
        <div class="flex transition" :style="{ transform: `translateX(${headPosition - CENTER_CELL_IDX * CELL_WIDTH - CELL_WIDTH / 2}px)` }">
          <div
            v-for="ele, i in TArray"
            :key="i"
            class="ring-2 ring-cool-gray-600 inline-flex flex-shrink-0 items-center justify-center relative bg-gray-800 shadow-inner-md"
            :style="{ width: `${CELL_WIDTH}px`, height: `${CELL_WIDTH}px` }"
          >
            {{ ele.val }}
          </div>
        </div>
        <div class="w-18 h-18 border-2 border-cyan-300 rounded absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
    <div class="flex" v-if="showButtons">
      <button class="btn ml-auto" @click="resetHandler">
        Reset
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </button>
      <button
        class="btn ml-5"
        @click="previousStepHandler"
        :disabled="stepCount === 1 || isPlaying"
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"
            />
          </svg>
        </span>
        <span>Previous Step</span>
      </button>
      <button
        class="btn mx-5"
        @click="nextStepHandler"
        :disabled="isDone() || isPlaying"
      >
        <span>Next Step</span>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"
            />
          </svg>
        </span>
      </button>

      <button class="btn mr-auto" @click="pauseHandler" v-if="isPlaying">
        Pause
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </button>
      <button
        class="btn mr-auto"
        @click="playHandler"
        v-else
        :disabled="isDone()"
      >
        Play
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </button>
    </div>
    <div
      @click="anotherInputHandler"
      v-if="showButtons"
      class="flex justify-center text-cyan-400 mt-7 text-sm font-semibold hover:underline hover:cursor-pointer"
    >
      Want to enter another string?
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, readonly, ref } from 'vue';

interface itType {
  val: string;
}
interface Instructions {
  charArray: string[];
  moveDir: number;
}

export default defineComponent({
  name: 'Tape',
  emits: ['toggleShowButtons'],
  props: {
    showButtons: { type: Boolean as PropType<boolean>, required: true },
    instructions: {
      type: Array as PropType<Instructions[]>,
      required: true,
    },
    isAccepted: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const NUM_CELLS = readonly(ref(500));
    const CELL_WIDTH = readonly(ref(48));
    const CENTER_CELL_IDX = readonly(computed(() => NUM_CELLS.value / 2));
    const TArray = ref<itType[]>([]);
    const stepCount = ref<number>(1);
    const inputString = ref<string>('');
    const isPlaying = ref<boolean>(false);
    const TID = ref();
    const headPosition = ref(0);

    onMounted(() => {
      for (let i = 0; i < NUM_CELLS.value; ++i) {
        TArray.value.push({ val: ' ' });
      }
    });

    const nextStep = (move: number) => {
      if (move < 0) {
        let index = props.instructions[stepCount.value - 1].moveDir;
        let i = 0;
        const intervalID = setInterval(
          () => {
            if (
              TArray.value[CENTER_CELL_IDX.value + index - 100].val !==
              props.instructions[stepCount.value].charArray[index]
            ) {
              TArray.value[CENTER_CELL_IDX.value + index - 100].val =
                props.instructions[stepCount.value].charArray[
                  index
                ] === '#'
                  ? ' '
                  : props.instructions[stepCount.value]
                      .charArray[index];
            }
            headPosition.value += CELL_WIDTH.value;
            index--;
            i++;
            if (i === move * -1) {
              clearInterval(intervalID);
              stepCount.value++;
            }
          },
          isPlaying.value ? 1000 : 500
        );
      } else if (move > 0) {
        let index = props.instructions[stepCount.value - 1].moveDir;
        let i = 0;
        const intervalID = setInterval(
          () => {
            if (
              TArray.value[CENTER_CELL_IDX.value + index - 100].val !==
              props.instructions[stepCount.value].charArray[index]
            ) {
              TArray.value[CENTER_CELL_IDX.value + index - 100].val =
                props.instructions[stepCount.value].charArray[
                  index
                ] === '#'
                  ? ' '
                  : props.instructions[stepCount.value]
                      .charArray[index];
            }
            headPosition.value -= CELL_WIDTH.value;
            index++;
            i++;
            if (i === move) {
              clearInterval(intervalID);
              stepCount.value++;
            }
          },
          isPlaying.value ? 1000 : 500
        );
      } else {
        let index = props.instructions[stepCount.value].moveDir;
        if (
          props.instructions[stepCount.value].charArray[index] !==
          TArray.value[CENTER_CELL_IDX.value + index - 100].val
        ) {
          TArray.value[CENTER_CELL_IDX.value + index - 100].val =
            props.instructions[stepCount.value].charArray[index] ===
            '#'
              ? ' '
              : props.instructions[stepCount.value].charArray[
                  index
                ];
        }
        stepCount.value++;
      }
    };

    const prevStep = (move: number) => {
      if (move < 0) {
        let index = props.instructions[stepCount.value - 1].moveDir;
        let i = 0;
        const intervalID = setInterval(
          () => {
            if (
              TArray.value[CENTER_CELL_IDX.value + index - 100].val !==
              props.instructions[stepCount.value - 2].charArray[
                index
              ]
            ) {
              TArray.value[CENTER_CELL_IDX.value + index - 100].val =
                props.instructions[stepCount.value - 2]
                  .charArray[index] === '#'
                  ? ' '
                  : props.instructions[stepCount.value - 2]
                      .charArray[index];
            }
            headPosition.value += CELL_WIDTH.value;
            index--;
            i++;
            if (i === move * -1) {
              clearInterval(intervalID);
              stepCount.value--;
              if (stepCount.value - 1 === 0) {
                loadTM(inputString.value);
              }
            }
          },
          isPlaying.value ? 1000 : 500
        );
      } else if (move > 0) {
        let index = props.instructions[stepCount.value - 1].moveDir;
        let i = 0;
        const intervalID = setInterval(
          () => {
            if (
              TArray.value[CENTER_CELL_IDX.value + index - 100].val !==
              props.instructions[stepCount.value - 2].charArray[
                index
              ]
            ) {
              TArray.value[CENTER_CELL_IDX.value + index - 100].val =
                props.instructions[stepCount.value - 2]
                  .charArray[index] === '#'
                  ? ' '
                  : props.instructions[stepCount.value - 2]
                      .charArray[index];
            }
            headPosition.value -= CELL_WIDTH.value;
            index++;
            i++;
            if (i === move) {
              clearInterval(intervalID);
              stepCount.value--;
              if (stepCount.value - 1 === 0) {
                loadTM(inputString.value);
              }
            }
          },
          isPlaying.value ? 1000 : 500
        );
      } else {
        let index = props.instructions[stepCount.value - 2].moveDir;
        if (
          props.instructions[stepCount.value - 2].charArray[index] !==
          TArray.value[CENTER_CELL_IDX.value + index - 100].val
        ) {
          TArray.value[CENTER_CELL_IDX.value + index - 100].val =
            props.instructions[stepCount.value - 2].charArray[
              index
            ] === '#'
              ? ' '
              : props.instructions[stepCount.value - 2].charArray[
                  index
                ];
        }
        stepCount.value--;
      }
    };

    const nextStepHandler = () => {
      nextStep(
        props.instructions[stepCount.value].moveDir -
          props.instructions[stepCount.value - 1].moveDir
      );
    };
    const previousStepHandler = () => {
      prevStep(
        props.instructions[stepCount.value - 2].moveDir -
          props.instructions[stepCount.value - 1].moveDir
      );
    };

    const playHandler = () => {
      isPlaying.value = true;

      let timeoutID = setTimeout(function myTimer() {
        TID.value = timeoutID;
        nextStep(
          props.instructions[stepCount.value].moveDir -
            props.instructions[stepCount.value - 1].moveDir
        );
        if (
          stepCount.value === props.instructions.length ||
          isPlaying.value === false
        ) {
          isPlaying.value = false;
          clearTimeout(timeoutID);
        } else {
          timeoutID = setTimeout(
            myTimer,
            Math.abs(
              props.instructions[stepCount.value].moveDir -
                props.instructions[stepCount.value - 1].moveDir
            ) * 1000
          );
        }
      }, 0);
    };

    const resetHandler = () => {
      isPlaying.value = false;
      stepCount.value = 1;
      headPosition.value = 0;
      loadTM(inputString.value);
    };

    const pauseHandler = () => {
      isPlaying.value = !isPlaying.value;
      clearTimeout(TID.value);
    };

    const anotherInputHandler = () => {
      emit('toggleShowButtons');
      inputString.value = '';
      stepCount.value = 1;
      isPlaying.value = false;
      headPosition.value = 0;
      for (let i = 0; i < NUM_CELLS.value; ++i) {
        TArray.value[i].val = ' ';
      }
    };

    const loadTM = (input: string) => {
      inputString.value = input;
      for (let i = 0, j = 0; i < NUM_CELLS.value; ++i) {
        if (i >= CENTER_CELL_IDX.value && i < CENTER_CELL_IDX.value + input.length) {
          TArray.value[i].val = input[j];
          ++j;
        } else {
          TArray.value[i].val = '';
        }
      }
    };

    const isDone = () => {
      return stepCount.value === props.instructions.length;
    };

    return {
      CELL_WIDTH,
      CENTER_CELL_IDX,
      headPosition,
      TArray,
      nextStep,
      nextStepHandler,
      resetHandler,
      playHandler,
      loadTM,
      isPlaying,
      pauseHandler,
      isDone,
      anotherInputHandler,
      stepCount,
      previousStepHandler,
    };
  },
});
</script>

<style scoped>

.text-anchor-middle {
  text-anchor: middle;
}

.btn {
  /* @apply flex bg-cyan-300 rounded text-blue-gray-800 pl-5 pr-3 py-2 font-semibold text-sm shadow-lg text-shadow-none outline-none disabled:bg-cyan-600 disabled:cursor-not-allowed; */
  @apply rounded border-1 border-solid border-cyan-400 bg-cyan-500 bg-opacity-10 text-cyan-400 px-2 py-1 text-xs font-semibold outline-none disabled:cursor-not-allowed disabled:bg-cool-gray-400 disabled:border-cool-gray-400 disabled:bg-opacity-10 disabled:text-cool-gray-400 hover:bg-opacity-20 disabled:hover:bg-opacity-10;
}
</style>
