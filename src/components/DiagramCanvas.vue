<template>
  <div ref="editorEl" :style="frameSize" @wheel="onMouseWheel" />
</template>

<script setup lang="ts">
import { g } from 'jointjs'
import 'jointjs/dist/joint.css'

import { type CustomElementView } from '@/types/general'
import { ref, computed, watch, onMounted, onBeforeMount } from 'vue'

import { useDiagramStore } from '@/stores/diagram'

const diagramStore = useDiagramStore()
const editorEl = ref<HTMLElement | null>(null)

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

const panControllerValues = ref({
  mousePosition: { x: 0, y: 0 },
  previousMousePosition: { x: 0, y: 0 },
  isOverElement: false
})

watch(props, () => diagramStore.paper?.setDimensions(props.width, props.height))

onBeforeMount(() => {
  // @ts-ignore
  diagramStore.paper?.remove()

  window.removeEventListener('mousemove', updateMousePosition)
  window.removeEventListener('wheel', diagramStore.handleMouseWheel)
})

onMounted(() => {
  initiateDiagram()

  window.addEventListener('mousemove', updateMousePosition)
  window.addEventListener('wheel', diagramStore.handleMouseWheel)
})

function updateMousePosition(event: MouseEvent) {
  panControllerValues.value.previousMousePosition = {
    x: panControllerValues.value.mousePosition.x,
    y: panControllerValues.value.mousePosition.y
  }

  panControllerValues.value.mousePosition = { x: event.clientX, y: event.clientY }
}

function initiateDiagram() {
  diagramStore.addPaper({
    el: editorEl.value,
    model: diagramStore.graph,
    width: frameSize.value.width,
    height: frameSize.value.height,
    gridSize: 8,
    drawGrid: true,
    background: {
      color: 'white'
    }
  })

  //
  // Events
  //

  diagramStore.paper?.on({
    'element:pointerdown': function (elementView, evt, x, y) {
      evt.data = { x, y }

      // @ts-ignore
      let id = elementView.id as string

      let element = diagramStore.hierarchyStore.find(id)
      diagramStore.hierarchyStore._eventBus.emit('select', element)
      diagramStore.hierarchyStore.activeItem(element)
    },

    'element:pointerup': function (view, evt, x, y) {
      const coordinates = new g.Point(x, y)

      const sourceElementView = view as CustomElementView
      const sourceElement = sourceElementView.model

      // Ignore if the element is not connectable
      if (sourceElement.prop('data/noneConnectable') || false) return

      let destElementView = diagramStore.paper?.findViewsFromPoint(coordinates).find(function (el) {
        // @ts-ignore
        const isNotSourceElement = el.model.id !== sourceElement.id
        // @ts-ignore
        const isNoneConnectable = el.model.prop('data/noneConnectable') || false

        return isNotSourceElement && !isNoneConnectable
      }) as CustomElementView

      if (!destElementView) return

      let destElement = destElementView.model

      // If the two elements are connected already,
      // don't connect them again (this is application-specific though).
      if (
        destElement &&
        diagramStore.graph.getNeighbors(destElement).indexOf(sourceElement) === -1
      ) {
        // Move the element to the position before dragging.
        sourceElement.position(evt.data.x, evt.data.y)

        // Create a connection between elements.
        diagramStore.addLink(sourceElement, destElement)
      }
    },

    'blank:pointermove': function (_evt, _x, _y) {
      const { x, y } = panControllerValues.value.mousePosition
      let dx = x - (panControllerValues.value.previousMousePosition.x || 0)
      let dy = y - (panControllerValues.value.previousMousePosition.y || 0)

      if (!panControllerValues.value.isOverElement) {
        diagramStore.setViewportPosition(dx, dy)
      }
    },
    'element:pointermove': function (_elementView, _evt, _x, _y) {
      panControllerValues.value.isOverElement = true
    },
    'element:mouseleave': function (_elementView, _evt) {
      panControllerValues.value.isOverElement = false
    }
  })
}

function onMouseWheel(_event: WheelEvent) {
  // let { deltaY } = event
  // let { sx, sy } = diagramStore.paper.scale()
  // let scaleSignal = isNegative(deltaY) ? -0.1 : 0.1
  // diagramStore.paper.scale(sx + scaleSignal, sy + scaleSignal)
}
</script>

<style scoped>
.editor-container {
  position: relative;
  overflow: hidden;
}
</style>
