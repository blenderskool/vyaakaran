<template>
  <header class="h-7 relative z-20 flex items-center justify-between bg-gray-850 border-b border-gray-900">
    <ul class="h-full flex overflow-y-hidden overflow-x-auto max-w-full space-x-1.5 tabs">
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
      <Tab class="!opacity-100">
        <button class="h-full px-2 text-blue-gray-600 focus:outline-none" @click="() => $emit('new-playground')" title="Add a new tab [Shift + N]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </Tab>
    </ul>

    <nav class="mx-2 flex-shrink-0 text-xs text-cyan-300 font-medium">
      <a href="https://vyaakaran.vercel.app/docs/syntax" target="_blank">
        Learn Syntax
      </a>
      <a class="mx-3" href="https://vyaakaran.vercel.app/feedback" target="_blank">
        Feedback
      </a>
    </nav>
  </header>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { playgrounds, Playground, getActivePlayground } from '../../store/code';
import useKeyShortcut from '../../utils/useKeyShortcut';
import Tab from './Tab.vue';

export default defineComponent({
  name: 'EditorTabs',
  components: {
    Tab,
  },
  emits: ['new-playground'],
  setup() {
    const tabs = computed(() => playgrounds.map(p => ({ name: p.name, lang: p.type })));
    const router = useRouter();
    const tabIdx = computed(() => Number(router.currentRoute.value.params.id) || 0);

    const removeTab = (i: number) => {
      const mutate = () => {
        playgrounds.splice(i, 1);
      };

      if (i <= tabIdx.value) {
        router.replace(`${tabIdx.value - 1 >= 0 ? tabIdx.value - 1 : tabIdx.value}`).then(mutate);
      } else {
        mutate();
      }
    };

    const renameTab = (i: number, name: string) => {
      if (!name) return;

      // NOTE: This assumes that the tab being renamed is the active tab. Might change later
      (getActivePlayground() as Playground).name = name;
    };

    // Next tab navigate hotkey
    useKeyShortcut((e) => e.ctrlKey && e.code === 'ArrowRight', () => {
      if (tabIdx.value !== playgrounds.length - 1) {
        router.replace(`${tabIdx.value + 1}`);
      }
    });

    // Previous tab navigate hotkey
    useKeyShortcut((e) => e.ctrlKey && e.code === 'ArrowLeft', () => {
      if (tabIdx.value !== 0) {
        router.replace(`${tabIdx.value - 1}`);
      }
    });

    return { tabs, tabIdx, removeTab, renameTab };
  }
});
</script>

<style scoped>
  .tabs::-webkit-scrollbar {
    height: 3px;
  }
</style>
