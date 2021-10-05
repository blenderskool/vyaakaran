declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'highlight.js/lib/core' {
  import * as hljs from 'highlight.js';
  export default hljs;
}