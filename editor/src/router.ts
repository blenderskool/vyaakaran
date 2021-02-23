import { createRouter, createWebHistory } from 'vue-router';
import { codeStore } from './store/code';

import RegularGrammarPlayground from './routes/RegularGrammarPlayground.vue';
import ContextFreeGrammarPlayground from './routes/ContextFreeGrammarPlayground.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // TODO: Remove redirect once index page is ready
    {
      name: 'Index',
      path: '/',
      redirect: '/regular-grammar/0',
    },
    {
      name: 'RegularGrammar',
      path: '/regular-grammar/:id?',
      meta: {
        storeId: 'regular-grammar',
      },
      component: RegularGrammarPlayground,
    },
    {
      name: 'ContextFreeGrammar',
      path: '/context-free-grammar/:id?',
      meta: {
        storeId: 'context-free-grammar',
      },
      component: ContextFreeGrammarPlayground,
    },
  ],
});
router.beforeEach((to, from, next) => {
  if (!to.meta.storeId) {
    next();
    return;
  };

  const playgrounds = codeStore[to.meta.storeId];
  if (!to.params.id || Number(to.params.id) >= playgrounds.length) {
    next({ ...to, params: { id: '0' } });
  } else {
    next();
  }
});

export default router;
