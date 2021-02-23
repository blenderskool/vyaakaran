<template>
  <ul class="tabs">
    <Tab
      v-for="(tab, i) in tabs"
      :key="i"
      :to="String(i)"
      :name="tab"
      :isActive="tabIdx === i"
      :showRemove="tabs.length > 1"
      @rename="(name) => renameTab(i, name)"
      @remove="() => removeTab(i)"
    />
    <Tab class="new-tab">
      <button @click="addTab" title="Add a new tab">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </Tab>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getActiveStore, newPlayground, Playground } from '../../store/code';
import Tab from './Tab.vue';

export default defineComponent({
  name: 'EditorTabs',
  components: {
    Tab,
  },
  computed: {
    tabIdx() {
      const id = Number(this.$route.params.id);
      return id || 0;
    },
    tabs() {
      const playgrounds = getActiveStore(true) as Playground[];
      return playgrounds.map(p => p.name);
    },
  },
  methods: {
    removeTab(i) {
      const mutate = () => {
        const playgrounds = getActiveStore(true) as Playground[];
        playgrounds.splice(i, 1);
      }

      if (this.tabIdx === i) {
        this.$router.replace(`${i - 1 >= 0 ? i - 1 : i}`).then(mutate);
      } else {
        mutate();
      }
    },
    renameTab(i, name) {
      // NOTE: This assumes that the tab being renamed is the active tab. Might change later
      (getActiveStore() as Playground).name = name;
    },
    addTab() {
      const playgrounds = getActiveStore(true) as Playground[];
      playgrounds.push(newPlayground(`Untitled-${playgrounds.length + 1}`));
    }
  },
});
</script>

<style scoped>
  .tabs {
    height: 40px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    position: relative;
    z-index: 15;
    display: flex;
    overflow-y: hidden;
    overflow-x: auto;
    max-width: calc(100vw - 60px);
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
    color: #586f89;
    outline: none;
  }
</style>