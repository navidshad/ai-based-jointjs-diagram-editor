<template>
  <div class="editor-container">
    <pan-component :frameSize="frameSize" :contentSize="canvasSize">
      <!-- 
        Diagram Canvas
       -->
      <template v-slot:canvas>
        <div ref="editorEl" @wheel="onMouseWheel" />
      </template>
    </pan-component>
  </div>
</template>

<script setup lang="ts">
import { dia, shapes, g } from 'jointjs'
import 'jointjs/dist/joint.css'

import PanComponent from './Pan.vue'

import { type CustomElementView } from '@/types/general'
import { ref, computed, watch, onMounted } from 'vue'
import { isNegative } from '@/helpers/math'
import { canvas } from '../services/canvas.service'
import { useConfigStore } from '@/stores/config'
import { useDiagramStore } from '@/stores/diagram'

const configStore = useConfigStore()
const diagramStore = useDiagramStore()
const editorEl = ref<HTMLElement | null>(null)
let graph!: dia.Graph
let paper!: dia.Paper

const props = defineProps({
  width: {
    type: Number,
    default: 400
  },
  height: {
    type: Number,
    default: 400
  }
})

const frameSize = computed(() => {
  return {
    width: props.width,
    height: props.height
  }
})

const canvasSize = computed(() => {
  return {
    width: props.width,
    height: props.height
  }
})

watch(props, () => paper.setDimensions(props.width, props.height))
onMounted(() => intiateDiagram())

// Update graph when new diagram data received
watch(
  () => diagramStore.diagramData.cells,
  () => {
    graph.clear()
    graph.fromJSON(diagramStore.diagramData)

    // Update parent window with graph
    configStore.updateParentWindowWithGraph(graph.toJSON())
  },
  { deep: true }
)

function intiateDiagram() {
  graph = new dia.Graph(diagramStore.diagramData.cells, { cellNamespace: shapes })

  paper = new dia.Paper({
    el: editorEl.value,
    model: graph,
    width: canvasSize.value.width,
    height: canvasSize.value.height,
    gridSize: 8,
    drawGrid: true,
    background: {
      color: 'white'
    }
  })

  //
  // Events
  //

  // @ts-ignore
  graph.on('change', () => {
    if (configStore.updatePerChange) {
      configStore.updateParentWindowWithGraph(graph.toJSON())
    }
  })

  paper.on({
    'element:pointerdown': function (elementView, evt, x, y) {
      evt.data = { x, y }

      // @ts-ignore
      let id = elementView.id as string

      let element = canvas.hierarchyStore.find(id)
      canvas.hierarchyStore._eventBus.emit('select', element)
      canvas.hierarchyStore.activeItem(element)
    },

    'element:pointerup': function (view, evt, x, y) {
      let coordinates = new g.Point(x, y)

      let sourceElementView = view as CustomElementView
      let sourceElement = sourceElementView.model

      let destElementView = paper.findViewsFromPoint(coordinates).find(function (el) {
        // @ts-ignore
        return el.model.id !== sourceElement.id
      }) as CustomElementView

      if (!destElementView) return

      let destElement = destElementView.model

      // If the two elements are connected already, don't
      // connect them again (this is application-specific though).
      if (destElement && graph.getNeighbors(destElement).indexOf(sourceElement) === -1) {
        // Move the element to the position before dragging.
        sourceElement.position(evt.data.x, evt.data.y)

        // Create a connection between elements.
        var link = new shapes.standard.Link()
        link.source(sourceElement)
        link.target(destElement)
        link.addTo(graph)

        canvas.addStandardToolsViewsForLink(link)
      }
    }
  })
}

function onMouseWheel(event: WheelEvent) {
  let { deltaY } = event
  let { sx, sy } = paper.scale()

  let scaleSignal = isNegative(deltaY) ? -0.1 : 0.1
  // canvas.paper.scale(sx + scaleSignal, sy + scaleSignal)
}
</script>

<style scoped>
.editor-container {
  position: relative;
  overflow: hidden;
}
</style>
