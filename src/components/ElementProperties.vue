<script setup lang="ts">
import type { HierarchyItem } from '@/model/hierarchy.model'

const props = defineProps<{
  item: HierarchyItem | null
}>()

function setLabel(value: string) {
  props.item?.element.attr('label/text', value)
  props.item?.changeLabel(value)
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
  <div class="w-full" v-if="props.item">
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
      </v-card-text>
    </v-card>

    <v-card variant="plain">
      <v-card-title>Label</v-card-title>
      <v-card-text>
        <v-text-field
          :model-value="props.item.element.attr('label/text')"
          @update:model-value="setLabel"
          label="Label"
          outlined
          dense
          class="w-full"
        />

        <v-checkbox
          label="None Connectable with other elements"
          :model-value="item?.element.prop('data/noneConectable')"
          @update:model-value="item?.element.prop('data/noneConectable', $event)"
        />
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
