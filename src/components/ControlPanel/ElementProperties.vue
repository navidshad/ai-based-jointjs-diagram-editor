<script setup lang="ts">
import type { HierarchyItem } from '@/model/hierarchy.model'
import { computed, watch, ref } from 'vue'

const props = defineProps<{
  item: HierarchyItem | null
}>()

const label = ref('')
const color = ref('')

const isImage = computed(() => {
  return props.item?.element.attr('image') != null
})

watch(
  () => props.item,
  (value: HierarchyItem | null) => {
    if (value) {
      label.value = props.item?.name as string
      color.value = props.item?.element.attr('body/fill') as string
    }
  },
  { immediate: true, deep: true }
)

watch(
  () => label.value,
  (value: string) => {
    props.item?.changeLabel(value)
  }
)
watch(
  () => color.value,
  (value: string) => {
    props.item?.element.attr('body/fill', value)
  }
)

function setZIndex(value: string | number) {
  // @TODO fix zindex
  // z-index is the index on the array of elements
}

function setPosition(xValue: string | number, yValue: string | number) {
  xValue = parseInt(xValue.toString())
  yValue = parseInt(yValue.toString())
  props.item?.element.position(xValue, yValue)
}

function setSize(wValue: string | number, hValue: string | number) {
  wValue = parseInt(wValue.toString())
  hValue = parseInt(hValue.toString())
  props.item?.element.size(wValue, hValue)
}
</script>

<template>
  <div class="w-full" v-if="props.item != null">
    <v-card variant="plain">
      <!-- <v-card-title>Label</v-card-title> -->
      <v-card-text>
        <v-text-field label="Label" outlined dense class="w-full" v-model:model-value="label" />
      </v-card-text>
    </v-card>

    <v-card variant="plain">
      <v-card-title>Transform</v-card-title>
      <v-card-text>
        <div class="flex space-x-2">
          <v-text-field
            :model-value="props.item.element.position().x"
            @update:model-value="setPosition($event, props.item.element.position().y)"
            label="x"
            type="number"
          />

          <v-text-field
            :model-value="props.item.element.position().y"
            @update:model-value="setPosition(props.item.element.position().x, $event)"
            label="y"
            type="number"
          />
        </div>

        <div class="flex space-x-2">
          <v-text-field
            :model-value="props.item.element.size().width"
            @update:model-value="setSize($event, props.item.element.size().height)"
            label="width"
            type="number"
          />

          <v-text-field
            :model-value="props.item.element.size().height"
            @update:model-value="setSize(props.item.element.size().width, $event)"
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
          :model-value="item?.element.prop('data/noneConectable')"
          @update:model-value="item?.element.prop('data/noneConectable', $event)"
        />
      </v-card-text>
    </v-card>

    <v-card variant="plain" v-if="!isImage">
      <v-card-title>Style</v-card-title>
      <v-card-text>
        <div class="w-full flex justify-center">
          <v-color-picker elevation="0" v-model="color" mode="hexa"></v-color-picker>
        </div>
      </v-card-text>
    </v-card>

    <!-- <v-textarea
      :model-value="JSON.stringify(props.item.element.attributes)"
      label="Label"
      outlined
      dense
      class="w-full"
    /> -->
  </div>
</template>
