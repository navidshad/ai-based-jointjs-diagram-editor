<template>
  <section class="flex items-center flex-wrap">
    <!-- Node -->
    <div :class="['shape']" @click="onSelectShape('none')">
      <span dy="0.3em" class="v-line">None</span>
    </div>

    <!-- Rectangle -->
    <div
      :class="['shape', { 'bg-[#b6e5f5]': selectedShape == 'rectangle' }]"
      @click="onSelectShape('rectangle')"
    >
      <span>
        <v-icon :size="40" class="text-blue-400">mdi-rectangle</v-icon>
      </span>
      <span>Rectangle</span>
    </div>

    <!-- Circle -->
    <div
      :class="['shape', { 'bg-[#b6e5f5]': selectedShape == 'circle' }]"
      @click="onSelectShape('circle')"
    >
      <span>
        <v-icon :size="40" class="text-blue-400">mdi-circle</v-icon>
      </span>
      <span>Circle</span>
    </div>

    <!-- Ellipse -->
    <div
      :class="['shape', { 'bg-[#b6e5f5]': selectedShape == 'ellipse' }]"
      @click="onSelectShape('ellipse')"
    >
      <span>
        <v-icon :size="40" class="text-blue-400">mdi-ellipse</v-icon>
      </span>
      <span dy="0.3em" class="v-line">Ellipse</span>
    </div>

    <!-- Custom Image -->
    <div :class="['shape']" id="add-custom-image" @click="selectedShape = 'none'">
      <span>
        <v-icon :size="40" class="text-blue-400">mdi-image</v-icon>
      </span>

      <span class="">Custom Image</span>

      <add-custom-image-form activator="#add-custom-image" />
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
import { watch } from 'vue'
import AddCustomImageForm from '@/components/ControlPanel/AddCustomImageForm.vue'

const diagramStore = useDiagramStore()
const selectedShape = ref<PrimitiveType | 'none'>('none')
let isCreating = ref(false)
let mouseStart = { x: 0, y: 0, id: '' }

watch(isCreating, () => {
  diagramStore.isViewPortLocked = isCreating.value
})

function onSelectShape(type: string) {
  selectedShape.value = type as any

  // reset viewport scale
  diagramStore.paper.value.scale(1)

  if (type === 'none') return

  mouseStart = { x: 0, y: 0, id: '' }

  diagramStore.paper.value.on('blank:pointerdown', onDragStart)
  diagramStore.paper.value.on('blank:pointermove', onDragging)
  diagramStore.paper.value.on('blank:pointerup', onDragEnd)
}

function onDragStart(event: DragEvent) {
  if (isCreating.value) return

  isCreating.value = true

  mouseStart = {
    x: event.offsetX,
    y: event.offsetY,
    id: `pr-${selectedShape.value}` + new Date().getTime().toString()
  }

  const shape = primitiveShapes[selectedShape.value]

  // get paper position
  // paper position is the offset of the paper from the top left of the window
  const { tx, ty } = diagramStore.paper.value.translate()

  shape.position = {
    x: mouseStart.x - tx,
    y: mouseStart.y - ty
  }

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
  isCreating.value = false

  // @ts-ignore
  diagramStore.paper.value.off('blank:pointerdown', onDragStart)
  // @ts-ignore
  diagramStore.paper.value.off('blank:pointermove', onDragging)
  // @ts-ignore
  diagramStore.paper.value.off('blank:pointerup', onDragEnd)
}
</script>

<style lang="scss" scoped>
.shape {
  @apply w-[100px] h-[100px] m-1 flex flex-col justify-center items-center border-2 text-[12px];
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
