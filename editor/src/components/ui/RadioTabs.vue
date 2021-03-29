<template>
  <div class="radio-tabs">
    <label :class="{ checked: opt === modelValue }" v-for="opt in options" :key="opt">
      {{ opt }}
      <input type="radio" :name="name" @change="onChange" :checked="opt === modelValue" :value="opt" hidden />
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

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
    padding: 2px 15px;
    border-radius: 20px;
    background-color: rgba(var(--white-rgb), 0.1);
    font-size: 12px;
    margin-right: 10px;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
  }
  label:last-child {
    margin-right: 0;
  }

  label.checked {
    border: 1px solid var(--emerald-350);
    background-color: rgba(var(--emerald-350-rgb), 0.08);
    color: var(--emerald-350);
  }
</style>