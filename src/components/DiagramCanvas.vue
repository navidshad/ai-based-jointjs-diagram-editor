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
import { g } from 'jointjs'
import 'jointjs/dist/joint.css'

import PanComponent from './Pan.vue'

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

const canvasSize = computed(() => {
  return {
    width: props.width,
    height: props.height
  }
})

watch(props, () => diagramStore.paper?.setDimensions(props.width, props.height))

// @ts-ignore
onBeforeMount(() => diagramStore.paper?.remove())
onMounted(() => initiateDiagram())

function initiateDiagram() {
  diagramStore.addPaper({
    el: editorEl.value,
    model: diagramStore.graph,
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
