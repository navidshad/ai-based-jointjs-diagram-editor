# diagram-designer

This a Jointjs Diagram Editor that generates json base diagrams, then you can use the json to render the diagram in your application.

**Demo**: https://diagram-designer-kodekloud-apps-ca596a9024df03c47dc6b3da46040fe.gitlab.io

## Features

### Creation methods
- [x] Drag and Drop.
- [x] Drag and Create.

### Shapes
- [x] Default KK Shapes.
- [x] Primitive Shapes.

### Iframe Communication
- [x] Define configuration from Parent.
- [x] Send receive diagram data between the app and parent frame.
- [ ] Add custom shapes (img based).

### Canvas 
- [x] Create Link between elements.
- [x] Move elements.

### Other
- [x] Edit Shape properties.
- [x] Add custom images.
- [x] Import/Export json data.
- [x] Create and Manipulate Diagram by GPT-4.
- [ ] Group a sort of elements (only in ai result for now).

## Iframe & Communication
This Editor is being used by few other KodeKloud designer apps like Quiz-Designer through an iframe, they talk to each other using `message` event. so if you want to use this editor in your application, you need to use it in an iframe and communicate with it using `message` event. the data structure of the message is as follow:

| Property | value   | Description              |
| -------- | ------- | ------------------------ |
| `type`   | `ready` | Sends to parent on ready |

| Property  | value           | Description                      |
| --------- | --------------- | -------------------------------- |
| `type`    | `graph`         | To send/receive diagram data.    |
| `payload` | `{cells:[...]}` | An object contains diagram data. |

| Property  | value      | Description                          |
| --------- | ---------- | ------------------------------------ |
| `type`    | `settings` | To set editor settings               |
| `payload` | `{object}` | An object contains diagram settings. |

## Iframe Settings
You can setup the editor though query params of the iframe url. the following table shows the available query params.

| Property               | type      | Description                                        |
| ---------------------- | --------- | -------------------------------------------------- |
| `update_per_change`    | `Boolean` | Receive diagram update per any change on its graph |
| `toggle_control_panel` | `Boolean` | Show/Hide control panel                            |

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
