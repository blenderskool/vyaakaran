import { createRouter, createWebHistory } from 'vue-router';
import RegularGrammarPlayground from './routes/RegularGrammarPlayground.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'RegularGrammar',
      path: '/regular-grammar/:id?',
      component: RegularGrammarPlayground
    },
  ],
});

export default router;
