import { createRouter, createWebHistory } from 'vue-router';
import { playgrounds } from './store/code';

import Playground from './routes/Playground.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // TODO: Remove redirect once index page is ready
    {
      name: 'Index',
      path: '/',
      redirect: '/playground/0',
    },
    {
      name: 'Playground',
      path: '/playground/:id?',
      component: Playground,
    },
  ],
});
router.beforeEach((to, from, next) => {
  if (to.name !== 'Playground') {
    next();
    return;
  };

  if (!to.params.id || Number(to.params.id) >= playgrounds.length) {
    next({ ...to, params: { id: '0' } });
  } else {
    next();
  }
});

export default router;
