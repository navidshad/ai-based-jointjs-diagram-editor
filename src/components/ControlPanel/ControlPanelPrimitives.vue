<template>
  <section class="p-2 flex items-center justify-between flex-wrap">
    <div :class="['shape']" @click="onSelectShape('none')">
      <svg width="100" height="100">
        <rect
          stroke-width="2"
          stroke="#000000"
          fill="white"
          fill-opacity="0.5"
          width="100"
          height="100"
        />
        <text
          font-size="14"
          xml:space="preserve"
          text-anchor="middle"
          fill="#333333"
          transform="matrix(1,0,0,1,50,50)"
        >
          <tspan dy="0.3em" class="v-line">None</tspan>
        </text>
      </svg>
    </div>
    <!-- Rectangle -->
    <div
      :class="['shape', { 'bg-[#b6e5f5]': selectedShape == 'rectangle' }]"
      @click="onSelectShape('rectangle')"
    >
      <svg width="100" height="100">
        <rect
          stroke-width="2"
          stroke="#000000"
          fill="#30d0c6"
          fill-opacity="0.5"
          width="100"
          height="100"
        />
        <text
          font-size="14"
          xml:space="preserve"
          text-anchor="middle"
          fill="#333333"
          transform="matrix(1,0,0,1,50,50)"
        >
          <tspan dy="0.3em" class="v-line">Rectangle</tspan>
        </text>
      </svg>
    </div>

    <!-- Circle -->
    <div
      :class="['shape', { 'bg-[#b6e5f5]': selectedShape == 'circle' }]"
      @click="onSelectShape('circle')"
    >
      <svg width="100" height="100">
        <circle
          stroke-width="2"
          stroke="#333333"
          fill="#30d0c6"
          fill-opacity="0.5"
          cx="50"
          cy="50"
          r="50"
        />
        <text
          font-size="14"
          xml:space="preserve"
          text-anchor="middle"
          fill="#333333"
          transform="matrix(1,0,0,1,50,50)"
        >
          <tspan dy="0.3em" class="v-line">Circle</tspan>
        </text>
      </svg>
    </div>

    <!-- Ellipse -->
    <div
      :class="['shape', { 'bg-[#b6e5f5]': selectedShape == 'ellipse' }]"
      @click="onSelectShape('ellipse')"
    >
      <svg width="100" height="100">
        <ellipse
          stroke-width="2"
          stroke="#333333"
          fill="#30d0c6"
          fill-opacity="0.5"
          cx="35"
          cy="50"
          rx="35"
          ry="50"
        />
        <text
          font-size="14"
          xml:space="preserve"
          text-anchor="middle"
          fill="#333333"
          transform="matrix(1,0,0,1,35,50)"
        >
          <tspan dy="0.3em" class="v-line">Ellipse</tspan>
        </text>
      </svg>
    </div>
  </section>

  <!-- Guide -->
  <p class="p-2 my-2 text-gray-500">
    Select an item then try to "drag and create" on the canvas to add your shape.
  </p>
</template>

<script setup lang="ts">
import { useDiagramStore } from '@/stores/diagram'
import { type PrimitiveType, primitiveShapes } from '@/static/primitives-initial'
import { ref } from 'vue'
import { dia } from 'jointjs'

const diagramStore = useDiagramStore()
const selectedShape = ref<PrimitiveType | 'none'>('none')
let mouseStart = { x: 0, y: 0, id: '' }

function onSelectShape(type: string) {
  selectedShape.value = type as any

  if (type === 'none') return

  mouseStart = { x: 0, y: 0, id: '' }

  diagramStore.paper.on('blank:pointerdown', onDragStart)
  diagramStore.paper.on('blank:pointermove', onDragging)
  diagramStore.paper.on('blank:pointerup', onDragEnd)
}

function onDragStart(event: DragEvent) {
  mouseStart = {
    x: event.offsetX,
    y: event.offsetY,
    id: `pr-${selectedShape.value}` + new Date().getTime().toString()
  }

  const shape = primitiveShapes[selectedShape.value]
  shape.position = { x: mouseStart.x, y: mouseStart.y }
  shape.id = mouseStart.id

  diagramStore.addElementFromJson(shape)
}

function onDragging(event: DragEvent) {
  selectedShape.value = 'none'

  const width = Math.abs(mouseStart.x - event.offsetX)
  const height = Math.abs(mouseStart.y - event.offsetY)

  const cell = diagramStore.graph.getCell(mouseStart.id)
  if (cell) {
    // @ts-ignore
    cell.size(width, height)
  }
}

function onDragEnd(event: DragEvent) {
  // @ts-ignore
  diagramStore.paper.off('blank:pointerdown', onDragStart)
  // @ts-ignore
  diagramStore.paper.off('blank:pointermove', onDragging)
  // @ts-ignore
  diagramStore.paper.off('blank:pointerup', onDragEnd)
}
</script>

<style lang="scss" scoped>
.shape {
  padding: 5px;
  transition: all ease 200ms;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: lightblue;
  }

  img {
    width: auto;
    height: 80px;
  }
}
</style>
