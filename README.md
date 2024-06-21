<div align="center">
  <p align="center">
    <a href="https://vyaakaran.now.sh">
      <img src="https://github.com/blenderskool/vyaakaran/raw/main/website/static/vyaakaran-icon.png" width="80">
    </a>
  </p>
  <p align="center">  
    <h3>Vyaakaran - Visualize formal languages and automata</h3>
  </p>
</div>

### Features
- Regular languages.
- Context free languages.
- Turing machine simulator.
- Powerful console with nifty utilities.
- Completely client-side on the browser.

### Project structure

The Vyaakaran project has following three modules:
- **Compiler**  
  This is the underlying module that powers all the magic behind Vyaakaran! It contains the code for the lexer, parser, analyzer and all the other algorithms for processing regular, context-free grammars, and Turing machines.
  - Built with [TypeScript](https://www.typescriptlang.org/).
  - The package name is `@vyaakaran/compiler`.

- **Editor**  
  This is the visual web-based editor which can be accessed at [vyaakaran.now.sh/playground](https://vyaakaran.now.sh/playground). It uses the Compiler module and builds a nice UI over it which helps in writing, visualizing, and testing the grammars and Turing machines in an interactive way.
  - Built with [Vue 3](https://vuejs.org/), [TypeScript](https://www.typescriptlang.org/), [WindiCSS](https://windicss.org/).
  - The package name is `@vyaakaran/editor`.

- **Website**  
  This is the [vyaakaran.now.sh](https://vyaakaran.now.sh) website. It currently highlights Vyaakaran's features, and will be the place for any blog posts and documentation for Vyaakaran.
  - Built with [Svelte Kit](https://kit.svelte.dev/), [TypeScript](https://www.typescriptlang.org/), [WindiCSS](https://windicss.org/).
  - The package name is `@vyaakaran/website`.

All the above modules are a part of this monorepo itself under their respective directories. pnpm workspaces is used to manage all the modules.


### Local setup

#### Prerequisites
Following tools must be installed:
- [Node.js 20.x](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

#### Running the dev server
1. At the root of the project, run:
   ```bash
   pnpm install
   ```
2. To start the dev server of all the modules, run:
   ```bash
   pnpm run dev
   ```
   Depending on the module you want to work on, you can only start the dev server of that particular module by running its corresponding command:
   - `compiler`: `pnpm run compiler:dev`
   - `editor`: `pnpm run editor:dev`
   - `website`: `pnpm run website:dev`

3. The dev server should start running. To view the changes for:
   - `compiler`: Modify `compiler/src/playground.ts` file and run `pnpm run compiler:playground`.
   - `editor`: Open `localhost:3000`.
   - `website`: Open `localhost:3001`.

### Building for production
To build all the modules, run:
```bash
pnpm run build
```

Running the above command will product following artifacts:
- `compiler/dist/` will contain the built `@vyaakaran/compiler` package.
- `build/playground/` will contain the built Vyaakaran editor.
- `build/` will contain the rest of Vyaakaran website.

If you want to build only some of the modules, run its corresponding command:
- `compiler`: `pnpm run compiler:build`
- `editor`: `pnpm run editor:build`
- `website`: `pnpm run website:build`

## License
Vyaakaran is [MIT Licensed](https://github.com/blenderskool/vyaakaran/blob/master/LICENSE)
