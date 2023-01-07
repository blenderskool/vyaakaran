<template>
  <table class="output-table">
    <thead>
      <tr>
        <th />
        <th :colspan="actionTable[0].length">Action</th>
        <th :colspan="gotoTable[0].length">Goto</th>
      </tr>
      <tr>
        <th>State</th>
        <th v-for="symbol in actionTableColumns" :key="symbol" class="hljs-terminal">{{ symbol }}</th>
        <th v-for="symbol in gotoTableColumns" :key="symbol" class="hljs-non-terminal">{{ symbol }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, i) in actionTable" :key="i">
        <th>{{ i }}</th>
        <td v-for="(rules, j) in row" :key="j" :class="{ conflict: rules.length > 1 }">
          <div
            v-for="rule in rules"
            :key="rule.value"
            v-html="computeCellValue(rule)"
          />
        </td>
        <td v-for="(rules, j) in gotoTable[i]" :key="actionTable[0].length + j" :class="{ conflict: rules.length > 1 }">
          <div
            v-for="rule in rules"
            :key="rule.value"
          >
            <span class="hljs-terminal">{{ rule.value }}</span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { hljs } from '../../../config/highlight';

const props = defineProps<{
  actionTable: any[][][],
  gotoTable: any[][][],
  actionTableColumns: Record<string, number>,
  gotoTableColumns: Record<string, number>,
}>();

const computeCellValue = (rule: any) => {
  if (rule.value === undefined) return rule.action;

  return `${rule.action}(${hljs.highlight('vyaakaran grammar', rule.value.toString()).value})`;
};
</script>