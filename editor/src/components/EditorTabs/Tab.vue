<template>
  <li class="tab" :class="{ selected: isActive }">
    <slot>
      <component
        :is="!to || isEditing ? 'div' : 'router-link'"
        :to="to"
        @dblclick="() => setEditing(true)"
        class="tab-link"
      >
        <input v-if="isEditing" ref="inputRef" :value="name" @change="(e) => $emit('rename', e.target.value)" @blur="() => setEditing(false)" class="rename" />
        <span v-else>{{ name }}</span>
      </component>
      <button class="close-btn" v-if="showRemove" @click="() => $emit('remove')" :title="`Remove ${name}`">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </slot>
  </li>
</template>

<script lang="ts">
import { defineComponent, nextTick, PropType, readonly, ref } from 'vue';

export default defineComponent({
  name: 'Tab',
  props: {
    name: {
      type: String as PropType<string>,
      required: false,
    },
    to: {
      type: String as PropType<string>,
      required: false,
    },
    isActive: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
    showRemove: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: true,
    },
  },
  setup() {
    const inputRef = ref<HTMLInputElement>(null);
    const isEditing = ref<boolean>(false);

    const setEditing = async (state) => {
      isEditing.value = state;
      if (state) {
        await nextTick();
        inputRef.value.focus();
      }
    };

    return {
      inputRef, setEditing,
      isEditing: readonly(isEditing),
    };
  },
});
</script>

<style scoped>
  .tab {
    display: flex;
    align-items: center;
    border-top: 3px solid transparent;
    margin: 0 0.25rem;
    background-color: #18181B;
    opacity: 0.5;
  }

  .tab:first-of-type {
    margin-left: 0;
  }
  .tab:last-of-type {
    margin-right: 0;
  }

  .tab.selected {
    opacity: 1;
    border-top-color: #34febb;
  }

  .tab .tab-link {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 1rem;
    font-size: 13px;
    white-space: nowrap;
    font-weight: 500;
  }

  .tab .close-btn {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    color: #586f89;
    outline: none;
  }

  .tab .rename {
    background-color: transparent;
    font-family: 'Poppins';
    font-weight: 500;
    color: #d6e9ff;
    outline: none;
    border: none;
    width: 70px;
  }
</style>