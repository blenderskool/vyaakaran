import { createRouter, createWebHistory } from 'vue-router';
import { newPlayground, playgrounds, PlaygroundType } from './store/code';

import Playground from './routes/Playground.vue';

const sampleProgram = `
// Type your regular grammar here

// Syntax cheat-sheet:
//    * Start symbol                 S
//    * Follow (->):                 ->
//    * ε or λ:                      ε or λ or #
//    * Or (|):                      |
//    * End each rule:               .
//    * Comments:                    // comment
//    * Non-terminals:               start with uppercase character
//    * Terminals:                   start with any other character

S -> ε | a B | a C | b A | b C | c A | c B.
A -> b A | c A | ε.
C -> a C | b C | ε.
B -> a B | c B | ε.
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
          return next({ name: 'Playground', params: { id: 0 } });
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
          return next({ name: 'NewPlayground', params: { type: 'RG' } });
        } else {
          return next();
        }
      }
    },
  ],
});

export default router;
