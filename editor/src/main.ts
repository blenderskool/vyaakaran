import { createApp } from 'vue';
import App from './App.vue';
import 'splitpanes/dist/splitpanes.css';

const app = createApp(App);

app.directive('life', {
  updated(el, binding) {
    if (binding.arg === 'updated') binding.value();
  }
});

app.mount('#app');
