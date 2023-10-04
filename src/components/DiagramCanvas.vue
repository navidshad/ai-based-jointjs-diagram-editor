<template>
  <div class="editor-container">
    <pan-component :frameSize="frameSize" :contentSize="canvasSize">
      <!-- 
        Diagram Canvas
       -->
      <template v-slot:canvas>
        <div ref="editor" @wheel="onMouseWheel" />
      </template>
    </pan-component>
  </div>
</template>

<script lang="ts">
import { dia, shapes, g } from 'jointjs'
import 'jointjs/dist/joint.css'

import PanComponent from './Pan.vue'

import { isNegative } from '@/helpers/math'
import { defineComponent } from 'vue'
import { canvas } from '../services/canvas.service'
import { type CustomElementView } from '@/types/general'

export default defineComponent({
  components: { PanComponent },

  props: {
    width: { type: Number, default: 400 },
    height: { type: Number, default: 400 }
  },

  data() {
    return {
      controlPanelToggle: false
    }
  },

  computed: {
    paper() {
      return canvas.paper
    },

    graph() {
      return canvas.graph
    },

    frameSize() {
      return {
        width: this.width,
        height: this.height
      }
    },

    canvasSize() {
      return {
        width: this.width,
        height: this.height
      }
    }
  },

  watch: {
    width() {
      this.paper.setDimensions(this.width, this.height)
    },
    height() {
      this.paper.setDimensions(this.width, this.height)
    }
  },

  mounted() {
    this.intiateDiagram()
  },

  methods: {
    intiateDiagram() {
      let graph = new dia.Graph({}, { cellNamespace: shapes })

      let paper = new dia.Paper({
        // @ts-ignore
        el: this.$refs.editor,
        model: graph,
        width: this.canvasSize.width,
        height: this.canvasSize.height,
        gridSize: 8,
        drawGrid: true,
        background: {
          color: 'white'
        }
      })

      canvas.setup(graph, paper)
      this.addLinkFeature(graph, paper)
    },

    onMouseWheel(event: WheelEvent) {
      let { deltaY } = event
      let { sx, sy } = this.paper.scale()

      let scaleSignal = isNegative(deltaY) ? -0.1 : 0.1
      canvas.paper.scale(sx + scaleSignal, sy + scaleSignal)
    },

    addLinkFeature(graph: dia.Graph, paper: dia.Paper) {
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
  }
})
</script>

<style scoped>
.editor-container {
  position: relative;
  overflow: hidden;
}
</style>
