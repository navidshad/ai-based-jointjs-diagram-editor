# Development Documentation

## Overview

The Diagram Designer is a Vue 3 + TypeScript application built with JointJS for creating interactive diagrams. It's designed to be embedded as an iframe and communicates with parent applications through the PostMessage API. The editor supports AI-powered diagram generation using LangChain.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
- [Core Components](#core-components)
  - [1. Editor Layout](#1-editor-layout-srcviewseditorvue)
  - [2. Diagram Canvas](#2-diagram-canvas-srccomponentsdiagramcanvasvue)
  - [3. Control Panel](#3-control-panel-srccomponentscontrolpanel)
- [State Management](#state-management)
  - [Diagram Store](#diagram-store-srcstoresdiagramts)
  - [Config Store](#config-store-srcstoresconfigts)
- [Communication System](#communication-system)
  - [Iframe PostMessage API](#iframe-postmessage-api)
  - [Implementation](#implementation)
- [AI Integration](#ai-integration)
  - [LangChain Architecture](#langchain-architecture)
  - [AI Chains](#ai-chains)
- [Extending the Editor](#extending-the-editor)
  - [Adding New Shapes](#adding-new-shapes)
  - [Adding New AI Chains](#adding-new-ai-chains)
  - [Adding New Control Panel Tabs](#adding-new-control-panel-tabs)
  - [Element Properties System](#element-properties-system)
- [Development Workflow](#development-workflow)
  - [Setup](#setup)
  - [Code Quality](#code-quality)
  - [Debugging](#debugging)
- [Best Practices](#best-practices)
  - [State Management](#state-management-1)
  - [JointJS Integration](#jointjs-integration)
  - [Performance](#performance)
  - [Testing](#testing)
- [Common Issues & Solutions](#common-issues--solutions)
  - [1. JointJS Paper Not Rendering](#1-jointjs-paper-not-rendering)
  - [2. Iframe Communication Not Working](#2-iframe-communication-not-working)
  - [3. AI Chain Errors](#3-ai-chain-errors)
  - [4. Memory Leaks](#4-memory-leaks)
- [Deployment Considerations](#deployment-considerations)
  - [Environment Variables](#environment-variables)
  - [Build Optimization](#build-optimization)
  - [Iframe Embedding](#iframe-embedding)
- [Critical Architecture Patterns](#critical-architecture-patterns)
  - [1. Hierarchy System Pattern](#1-hierarchy-system-pattern)
  - [2. Control Panel Tab System Pattern](#2-control-panel-tab-system-pattern)
  - [3. Parent Window Event System Pattern](#3-parent-window-event-system-pattern)
- [Resources](#resources)

## Architecture

### Tech Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Type System**: TypeScript
- **Diagram Engine**: JointJS 3.7.7
- **State Management**: Pinia
- **UI Components**: Vuetify 3.4.6
- **AI Integration**: LangChain
- **Build Tool**: Vite
- **Testing**: Vitest + Playwright

### Project Structure

```
src/
├── ai/                    # AI integration (LangChain)
│   ├── chains/           # AI chain definitions
│   ├── schema/           # Zod schemas for AI
│   ├── helpers/          # AI utilities
│   ├── llms/            # LLM configurations
│   └── assets/          # AI prompts and templates
├── components/          # Vue components
│   ├── ControlPanel/    # Right panel components
│   └── layout/          # Layout components
├── stores/              # Pinia stores
├── model/               # Data models
├── services/            # Business logic services
├── types/               # TypeScript type definitions
├── helpers/             # Utility functions
├── router/              # Vue Router configuration
├── plugins/             # Vue plugins
├── static/              # Static assets
└── views/               # Main application views
```

## Core Components

### 1. Editor Layout (`src/views/Editor.vue`)

The main editor uses a split-panel layout:
- **Left Panel**: Diagram canvas with action header
- **Right Panel**: Control panel (collapsible)

```typescript
// Key features:
- Responsive split layout
- Dynamic panel sizing
- Configurable panel visibility
```

### 2. Diagram Canvas (`src/components/DiagramCanvas.vue`)

The core drawing surface built on JointJS:
- Interactive diagram editing
- Element manipulation (drag, resize, connect)
- Tool integration (selection, resize handles)
- Custom shape support

### 3. Control Panel (`src/components/ControlPanel/`)

Tabbed interface for editor controls:
- **Shapes**: Shape library and custom shapes
- **Primitives**: Basic geometric shapes
- **Properties**: Element property editor
- **Hierarchy**: Element tree view
- **AI**: AI-powered diagram generation

## State Management

### Diagram Store (`src/stores/diagram.ts`)

Manages the diagram state and JointJS integration:

```typescript
interface DiagramStore {
  graph: dia.Graph              // JointJS graph
  paper: dia.Paper             // JointJS paper
  hierarchyStore: HierarchyStore // Element hierarchy
}

// Key methods:
- insertDiagramData(data)     // Load diagram from JSON
- addElement(element)         // Add new element
- addLink(source, target)     // Create link between elements
- setViewportPosition(x, y)   // Pan viewport
- setZoomLevel(level)         // Zoom control
```

### Config Store (`src/stores/config.ts`)

Manages application configuration and iframe communication:

```typescript
interface Settings {
  update_per_change: boolean    // Auto-sync changes
  toggle_control_panel: boolean // Show/hide control panel
}

// Key methods:
- updateParentWindowWithGraph(data)          // Send diagram data
- updateParentWindowWithElementTransaction() // Send element events
- insertSettings(settings)                   // Apply settings from parent
```

## Communication System

### Iframe PostMessage API

The editor communicates with parent applications through structured messages:

#### Outgoing Events (Editor → Parent)

| Event Type       | Payload               | Description                    |
| ---------------- | --------------------- | ------------------------------ |
| `ready`          | `{}`                  | Editor initialization complete |
| `graph`          | `{cells: dia.Cell[]}` | Diagram data update            |
| `element-add`    | `ElementObject`       | Element added to diagram       |
| `element-remove` | `{id: string}`        | Element removed from diagram   |
| `element-select` | `ElementObject`       | Element selected               |

#### Incoming Events (Parent → Editor)

| Event Type | Payload               | Description               |
| ---------- | --------------------- | ------------------------- |
| `graph`    | `{cells: dia.Cell[]}` | Load diagram data         |
| `settings` | `SettingsObject`      | Configure editor settings |

### Implementation

```typescript
// Event registration (src/events.ts)
export function registerGlobalEvents() {
  window.onmessage = (event) => {
    const eventData = event.data
    // Handle incoming events
  }
}

// Event emission
configStore.updateParentWindowWithGraph(diagramData)
```

## AI Integration

### LangChain Architecture

The AI system uses LangChain for natural language to diagram conversion:

```
src/ai/
├── chains/
│   ├── diagram-generator.chain.ts      # Text → Diagram
│   ├── diagram-generator-csv.chain.ts  # CSV → Diagram  
│   ├── diagram-manipulation.chain.ts   # Modify existing
│   └── prompt-improviser.chain.ts      # Improve prompts
├── schema/                             # Zod validation schemas
└── llms/                              # LLM configurations
```

### AI Chains

1. **Diagram Generator**: Converts natural language descriptions to JointJS diagrams
2. **CSV Generator**: Creates diagrams from CSV data
3. **Diagram Manipulator**: Modifies existing diagrams based on instructions
4. **Prompt Improviser**: Enhances user prompts for better results

## Extending the Editor

### Adding New Shapes

The shape creation pattern is simple: **Button → Function → `diagramStore.addElement()`**

#### Core Pattern

**Template:**
```html
<template>
  <!-- 1. UI Trigger (button, form, etc.) -->
  <v-btn @click="addMyShape">Add My Shape</v-btn>
</template>
```

**Script:**
```typescript
<script setup>
import { useDiagramStore } from '@/stores/diagram'
import { shapes } from 'jointjs'

const diagramStore = useDiagramStore()

// 2. Function that creates and adds element
function addMyShape() {
  // 3. Create JointJS element
  const element = new shapes.standard.Rectangle()
  element.position(100, 100)
  element.size(120, 80)
  element.attr('body/fill', 'lightcoral')
  element.attr('label/text', 'My Custom Shape')
  
  // 4. Add to diagram store (automatic hierarchy registration)
  diagramStore.addElement(element)
}
</script>
```

#### Real Examples from Codebase

**Example 1: Custom Image Form** (`AddCustomImageForm.vue`)

**Template:**
```html
<template>
  <!-- UI: Form with button -->
  <v-btn @click="addCustomImage">Add</v-btn>
</template>
```

**Script:**
```typescript
<script setup>
// Real code from AddCustomImageForm.vue
function addCustomImage() {
  const imageElement = new shapes.standard.Image()
  imageElement.position(0, 0)
  imageElement.size(width.value, height.value)
  imageElement.attr('image/xlinkHref', imageUrl.value)
  imageElement.attr('label/text', label.value)
  imageElement.prop('data/noneConnectable', noneConnectable.value)
  
  store.addElement(imageElement) // ✅ Magic happens here!
}
</script>
```

**Example 2: Drag-and-Drop Shapes** (`ControlPanelShapes.vue`)

**Template:**
```html
<template>
  <!-- UI: Draggable images -->
  <img @dragend="onDrop($event, img)" :src="img" />
</template>
```

**Script:**
```typescript
<script>
// Real code from ControlPanelShapes.vue
methods: {
  onDrop(event: DragEvent, img: string) {
    const image = new shapes.standard.Image()
    image.resize(60, 60)
    image.position(pos.x, pos.y)
    image.attr('image/xlinkHref', img)
    image.attr('label/text', title)
    
    this.diagramStore.addElement(image) // ✅ Same pattern!
  }
}
</script>
```

**Example 3: AI-Generated Shapes** (`simple-json.schema.ts`)
```typescript
// Real code from AI schema mapping
function createRectangleFromSimplifiedCell(cell: SimplifiedCellType) {
  const rect = new shapes.standard.Rectangle()
  rect.position(cell.position.x, cell.position.y)
  rect.resize(100, 100)
  rect.attr({
    body: { fill: cell.color || '#2ECC71', fillOpacity: 0.5 },
    label: { text: cell.title }
  })
  rect.prop('data', { group: cell.group })
  
  return rect // ✅ Later added via diagramStore.addElement(rect)
}
```

#### Custom Example: Add Diamond Shape

**Step 1: Create Control Panel Component**

**Template:** (`src/components/ControlPanel/ControlPanelCustomShapes.vue`)
```html
<template>
  <div class="p-4">
    <h3 class="mb-4">Custom Shapes</h3>
    
    <!-- Diamond Shape Button -->
    <v-btn 
      @click="addDiamond" 
      class="mb-2 mr-2" 
      color="blue"
    >
      💎 Add Diamond
    </v-btn>
    
    <!-- Star Shape Button -->
    <v-btn 
      @click="addStar" 
      class="mb-2 mr-2" 
      color="yellow"
    >
      ⭐ Add Star
    </v-btn>
    
    <!-- Custom Rectangle with Gradient -->
    <v-btn 
      @click="addGradientBox" 
      class="mb-2" 
      color="purple"
    >
      🎨 Add Gradient Box
    </v-btn>
  </div>
</template>
```

**Script:**
```typescript
<script setup lang="ts">
import { useDiagramStore } from '@/stores/diagram'
import { shapes } from 'jointjs'

const diagramStore = useDiagramStore()

function addDiamond() {
  const diamond = new shapes.standard.Polygon()
  diamond.position(150, 100)
  diamond.resize(100, 100)
  diamond.attr({
    body: {
      fill: '#FF6B6B',
      stroke: '#FF5252',
      strokeWidth: 2,
      // Diamond points (rotated square)
      refPoints: '0,10 10,0 20,10 10,20'
    },
    label: {
      text: 'Diamond',
      fill: 'white',
      fontWeight: 'bold'
    }
  })
  diamond.prop('data/type', 'diamond')
  
  diagramStore.addElement(diamond)
}

function addStar() {
  const star = new shapes.standard.Polygon()
  star.position(200, 150)
  star.resize(80, 80)
  star.attr({
    body: {
      fill: '#FFD93D',
      stroke: '#FFC107',
      strokeWidth: 2,
      // Star shape points
      refPoints: '10,1 12,7 19,7 14,11 16,18 10,14 4,18 6,11 1,7 8,7'
    },
    label: {
      text: 'Star',
      fill: '#333',
      fontWeight: 'bold'
    }
  })
  star.prop('data/type', 'star')
  
  diagramStore.addElement(star)
}

function addGradientBox() {
  const gradientBox = new shapes.standard.Rectangle()
  gradientBox.position(100, 200)
  gradientBox.resize(120, 60)
  gradientBox.attr({
    body: {
      fill: {
        type: 'linearGradient',
        stops: [
          { offset: '0%', color: '#667eea' },
          { offset: '100%', color: '#764ba2' }
        ]
      },
      stroke: '#5a67d8',
      strokeWidth: 2,
      rx: 10, // Rounded corners
      ry: 10
    },
    label: {
      text: 'Gradient Box',
      fill: 'white',
      fontWeight: 'bold',
      fontSize: 12
    }
  })
  gradientBox.prop('data/type', 'gradient-box')
  
  diagramStore.addElement(gradientBox)
}
</script>
```

**Step 2: Register in Main Control Panel**

**Template:** (`src/components/ControlPanel/ControlPanel.vue`)
```html
<template>
  <v-tabs v-model="tab">
    <!-- Existing tabs -->
    <v-tab value="properties">Properties</v-tab>
    <v-tab value="primitives">Primitives</v-tab>
    <v-tab value="shapes">Shapes</v-tab>
    <v-tab value="ai">AI</v-tab>
    
    <!-- New custom tab -->
    <v-tab value="custom">Custom</v-tab>
  </v-tabs>
  
  <v-window v-model="tab">
    <!-- Existing windows -->
    <!-- ... -->
    
    <!-- New custom window -->
    <v-window-item value="custom" class="h-full overflow-y-scroll">
      <control-panel-custom-shapes />
    </v-window-item>
  </v-window>
</template>
```

**Script:**
```typescript
<script lang="ts">
import ControlPanelCustomShapes from './ControlPanelCustomShapes.vue'

export default defineComponent({
  components: {
    // ... existing components
    ControlPanelCustomShapes
  }
})
</script>
```

#### What Happens When You Call `diagramStore.addElement()`

```typescript
// From src/stores/diagram.ts
function addElement(element: dia.Element) {
  element.addTo(graph)                    // 1. Add to JointJS graph
  addStandardToolsViewsForElement(element) // 2. Setup interaction tools
}

function addStandardToolsViewsForElement(element: dia.Element) {
  // 3. Create tools (boundary, resize handles)
  const toolsView = new dia.ToolsView({
    tools: [new elementTools.Boundary(), /* resize tools */]
  })
  
  // 4. Attach tools to element view
  elementView.addTools(toolsView)
  elementView.hideTools() // Hidden until selected
  
  // 5. Register in hierarchy store
  hierarchyStore.add(new HierarchyItem({
    id: elementView.id,
    name: element.attr('label/text'),
    element: element,
    toolsViewList: [new ToolsViewItem('hover', toolsView)]
  }))
  
  // 6. Event emission to parent window happens automatically
}
```

#### Key Principles

- **Use Standard JointJS Shapes**: `shapes.standard.Rectangle`, `shapes.standard.Image`, `shapes.standard.Polygon`
- **Configure via Attributes**: Use `attr()` for visual properties, `prop()` for data
- **One Function Call**: `diagramStore.addElement()` handles everything else
- **Automatic Integration**: Hierarchy registration, tools, events all happen automatically

### Adding New AI Chains

1. **Create Chain File**:
```typescript
// src/ai/chains/my-chain.ts
export class MyChain extends BaseChain {
  async call(inputs: MyInputs): Promise<MyOutputs> {
    // Chain logic
  }
}
```

2. **Register Chain**:
```typescript
// src/ai/index.ts
export { MyChain } from './chains/my-chain'
```

3. **Integrate in Component**:
```typescript
// Use in ControlPanelAi.vue
import { MyChain } from '@/ai'
```

### Adding New Control Panel Tabs

The control panel uses a fixed tab structure in `ControlPanel.vue`. To add a new tab:

**1. Add the tab and window item in ControlPanel.vue:**

**Template:**
```html
<v-tabs v-model="tab" align-tabs="center" class="w-full mb-2">
  <v-tab value="properties">Properties</v-tab>
  <v-tab value="primitives">Primitives</v-tab>
  <v-tab value="shapes">Shapes</v-tab>
  <v-tab value="ai">AI</v-tab>
  <v-tab value="mynew">My New Tab</v-tab> <!-- Add new tab -->
</v-tabs>

<v-window class="flex-1 h-full" v-model="tab">
  <!-- existing window items -->
  <v-window-item value="mynew" class="h-full">
    <control-panel-mynew />
  </v-window-item>
</v-window>
```

**Script:**
```ts
import ControlPanelMynew from './ControlPanelMynew.vue'

export default defineComponent({
  components: {
    ControlPanelShapes,
    ControlPanelProperties,
    ControlPanelPrimitives,
    ControlPanelAi,
    ControlPanelMynew // Add component
  },
  // ... rest stays the same
})
```

**2. Create your tab component** in `src/components/ControlPanel/ControlPanelMynew.vue`:

**Template:**
```html
<template>
  <v-card variant="plain">
    <v-card-text>
      <!-- Your tab content here -->
      <v-btn @click="addMyElement">Add Element</v-btn>
    </v-card-text>
  </v-card>
</template>
```

**Script:**
```ts
<script setup lang="ts">
import { useDiagramStore } from '@/stores/diagram'

const diagramStore = useDiagramStore()

function addMyElement() {
  // Button → Function → diagramStore.addElement()
  diagramStore.addElement(/* your element config */)
}
</script>
```

**Real Examples:**
- **Properties Tab**: Split layout with hierarchy + element properties
- **AI Tab**: Form with textarea, buttons calling AI functions  
- **Shapes Tab**: Grid of draggable image elements
- **Primitives Tab**: Accordion with draggable geometric shapes

### Element Properties System

The `ControlPanelPropertiesElementProperties.vue` component is responsible for managing all element properties in the editor. It provides a reactive interface between the UI controls and JointJS element attributes.

**Component Architecture:**

1. **Receives `itemId` prop** from parent hierarchy selection
2. **Finds element** via `diagramStore.hierarchyStore.find(itemId)`
3. **Maintains reactive state** for all editable properties
4. **Bidirectional sync** between UI controls and element attributes

**Property Categories Handled:**

```ts
// Core properties maintained as reactive refs
const label = ref('')                    // Element label text
const color = ref('')                    // Fill color (body/fill attribute)
const hasTextWrap = ref(false)          // Text wrapping toggle
const textWrap = ref({ width: 0, height: 0, ellipsis: true })
const size = ref({ width: 0, height: 0 }) // Element dimensions
```

**Reactive Synchronization Pattern:**

```ts
// 1. Initialize from element when itemId changes
watch(() => props.itemId, (value: string | null) => {
  if (!value) return
  
  // Read from element attributes
  label.value = item.value?.name as string
  color.value = item.value?.element.attr('body/fill') as string
  size.value = item.value?.element.size() || { width: 0, height: 0 }
  hasTextWrap.value = item.value?.element.attr('label/textWrap') != null
  // ... etc
})

// 2. Write back to element when properties change
watch(() => label.value, (value: string) => {
  item.value?.changeLabel(value)
})

watch(() => color.value, (value: string) => {
  item.value?.element.attr('body/fill', value)
})
```

**Property Sections in UI:**

1. **Label**: Text input for element name
2. **Text Wrap**: Checkbox + width/height controls + ellipsis option
3. **Transform**: Position (x,y), size (width,height), z-index, connectability
4. **Style**: Color picker (hidden for image elements)

**Graph Change Handling:**

```ts
// Listens to JointJS graph changes and updates UI
diagramStore.graph.on('change', () => onGraphChanged())

function onGraphChanged() {
  if (item.value == null) return
  // Sync size changes from external operations
  size.value = item.value?.element.size() || { width: 0, height: 0 }
  normalizeTextWrap()
}
```

**Adding Custom Properties:**

To extend this component with new properties:

```ts
// 1. Add reactive ref
const myCustomProp = ref('')

// 2. Initialize in itemId watcher
myCustomProp.value = item.value?.element.attr('custom/myProp') as string

// 3. Add change watcher  
watch(() => myCustomProp.value, (value: string) => {
  item.value?.element.attr('custom/myProp', value)
})
```

**Template:**
```html
<v-card variant="outlined">
  <v-card-title>Custom Properties</v-card-title>
  <v-card-text>
    <v-text-field 
      label="My Custom Property" 
      v-model="myCustomProp" 
    />
  </v-card-text>
</v-card>
```

The component uses JointJS's attribute system (`element.attr()`) and property system (`element.prop()`) to persist data, with Vue's reactivity providing the UI binding layer.

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test:unit
npm run test:e2e

# Build for production
npm run build
```

### Code Quality

- **ESLint**: Linting with Vue and TypeScript rules
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **Vitest**: Unit testing
- **Playwright**: E2E testing

### Debugging

1. **Vue DevTools**: Browser extension for Vue debugging
2. **JointJS Inspector**: `paper.options.interactive` for element inspection
3. **Console Logging**: Extensive logging in stores and services

## Best Practices

### State Management

- Use Pinia stores for global state
- Keep components reactive with `ref()` and `computed()`
- Avoid direct graph manipulation outside stores

### JointJS Integration

- Always use store methods for graph operations
- Register event listeners in stores, not components
- Use TypeScript interfaces for element definitions

### Performance

- Lazy load control panel components
- Debounce frequent operations (pan, zoom)
- Use `v-show` instead of `v-if` for toggles
- Minimize JointJS paper redraws

### Testing

- Test store methods independently
- Mock JointJS in unit tests
- Use Playwright for iframe communication testing

## Common Issues & Solutions

### 1. JointJS Paper Not Rendering

**Problem**: Paper appears blank or elements don't show
**Solution**: Ensure paper is properly initialized with valid container

```typescript
// Correct initialization
const paper = new dia.Paper({
  el: containerElement,
  model: graph,
  width: containerWidth,
  height: containerHeight
})
```

### 2. Iframe Communication Not Working

**Problem**: PostMessage events not received
**Solution**: Check event origin and data structure

```typescript
// Add origin validation
if (event.origin !== expectedOrigin) return

// Validate event data structure
if (!eventData.type || !eventData.payload) return
```

### 3. AI Chain Errors

**Problem**: LangChain chains failing
**Solution**: Validate input schemas and API keys

```typescript
// Use Zod for validation
const validatedInput = inputSchema.parse(userInput)
```

### 4. Memory Leaks

**Problem**: Components not properly cleaned up
**Solution**: Remove event listeners in `onUnmounted`

```typescript
onUnmounted(() => {
  graph.off('change', changeHandler)
  paper.off('cell:pointerdown', clickHandler)
})
```

## Deployment Considerations

### Environment Variables

```bash
# AI Configuration
VITE_OPENAI_API_KEY=your_api_key
VITE_AI_MODEL=gpt-4

# App Configuration  
VITE_APP_NAME=Diagram Designer
VITE_BASE_URL=/diagram-designer/
```

### Build Optimization

- Enable tree shaking for unused JointJS shapes
- Optimize bundle size with dynamic imports
- Configure Vite for production builds

### Iframe Embedding

```html
<!-- Parent application -->
<iframe
  src="https://your-domain.com/diagram-designer"
  width="100%"
  height="600px"
  frameborder="0"
></iframe>
```

## Critical Architecture Patterns

These patterns represent the fundamental architectural decisions that make the diagram editor extensible and maintainable. Understanding these patterns is essential for adding new features or modifying existing behavior.

### 1. Hierarchy System Pattern

The hierarchy system is the backbone of element management in the editor. It acts as a **state management layer** between JointJS's low-level graph operations and Vue's reactive UI components. This pattern ensures that every element in the diagram has a corresponding state object that can be efficiently queried, manipulated, and synchronized.

**Why This Pattern?**
- **Single Source of Truth**: All element state lives in one place
- **Event-Driven**: Changes propagate automatically through the system
- **Type Safety**: TypeScript interfaces ensure consistent element handling
- **Tool Management**: Visual interaction tools are centrally managed

#### Core Components

**HierarchyItem Model** (`src/model/hierarchy.model.ts`):
```typescript
export class HierarchyItem {
  id: string                    // Unique identifier
  name: string                  // Display name
  element: dia.Element          // JointJS element reference
  toolsViewList: ToolsViewItem[] // Associated tools (hover, selection)
  
  // Key methods:
  getToolsView(type)           // Get specific tool
  changeLabel(name)            // Update element label
}

export class HierarchyGroupItem extends HierarchyItem {
  // Special handling for group elements
  // Auto-moves child elements when group moves
  ChieldsId: string[]          // Child element IDs
}
```

**HierarchyStore Service** (`src/services/hierarchy-store.service.ts`):
```typescript
export class HierarchyStore {
  private _data: HierarchyItem[]  // Element registry
  _eventBus: TinyEmitter         // Event system
  
  // Key methods:
  add(item)                     // Register new element
  remove(id)                    // Unregister element  
  find(id)                      // Find by ID
  activeItem(item)              // Show tools for element
  blurAll()                     // Hide all tools
  addEvent(type, callback)      // Listen to hierarchy events
}
```

#### Element Registration Pattern

**When elements are added to the diagram:**

1. **Element Creation** → JointJS graph
2. **Tools Setup** → Visual interaction tools (resize, boundary)
3. **Hierarchy Registration** → Add to hierarchy store
4. **Event Emission** → Notify parent window

```typescript
// From src/stores/diagram.ts - addStandardToolsViewsForElement()
function addStandardToolsViewsForElement(element: dia.Element) {
  // 1. Create tools (boundary, resize handles)
  const tools = [new elementTools.Boundary()]
  
  // 2. Add type-specific tools
  if (element.attr('image/xlinkHref')) {
    tools.push(new ResizeTool({ selector: 'image' }))
  }
  
  // 3. Create tools view and attach to element
  const toolsView = new dia.ToolsView({ tools })
  const elementView = element.findView(paper.value)
  elementView.addTools(toolsView)
  elementView.hideTools() // Hidden by default
  
  // 4. Register in hierarchy store
  const isGroup = element.prop('data/type') == 'group'
  const hierarchyItem = isGroup 
    ? new HierarchyGroupItem({...})
    : new HierarchyItem({...})
    
  hierarchyStore.add(hierarchyItem)
}
```

#### Critical Pattern Details

**Element-to-Hierarchy Mapping:**
```typescript
// Every JointJS element gets a hierarchy counterpart
JointJS Element (dia.Element) ←→ HierarchyItem (Vue reactive state)
     ↓                                    ↓
   Graph operations                   UI state & events
   Visual attributes                  Selection state
   Position/size data                 Tool visibility
```

**Event Propagation Chain:**
```
1. User Action (click/drag/resize)
     ↓
2. JointJS Event (graph:change)
     ↓  
3. Store Handler (diagram.ts onChange)
     ↓
4. Hierarchy Event (hierarchyStore.emit)
     ↓
5. UI Updates (Vue reactivity)
     ↓
6. Parent Window (PostMessage API)
```

#### Adding New Element Types

**Element Creation Pattern:**

```typescript
// 1. Create element using standard JointJS shapes
const customElement = new shapes.standard.Rectangle({
  position: { x: 50, y: 50 },
  size: { width: 100, height: 80 },
  attrs: {
    body: { fill: 'lightblue', stroke: '#333' },
    label: { text: 'My Element', fill: 'black' }
  },
  // Optional: Set data.type for special handling
  data: {
    type: 'group' // Only 'group' has special behavior
  }
})

// 2. Add to diagram (this triggers the complete registration pipeline)
diagramStore.addElement(customElement)

// 3. The pipeline automatically handles:
//    - Tools creation (boundary, resize handles)
//    - Hierarchy registration (HierarchyItem or HierarchyGroupItem)
//    - Event emission (add event to parent window)
//    - UI updates (properties panel, hierarchy tree)
```

**Hierarchy Item Types:**
- **HierarchyItem**: Default for all elements
- **HierarchyGroupItem**: Only for elements with `data.type === 'group'` (provides child element management)

### 2. Control Panel Tab System Pattern

The control panel uses a **component composition pattern** with Vuetify's tab system to create modular, reusable interfaces. Each tab is an independent Vue component that follows consistent patterns for element creation and user interaction.

**Why This Pattern?**
- **Modularity**: Each tab can be developed independently
- **Consistency**: All tabs follow the same interaction patterns
- **Extensibility**: New tabs can be added without modifying existing code
- **Separation of Concerns**: Each tab handles one specific aspect of the editor

#### Main Panel Structure

**ControlPanel.vue** - Tab coordinator:
```vue
<template>
  <v-tabs v-model="tab">
    <v-tab value="properties">Properties</v-tab>
    <v-tab value="primitives">Primitives</v-tab>
    <v-tab value="shapes">Shapes</v-tab>
    <v-tab value="ai">AI</v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item value="shapes">
      <control-panel-shapes />
    </v-window-item>
    <!-- More tabs... -->
  </v-window>
</template>
```

#### Properties Tab Pattern

The Properties tab demonstrates advanced composition:

**ControlPanelProperties.vue** - Split layout:
```vue
<template>
  <div class="split h-full">
    <!-- Top: Hierarchy tree -->
    <div id="split-0">
      <hierarchy @selected="onElementSelected" />
    </div>
    
    <!-- Bottom: Property editor -->
    <div id="split-1">
      <ElementProperties v-if="selected" :itemId="selected" />
    </div>
  </div>
</template>
```

**Event Flow:**
1. User clicks element in hierarchy
2. `@selected` event fired with element ID  
3. Property editor component receives element ID
4. Property editor fetches element from hierarchy store
5. Property form dynamically rendered based on element type

#### Adding New Tabs Pattern

**Step 1: Create Tab Component**
```vue
<!-- src/components/ControlPanel/ControlPanelMyFeature.vue -->
<template>
  <div class="p-4">
    <!-- Your custom controls -->
    <v-btn @click="doSomething">My Action</v-btn>
  </div>
</template>

<script setup lang="ts">
import { useDiagramStore } from '@/stores/diagram'

const diagramStore = useDiagramStore()

function doSomething() {
  // Interact with diagram store
  const elements = diagramStore.graph.getElements()
  // ... your logic
}
</script>
```

**Step 2: Register in Main Panel**
```vue
<!-- src/components/ControlPanel/ControlPanel.vue -->
<script lang="ts">
import ControlPanelMyFeature from './ControlPanelMyFeature.vue'

export default defineComponent({
  components: {
    // ... existing components
    ControlPanelMyFeature
  }
})
</script>

<template>
  <v-tabs v-model="tab">
    <!-- ... existing tabs -->
    <v-tab value="myfeature">My Feature</v-tab>
  </v-tabs>
  
  <v-window v-model="tab">
    <!-- ... existing windows -->
    <v-window-item value="myfeature">
      <control-panel-my-feature />
    </v-window-item>
  </v-window>
</template>
```

#### Tab Communication Patterns

**Direct Store Access Pattern** (Most Common):
```typescript
// Each tab component directly accesses diagram store
import { useDiagramStore } from '@/stores/diagram'

const diagramStore = useDiagramStore()

function addElement() {
  // Button → Function → Store → Graph → Hierarchy → Events
  diagramStore.addElement(elementConfig)
}
```

**Event-Based Communication Pattern** (Properties Tab):
```typescript
// Parent component listens to child events
<hierarchy @selected="onElementSelected" />

function onElementSelected(elementId: string) {
  // Pass selected element to properties editor
  selectedElement.value = elementId
}
```

**State Sharing Pattern** (Split layouts):
```typescript
// Use Split.js for resizable panels
import Split from 'split.js'

onMounted(() => {
  Split(['#split-0', '#split-1'], {
    direction: 'vertical',
    sizes: [30, 70] // 30% hierarchy, 70% properties
  })
})
```

#### Element Creation Patterns

**Immediate Creation Pattern** (AI, Simple buttons):
```typescript
function createElement() {
  const element = new shapes.standard.Rectangle({...})
  diagramStore.addElement(element) // Created immediately
}
```

**Interactive Creation Pattern** (Primitives drag-to-create):
```typescript
function onSelectShape(type: string) {
  // 1. Enter creation mode
  selectedShape.value = type
  
  // 2. Register mouse events on paper
  diagramStore.paper.value.on('blank:pointerdown', onDragStart)
  diagramStore.paper.value.on('blank:pointermove', onDragging)  
  diagramStore.paper.value.on('blank:pointerup', onDragEnd)
}

function onDragStart(event: DragEvent) {
  // 3. Create element at click position
  const shape = primitiveShapes[selectedShape.value]
  shape.position = { x: event.offsetX, y: event.offsetY }
  currentElementId = diagramStore.addElementFromJson(shape)
}

function onDragging(event: DragEvent) {
  // 4. Resize element during drag
  const cell = diagramStore.graph.getCell(currentElementId)
  const width = Math.abs(event.offsetX - startX)
  const height = Math.abs(event.offsetY - startY)
  cell.size(width, height)
}

function onDragEnd() {
  // 5. Cleanup mouse events
  diagramStore.paper.value.off('blank:pointerdown blank:pointermove blank:pointerup')
  selectedShape.value = null
}
```

**Form-Based Creation Pattern** (Custom images):
```typescript
// User fills form, then creates element
const formData = ref({
  imageUrl: '',
  label: '',
  width: 100,
  height: 100
})

function createFromForm() {
  const element = new shapes.standard.Image({
    position: { x: 50, y: 50 },
    size: { width: formData.value.width, height: formData.value.height },
    attrs: {
      image: { xlinkHref: formData.value.imageUrl },
      label: { text: formData.value.label }
    }
  })
  
  diagramStore.addElement(element)
  resetForm()
}
```

### 3. Parent Window Event System Pattern

The event system implements a **message-passing architecture** that enables seamless integration between the diagram editor (running in an iframe) and parent applications. This pattern provides real-time synchronization, configuration management, and event notification without tight coupling.

**Why This Pattern?**
- **Security**: PostMessage API is browser-secure for cross-origin communication
- **Loose Coupling**: Parent and editor can be developed independently
- **Real-Time Sync**: Changes propagate immediately between iframe and parent
- **Bidirectional**: Both parent and editor can send/receive events
- **Event Safety**: Built-in loop prevention and origin validation

#### Event Registration Architecture

**Global Event Setup** (`src/events.ts`):
```typescript
// Incoming events (Parent → Editor)
export function registerGlobalEvents() {
  window.onmessage = (event) => {
    if (event.source === window) return // Prevent self-messages
    
    const eventData = event.data
    
    if (eventData.type === 'graph') {
      // Load diagram data from parent
      diagramStore.insertDiagramData(eventData.payload)
    }
    
    if (eventData.type === 'settings') {
      // Apply configuration from parent
      configStore.insertSettings(eventData.payload)
    }
  }
}

// Outgoing events (Editor → Parent)  
export function registerGlobalEmits() {
  // Connect hierarchy events to parent notifications
  diagramStore.hierarchyStore.addEvent('add', (item) => {
    const element = JSON.stringify(item.element.toJSON())
    configStore.updateParentWindowWithElementTransaction('add', element)
  })
  
  diagramStore.hierarchyStore.addEvent('remove', (item) => {
    configStore.updateParentWindowWithElementTransaction('remove', element)
  })
  
  diagramStore.hierarchyStore.addEvent('select', (item) => {
    configStore.updateParentWindowWithElementTransaction('select', element)
  })
}
```

#### Event Flow Pattern

**Automatic Graph Sync:**
```typescript
// In diagram store - onChange triggered by JointJS events
graph.on('change', () => onChange())
graph.on('add', () => onChange()) 
graph.on('remove', () => onChange())

function onChange() {
  if (configStore.updatePerChange == true) {
    // Send entire graph to parent on every change
    configStore.updateParentWindowWithGraph(graph.toJSON())
  }
}
```

**Element Lifecycle Events:**
```typescript
// Hierarchy store automatically emits events
hierarchyStore.add(item)    // → 'element-add' to parent
hierarchyStore.remove(id)   // → 'element-remove' to parent  
hierarchyStore.select(item) // → 'element-select' to parent
```

#### Parent Integration Pattern

**In Parent Application:**
```html
<iframe id="diagram-editor" src="/diagram-editor"></iframe>

<script>
const iframe = document.getElementById('diagram-editor')

// Send initial configuration
iframe.onload = () => {
  iframe.contentWindow.postMessage({
    type: 'settings',
    payload: {
      update_per_change: true,
      toggle_control_panel: true
    }
  }, '*')
}

// Listen for events from editor
window.addEventListener('message', (event) => {
  if (event.data.type === 'ready') {
    console.log('Editor ready')
  }
  
  if (event.data.type === 'graph') {
    // Save diagram data
    saveDiagram(event.data.payload)
  }
  
  if (event.data.type === 'element-add') {
    console.log('Element added:', event.data.payload)
  }
})
</script>
```

#### Message Types and Payloads

**Standardized Event Schema:**
```typescript
interface EditorEvent {
  type: 'graph' | 'settings' | 'element-add' | 'element-remove' | 'element-select' | 'ready'
  payload: any
  timestamp?: number
  source?: 'editor' | 'parent'
}

// Examples of each event type:

// 1. Full graph data (Parent → Editor or Editor → Parent)
{
  type: 'graph',
  payload: {
    cells: [...], // JointJS graph JSON
    metadata: { name: 'My Diagram', version: 1 }
  }
}

// 2. Configuration (Parent → Editor)
{
  type: 'settings', 
  payload: {
    update_per_change: true,
    toggle_control_panel: false,
    readonly_mode: false
  }
}

// 3. Element operations (Editor → Parent)
{
  type: 'element-add',
  payload: {
    element: {...}, // JointJS element JSON
    hierarchyItem: {...} // Hierarchy metadata
  }
}
```

#### Advanced Integration Patterns

**Lazy Loading Pattern:**
```typescript
// Parent waits for editor ready signal
window.addEventListener('message', (event) => {
  if (event.data.type === 'ready') {
    // Now safe to send initial configuration
    iframe.contentWindow.postMessage({
      type: 'settings',
      payload: appConfig
    }, '*')
    
    // Load saved diagram if available
    if (savedDiagram) {
      iframe.contentWindow.postMessage({
        type: 'graph', 
        payload: savedDiagram
      }, '*')
    }
  }
})
```

**Selective Update Pattern:**
```typescript
// Parent can enable/disable real-time updates
function toggleRealTimeSync(enabled: boolean) {
  iframe.contentWindow.postMessage({
    type: 'settings',
    payload: { update_per_change: enabled }
  }, '*')
}

// Get current state on demand
function getCurrentDiagram() {
  return new Promise(resolve => {
    // Request current state
    iframe.contentWindow.postMessage({
      type: 'get-graph'
    }, '*')
    
    // Listen for response
    const handler = (event) => {
      if (event.data.type === 'graph') {
        window.removeEventListener('message', handler)
        resolve(event.data.payload)
      }
    }
    window.addEventListener('message', handler)
  })
}
```

#### Event Safety Patterns

**Preventing Event Loops:**
```typescript
// Flag to ignore self-generated changes
let ignoringNextChange = false

// When receiving external graph data
if (eventData.type === 'graph') {
  ignoringNextChange = true // Prevent sending back same data
  diagramStore.insertDiagramData(eventData.payload)
}

// In graph change handler
function onChange() {
  if (ignoringNextChange) {
    ignoringNextChange = false
    return // Skip sending to parent
  }
  
  if (configStore.updatePerChange) {
    configStore.updateParentWindowWithGraph(graph.toJSON())
  }
}
```




## Resources

- [JointJS Documentation](https://resources.jointjs.com/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [LangChain Documentation](https://js.langchain.com/)
- [Vuetify Documentation](https://vuetifyjs.com/) 