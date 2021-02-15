<template>
  <ul class="tabs">
    <li v-for="(tab, i) in tabs" :key="i" :class="{ selected: tabIdx === i }">
      <router-link :to="String(i)" class="tab-btn">
        {{ tab }}
      </router-link>
      <button class="close-btn" v-if="tabs.length > 1" @click="() => removeTab(i)" :title="`Remove ${tab}`">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </li>
    <li class="new-tab">
      <button @click="addTab" title="Add a new tab">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getActiveStore, newPlayground, Playground } from '../store/code';

export default defineComponent({
  name: 'EditorTabs',
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
  }
  .tabs::-webkit-scrollbar {
    height: 3px;
  }

  .tabs li {
    display: flex;
    align-items: center;
    border-top: 3px solid transparent;
  }
  
  .tabs li.selected {
    border-top-color: #34febb;
    background-color: #18181B;
  }

  .tabs li {
    border-right: 1px solid #18181B;
  }

  .tabs .tab-btn {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 1rem;
    font-size: 13px;
    white-space: nowrap;
    font-weight: 500;
  }

  .tabs .close-btn {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    color: #586f89;
    outline: none;
  }

  .new-tab button {
    height: 40px;
    padding: 0 8px;
    color: #586f89;
    outline: none;
  }
</style>