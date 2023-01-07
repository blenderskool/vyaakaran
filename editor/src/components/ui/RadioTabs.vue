<template>
  <div class="flex">
    <label
      class="secondary-btn rounded-none first-of-type:rounded-l last-of-type:rounded-r"
      :class="{ 'border-1 border-solid border-cyan-300 bg-cyan-500 bg-opacity-10 text-cyan-300': opt === modelValue }"
      v-for="opt in options"
      :key="opt"
    >
      {{ opt }}
      <input type="radio" :name="name" @change="onChange" :checked="opt === modelValue" :value="opt" hidden />
    </label>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  name: string,
  options: string[],
  modelValue: string
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

const onChange = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
};
</script>
