declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'argv-split' {
  const split: (input: string) => string[];
  export default split;
}

declare module 'highlight.js/lib/core' {
  import * as hljs from 'highlight.js';
  export default hljs;
}