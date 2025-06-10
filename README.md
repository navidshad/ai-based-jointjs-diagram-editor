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

| Events           | Examples                                            | Stream Type  | Description                    |
| ---------------- | --------------------------------------------------- | ------------ | ------------------------------ |
| `ready`          | `{type:"ready"}`                                    | receive      | To Send ready signal to parent |
| `graph`          | `{type:"graph", payload: {cells:[]}}`               | send/receive | To exchange diagram data       |
| `settings`       | `{type:"settings", payload: SettingsObject}`        | send         | To set editor settings         |
| `element-add`    | `{type:"element-add", payload: {ElementObject}`     | receive      | To know when element added     |
| `element-remove` | `{type:"element-del", payload: {id: string}}`       | receive      | To know when element removed   |
| `element-select` | `{type:"element-update", payload: {ElementObject}}` | receive      | To know when element selected  |

## Iframe `SettingsObject`
You can setup the editor though query params of the iframe url. the following table shows the available query params.

| Property               | type      | Description                                        |
| ---------------------- | --------- | -------------------------------------------------- |
| `update_per_change`    | `Boolean` | Receive diagram update per any change on its graph |
| `toggle_control_panel` | `Boolean` | Show/Hide control panel                            |

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd diagram-designer

# Install dependencies
npm install

# Start development server
npm run dev
```

The editor will be available at `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture Overview

The Diagram Designer is built with:

- **Vue 3** + **TypeScript** for the frontend framework
- **JointJS** for diagram rendering and manipulation
- **Pinia** for state management
- **Vuetify** for UI components
- **LangChain** for AI-powered diagram generation
- **Vite** for build tooling and development

### Key Components

- **Editor Layout**: Split-panel interface with canvas and control panel
- **Diagram Canvas**: Interactive drawing surface with JointJS integration
- **Control Panel**: Tabbed interface for shapes, properties, and AI features
- **State Management**: Centralized stores for diagram and configuration data
- **Communication Layer**: PostMessage API for iframe integration

## Development

For detailed development information, architecture details, and extension guides, see [DEVELOPMENT.md](./DEVELOPMENT.md).

### Development Setup

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Run tests
npm run test:unit    # Unit tests with Vitest
npm run test:e2e     # E2E tests with Playwright

# Code quality
npm run lint         # ESLint
npm run format       # Prettier
npm run type-check   # TypeScript checking
```

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).
