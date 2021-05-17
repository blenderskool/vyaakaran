<template>
  <div class="radio-tabs">
    <label class="secondary-btn" :class="{ checked: opt === modelValue }" v-for="opt in options" :key="opt">
      {{ opt }}
      <input type="radio" :name="name" @change="onChange" :checked="opt === modelValue" :value="opt" hidden />
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'Output',
  props: {
    name: { type: String as PropType<string>, required: true },
    options: { type: Array as PropType<string[]>, required: true },
    modelValue: { type: String as PropType<string>, required: true },
  },
  methods: {
    onChange(e) {
      this.$emit('update:modelValue', e.target.value);
    },
  },
});
</script>

<style scoped>
  label {
    border-radius: 0;
  }
  label:first-of-type {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  label:last-of-type {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  label.checked {
    border: 1px solid var(--emerald-350);
    background-color: rgba(var(--emerald-350-rgb), 0.08);
    color: var(--emerald-350);
  }

  .radio-tabs {
    display: flex;
  }
</style>