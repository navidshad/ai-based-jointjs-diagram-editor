<script setup lang="ts">
import { useDiagramStore } from '@/stores/diagram'
import { computed, watch, ref } from 'vue'

const props = defineProps<{
  itemId: string | null
}>()

const diagramStore = useDiagramStore()
// @ts-ignore
diagramStore.graph.on('change', () => onGraphChanged())

const item = computed(() => {
  if (!props.itemId) return null
  return diagramStore.hierarchyStore.find(props.itemId)
})
const isImage = computed(() => {
  return item.value?.element.attr('image') != null
})

//
// Properties temp
//
const label = ref('')
const color = ref('')
const hasTextWrap = ref(false)
const textWrap = ref({ width: 0, height: 0, ellipsis: true })
const size = ref({ width: 0, height: 0 })
//
// End Properties temp

watch(
  () => props.itemId,
  (value: string | null) => {
    console.log('props.itemId', value)

    if (!value) return
    label.value = item.value?.name as string
    color.value = item.value?.element.attr('body/fill') as string
    size.value = item.value?.element.size() || { width: 0, height: 0 }

    hasTextWrap.value = item.value?.element.attr('label/textWrap') != null
    textWrap.value = hasTextWrap.value
      ? item.value?.element.attr('label/textWrap')
      : {
          width: size.value.width,
          height: size.value.height,
          ellipsis: false
        }

    normalizeTextWrap()
  },
  { immediate: true, deep: true }
)

watch(
  () => item.value?.element.size(),
  (value) => {
    console.log('item.value?.element.size()', value)
  },
  { deep: true }
)

watch(
  () => label.value,
  (value: string) => {
    item.value?.changeLabel(value)
  }
)

watch(
  () => hasTextWrap.value,
  (value: boolean) => {
    if (!value) {
      item.value?.element.attr('label/textWrap', null)
    } else {
      updateTextWrap()
    }
  }
)

watch(
  () => color.value,
  (value: string) => {
    item.value?.element.attr('body/fill', value)
  }
)

function onGraphChanged() {
  if (item.value == null) return

  size.value = item.value?.element.size() || { width: 0, height: 0 }
  normalizeTextWrap()
}

function normalizeTextWrap() {
  // Normalize textWrap
  if (hasTextWrap.value) {
    // Check if the textWrap is bigger than the size
    if (textWrap.value.width > size.value.width) {
      textWrap.value.width = size.value.width
    }
    if (textWrap.value.height > size.value.height) {
      textWrap.value.height = size.value.height
    }

    // Check if the textWrap is smaller than the size
    if (textWrap.value.width < size.value.width) {
      textWrap.value.width = size.value.width
    }
    if (textWrap.value.height < size.value.height) {
      textWrap.value.height = size.value.height
    }

    updateTextWrap()
  }
}

function updateTextWrap() {
  item.value?.element.attr('label/textWrap', {
    width: textWrap.value.width,
    height: textWrap.value.height,
    ellipsis: textWrap.value.ellipsis
  })
}

function setPosition(xValue: string | number, yValue: string | number) {
  xValue = parseInt(xValue.toString())
  yValue = parseInt(yValue.toString())
  item.value?.element.position(xValue, yValue)
}

function setSize(wValue: string | number, hValue: string | number) {
  wValue = parseInt(wValue.toString())
  hValue = parseInt(hValue.toString())
  item.value?.element.size(wValue, hValue)
}
</script>

<template>
  <div class="w-full p-2" v-if="item != null">
    <v-card variant="plain">
      <!-- <v-card-title>Label</v-card-title> -->
      <v-card-text>
        <v-text-field label="Label" outlined dense class="w-full" v-model:model-value="label" />
      </v-card-text>
    </v-card>

    <v-card variant="outlined">
      <!-- <v-card-title>Label</v-card-title> -->
      <v-card-text>
        <v-checkbox v-model="hasTextWrap" label="Activate text wrap" />

        <p class="pb-4">
          You can wrap the text inside the element by setting the width and hight here.
        </p>

        <div class="flex space-x-2">
          <v-text-field
            :disabled="!hasTextWrap"
            v-model="textWrap.width"
            @update:model-value="updateTextWrap"
            label="Wrap width"
            type="number"
          />

          <v-text-field
            :disabled="!hasTextWrap"
            :model-value="textWrap.height"
            @update:model-value="updateTextWrap"
            label="Wrap height"
            type="number"
          />
        </div>

        <v-checkbox
          :disabled="!hasTextWrap"
          v-model="textWrap.ellipsis"
          label="Add Ellipsis (...) a the end."
        />
      </v-card-text>
    </v-card>

    <v-card variant="plain">
      <v-card-title>Transform</v-card-title>
      <v-card-text>
        <div class="flex space-x-2">
          <v-text-field
            :model-value="item.element.position().x"
            @update:model-value="setPosition($event, item.element.position().y)"
            label="x"
            type="number"
          />

          <v-text-field
            :model-value="item.element.position().y"
            @update:model-value="setPosition(item.element.position().x, $event)"
            label="y"
            type="number"
          />
        </div>

        <div class="flex space-x-2">
          <v-text-field
            v-model="size.width"
            @update:model-value="setSize($event, item.element.size().height)"
            label="width"
            type="number"
          />

          <v-text-field
            v-model="size.height"
            @update:model-value="setSize(item.element.size().width, $event)"
            label="height"
            type="number"
          />
        </div>

        <div class="flex space-x-2">
          <v-text-field
            model-value="It depends the order of the elements you create"
            label="ZIndex"
            disabled
          />
        </div>

        <v-checkbox
          label="Don't connect with other elements"
          :model-value="item?.element.prop('data/noneConnectable')"
          @update:model-value="item?.element.prop('data/noneConnectable', $event)"
        />
      </v-card-text>
    </v-card>

    <v-card variant="outlined" v-if="!isImage">
      <v-card-title>Style</v-card-title>
      <v-card-text>
        <div class="w-full flex justify-center">
          <v-color-picker elevation="0" v-model="color" mode="hexa"></v-color-picker>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
