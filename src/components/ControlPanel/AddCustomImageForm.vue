<script setup lang="ts">
import { useDiagramStore } from '@/stores/diagram'
import { shapes } from 'jointjs'
import { ref } from 'vue'

const props = defineProps<{
  activator: string
}>()

const label = ref<string>('Change my label')
const imageUrl = ref<string>('')
const width = ref<number>(0)
const height = ref<number>(0)

const imageEl = ref<HTMLImageElement | null>(null)

function getImageSize() {
  if (imageEl.value) {
    width.value = imageEl.value.naturalWidth
    height.value = imageEl.value.naturalHeight
  }
}

const store = useDiagramStore()
function addCustomImage() {
  // Reject
  if (!imageUrl.value.length || width.value <= 0 || height.value <= 0) return

  // Add custom image
  const imageElement = new shapes.standard.Image()
  imageElement.position(0, 0)
  imageElement.size(width.value, height.value)
  imageElement.attr('image/xlinkHref', imageUrl.value)
  store.addElement(imageElement)
}
</script>

<template>
  <v-overlay :activator="props.activator" class="flex justify-center items-center">
    <v-card width="600">
      <v-card-title>Add Custom Image</v-card-title>

      <v-card-text class="flex space-x-2">
        <div class="flex-1">
          <v-text-field label="Label" v-model:model-value="label" />
          <v-text-field label="Image URL" v-model:model-value="imageUrl" />
          <div class="flex space-x-2">
            <v-text-field label="Width" v-model:model-value="width" type="number" />
            <v-text-field label="Height" v-model:model-value="height" type="number" />
          </div>
        </div>
        <!-- image preview -->
        <v-card
          variant="plain"
          width="200"
          :class="['overflow-hidden', { 'opacity-0': !imageUrl.length }]"
        >
          <v-img :src="imageUrl" ref="imageEl" @load="getImageSize" />
        </v-card>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="addCustomImage">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>
