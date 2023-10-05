# diagram-designer

This a Jointjs Diagram Editor that generates json base diagrams, then you can use the json to render the diagram in your application.

**Demo**: https://diagram-designer-kodekloud-apps-ca596a9024df03c47dc6b3da46040fe.gitlab.io

## Features
- [x] Drag and Drop Shapes
- [x] Connect Shapes
- [x] Default KK Shapes
- [x] Import/Export json data
- [ ] Edit Shape properties
- [ ] Add custom images
- [ ] Add group for a set of shapes
- [ ] Create and Manipulate Diagram by prompting.

## Ifram & Communication
This Editor is being used by few other KodeKloud designer apps like Qize-Designer through an iframe, they talk to each other using `message` event. so if you want to use this editor in your application, you need to use it in an iframe and communicate with it using `message` event. the data structure of the message is as follow:

| Property  | value      | Description                                    |
| --------- | ---------- | ---------------------------------------------- |
| `type`    | `graph`    | Type of the message. for now it's only 1 type. |
| `payload` | `{object}` | An object contains diagram data.               |

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
