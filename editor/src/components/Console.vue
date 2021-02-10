<template>
  <Pane class="console-pane" min-size="6.5" v-life:updated="scrollToBottom" max-size="50">
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
        <li v-for="error in codeStore.consoleStream" :key="error.message" :class="error.type.toLowerCase()">
          <svg v-if="error.type === 'Error'" class="icon" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else-if="error.type === 'Warning'" class="icon" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg v-else-if="error.type === 'Success'" class="icon" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <div class="time">
            {{ error.timestamp.toLocaleTimeString() }}
          </div>
          <div class="message">
            {{ error.type }}: <span v-html="error.message" />
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
import { computed, defineComponent, ref } from 'vue';
import { Pane }  from 'splitpanes';
import PaneHeader from './ui/PaneHeader.vue';
import { codeStore } from '../store/code';
import { COMMANDS } from '../config/console'; 

export default defineComponent({
  name: 'Console',
  components: {
    PaneHeader,
    Pane,
  },
  methods: {
    submitCommand() {
      const command = this.inputCommand.trim().split(' ')[0];

      if (COMMANDS[command]) {
        codeStore.consoleStream.push(COMMANDS[command](this.inputCommand));
      } else {
        codeStore.consoleStream.push({ type: 'Error', message: `Command '${command}' was not found. Type 'help' for list of supported commands`, timestamp: new Date() });
      }
      this.inputCommand = '';
    }
  },
  setup() {
    const consoleRef = ref<HTMLElement>(null);
    const cnt = ref<number>(0);
    const inputCommand = ref<string>('');
    const errorsCount = computed(() => codeStore.consoleStream.filter((err) => err.type === 'Error').length);
    const warningsCount = computed(() => codeStore.consoleStream.filter((err) => err.type === 'Warning').length);

    const scrollToBottom = () => {
      consoleRef.value.scrollTo(0, consoleRef.value.scrollHeight + 100);
    };

    return { cnt, codeStore, scrollToBottom, consoleRef, errorsCount, warningsCount, inputCommand };
  },
});
</script>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
  }

  .errors-count, .warnings-count {
    padding: 2px 15px;
    border-radius: 20px;
    color: #18181B;
    background-color: #EF4444;
    font-size: 12px;
  }

  .warnings-count {
    background-color: #FB923C;
    margin-left: 10px;
  }

  .console {
    background-color: #18181B;
    height: calc(100% - 50px);
    font-family: 'Fira Code';
    font-weight: 500;
    position: relative;
  }

  ul {
    list-style: none;
    overflow-y: auto;
    max-height: calc(100% - 50px);
  }

  li {
    border-bottom: 1px solid #27272A;
    padding: 0.8rem 20px;
    display: flex;
    align-items: center;
  }
  li.error {
    color: #EF4444;
  }
  li.warning {
    color: #FB923C;
  }
  li.success {
    color: #34D399;
  }

  li .time {
    margin-left: 0.5rem;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.4);
    white-space: nowrap;
  }

  li .message {
    margin-left: 1.5rem;
  }

  .command-input {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    border-top: 1px solid #27272A;
    padding: 15px 20px;
    color: #586f89;
  }
  .command-input, .command-input input {
    background-color: black;
    font-family: 'Fira Code';
    font-size: 1rem;
    font-weight: 500;
  }
  .command-input input {
    color: #d6e9ff;
    border: none;
    outline: none;
    padding-right: 20px;
    width: 95%;
  }
  .command-input input::placeholder {
    color: #586f89;
  }
</style>