<template>
  <ul class="tabs">
    <Tab
      v-for="(tab, i) in tabs"
      :key="i"
      :to="String(i)"
      :name="tab.name"
      :isActive="tabIdx === i"
      :showRemove="tabs.length > 1"
      :lang="tab.lang"
      @rename="(name) => renameTab(i, name)"
      @remove="() => removeTab(i)"
    />
    <Tab class="new-tab">
      <button @click="() => $emit('new-playground')" title="Add a new tab">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </Tab>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { playgrounds, Playground, getActivePlayground } from '../../store/code';
import Tab from './Tab.vue';

export default defineComponent({
  name: 'EditorTabs',
  components: {
    Tab,
  },
  emits: ['new-playground'],
  computed: {
    tabIdx() {
      const id = Number(this.$route.params.id);
      return id || 0;
    },
    tabs() {
      return playgrounds.map(p => ({ name: p.name, lang: p.type }));
    },
  },
  methods: {
    removeTab(i) {
      const mutate = () => {
        playgrounds.splice(i, 1);
      };

      if (i <= this.tabIdx) {
        this.$router.replace(`${this.tabIdx - 1 >= 0 ? this.tabIdx - 1 : this.tabIdx}`).then(mutate);
      } else {
        mutate();
      }
    },
    renameTab(i, name) {
      // NOTE: This assumes that the tab being renamed is the active tab. Might change later
      (getActivePlayground() as Playground).name = name;
    },
  },
});
</script>

<style scoped>
  .tabs {
    height: 40px;
    box-shadow: 0 2px 8px rgba(var(--black-rgb), 0.15);
    position: relative;
    z-index: 15;
    display: flex;
    overflow-y: hidden;
    overflow-x: auto;
    max-width: 100vw;
    padding-top: 6px;
  }
  .tabs::-webkit-scrollbar {
    height: 3px;
  }

  .tabs .new-tab {
    opacity: 1;
  }
  .tabs .new-tab button {
    height: 100%;
    padding: 0 8px;
    color: var(--blue-gray-500);
    outline: none;
  }
</style>