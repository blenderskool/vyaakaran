import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import FadeTransition from './components/transitions/FadeTransition.vue';
import GrowSlideTransition from './components/transitions/GrowSlideTransition.vue';

import 'splitpanes/dist/splitpanes.css';
import 'virtual:windi.css';

const app = createApp(App);

app.directive('life', {
  updated(el, binding) {
    if (binding.arg === 'updated') binding.value();
  }
});

app.component('FadeTransition', FadeTransition);
app.component('GrowSlideTransition', GrowSlideTransition);

app.use(router);
app.mount('#app');
