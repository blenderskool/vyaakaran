<template>
  <Pane min-size="4" v-life:updated="scrollToBottom" max-size="50">
    <PaneHeader>
      <div class="header">
        <span>Console</span>
        <div>
          <span class="errors-count" v-if="errorsCount">
            {{ errorsCount }} errors
          </span>
          <span class="warnings-count" v-if="warningsCount">
            {{ warningsCount }} warnings
          </span>
        </div>
      </div>
    </PaneHeader>
    <div class="console">
      <ul ref="consoleRef">
        <li v-for="error in store.value.consoleStream" :key="error.timestamp" :class="error.type.toLowerCase()">
          <svg v-if="error.type === 'Error'" class="icon" width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else-if="error.type === 'Warning'" class="icon" width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg v-else-if="error.type === 'Success'" class="icon" width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <div class="time">
            {{ error.timestamp.toLocaleTimeString() }}
          </div>
          <div class="message">
            <span v-html="error.message" />
          </div>
        </li>
      </ul>

      <div class="command-input">
        >
        <input v-model="inputCommand" placeholder="Type help for list of commands" @keydown.enter="submitCommand" />
      </div>
    </div>
  </Pane>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, inject, ref } from 'vue';
import { Pane }  from 'splitpanes';
import PaneHeader from './ui/PaneHeader.vue';
import { COMMANDS } from '../config/console'; 
import { Playground } from '../store/code';

export default defineComponent({
  name: 'Console',
  components: {
    PaneHeader,
    Pane,
  },
  inject: ['store'],
  methods: {
    submitCommand() {
      const command = this.inputCommand.trim().split(' ')[0];

      if (COMMANDS[command]) {
        this.store.value.consoleStream.push(COMMANDS[command](this.inputCommand));
      } else {
        this.store.value.consoleStream.push({ type: 'Error', message: `Command '${command}' was not found. Type 'help' for list of supported commands`, timestamp: new Date() });
      }
      this.inputCommand = '';
    }
  },
  setup() {
    const store = inject<ComputedRef<Playground>>('store');
    const consoleRef = ref<HTMLElement>(null);
    const cnt = ref<number>(0);
    const inputCommand = ref<string>('');
    const errorsCount = computed(() => store.value.consoleStream.filter((err) => err.type === 'Error').length);
    const warningsCount = computed(() => store.value.consoleStream.filter((err) => err.type === 'Warning').length);

    const scrollToBottom = () => {
      consoleRef.value.scrollTo(0, consoleRef.value.scrollHeight + 100);
    };

    return { cnt, scrollToBottom, consoleRef, errorsCount, warningsCount, inputCommand };
  },
});
</script>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
  }

  .errors-count, .warnings-count {
    display: inline-block;
    font-size: 0.75rem;
  }

  .errors-count {
    color: var(--red-500);
  }

  .warnings-count {
    color: var(--orange-400);
    margin-left: 1rem;
  }

  .console {
    background-color: var(--gray-900);
    height: calc(100% - 30px);
    font-family: var(--font-family-code);
    font-weight: 500;
    position: relative;
  }

  ul {
    list-style: none;
    overflow-y: auto;
    max-height: calc(100% - 28px);
  }

  li {
    border-bottom: 1px solid var(--gray-800);
    padding: 0.8rem 1.25rem;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
  }
  li.error {
    color: var(--red-500);
  }
  li.warning {
    color: var(--orange-400);
  }
  li.success {
    color: var(--emerald-400);
  }

  li .icon {
    flex-shrink: 0;
  }

  li .time {
    margin-left: 0.5rem;
    font-size: 0.75rem;
    color: rgba(var(--white-rgb), 0.4);
    white-space: nowrap;
  }

  li .message {
    margin-left: 1rem;
  }

  .command-input {
    position: absolute;
    width: 100%;
    bottom: -2px;
    left: 0;
    border-top: 1px solid var(--gray-800);
    padding: 0.625rem 1.25rem;
    color: var(--blue-gray-500);
  }
  .command-input, .command-input input {
    background-color: var(--black);
    font-family: var(--font-family-code);
    font-size: 0.875rem;
    font-weight: 500;
  }
  .command-input input {
    color: var(--steel-blue-100);
    border: none;
    outline: none;
    padding-right: 1.25rem;
    width: 95%;
  }
  .command-input input::placeholder {
    color: var(--blue-gray-500);
  }
</style>