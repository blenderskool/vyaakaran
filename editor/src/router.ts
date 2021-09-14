import { createRouter, createWebHistory } from 'vue-router';
import { newPlayground, playgrounds, PlaygroundType } from './store/code';

import Playground from './routes/Playground.vue';

const sampleProgram = `
S -> 0 1 S | 1 0 S | A.
A -> 0 1 A | 1 0 A | #.

// Type your grammar here...

// Syntax cheat-sheet:
//    * Start symbol                 S
//    * Follow (->):                 ->
//    * ε or λ:                      ε or λ or #
//    * Or (|):                      |
//    * End each rule:               .
//    * Comments:                    // comment
//    * Non-terminals:               start with uppercase character
//    * Terminals:                   start with any other character
`;

const router = createRouter({
  history: createWebHistory('/playground/'),
  routes: [
    // TODO: Remove redirect once index page is ready
    {
      name: 'Index',
      path: '/',
      redirect: '/tab/0',
    },
    {
      name: 'NewPlayground',
      path: '/new/:type',
      component: Playground,
      beforeEnter(to, _, next) {
        try {
          playgrounds.push(newPlayground('New Tab', (to.params.type as string).toUpperCase() as PlaygroundType, sampleProgram));
          return next({ name: 'Playground', params: { id: 0 }, query: to.query });
        } catch(err) {
          return next({ name: '404' });
        }
      }
    },
    {
      name: 'Playground',
      path: '/tab/:id?',
      component: Playground,
      beforeEnter(to, _, next) {
        if (!to.params.id || Number(to.params.id) >= playgrounds.length) {
          return next({ name: 'NewPlayground', params: { type: 'RG' }, query: to.query });
        } else {
          return next();
        }
      },
    },
  ],
});

router.afterEach((to) => {
  // Send updated page path to Google analytics
  if (window.gtag !== undefined && import.meta.env.PROD) {
    window.gtag('config', 'UA-82138003-6', {
      page_path: to.path,
    });
  }

  // Update page title to new tab's name
  if (to.name === 'Playground') {
    document.title = `${playgrounds[Number(to.params.id)].name} | Vyaakaran Playground`;
  }
});

export default router;
