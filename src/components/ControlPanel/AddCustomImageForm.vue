<script setup lang="ts">
import { useDiagramStore } from '@/stores/diagram'
import { shapes } from 'jointjs'
import { onMounted } from 'vue'
import { ref } from 'vue'

const store = useDiagramStore()
const props = defineProps<{
  activator: string
}>()

const imageUrl = ref<string>(
  'https://d2908q01vomqb2.cloudfront.net/fc074d501302eb2b93e2554793fcaf50b3bf7291/2022/12/20/Figure-1.-Workflow-manager-for-genomics-workflows-1260x529.png'
)
const label = ref<string>('Change my label')
const width = ref<number>(0)
const height = ref<number>(0)
const noneConectable = ref<boolean>(true)

const imageEl = ref<HTMLImageElement | null>(null)

onMounted(() => getImageSize())

function getImageSize() {
  if (imageEl.value) {
    width.value = imageEl.value.naturalWidth
    height.value = imageEl.value.naturalHeight
  }
}

function addCustomImage() {
  // Reject
  if (!imageUrl.value.length || width.value <= 0 || height.value <= 0) return

  // Add custom image
  const imageElement = new shapes.standard.Image()
  imageElement.position(0, 0)
  imageElement.size(width.value, height.value)
  imageElement.attr('image/xlinkHref', imageUrl.value)
  imageElement.attr('label/text', label.value)
  imageElement.prop('data/noneConectable', noneConectable.value)
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
          <v-checkbox
            label="None Connectable with other elements"
            v-model:model-value="noneConectable"
          />
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
