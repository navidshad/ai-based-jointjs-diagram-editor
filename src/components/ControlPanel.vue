<template>
  <v-navigation-drawer location="right" permanent :model-value="active" :width="width">
    <section class="flex flex-col h-screen">
      <v-tabs v-model="tab" fixed-tabs>
        <v-tab value="properties">Properties</v-tab>
        <v-tab value="shapes">Shapes</v-tab>
      </v-tabs>

      <v-window class="flex-1 h-full" v-model="tab">
        <v-window-item value="shapes" class="h-full">
          <control-panel-shapes />
        </v-window-item>

        <v-window-item value="properties" class="h-full">
          <control-panel-properties />
        </v-window-item>
      </v-window>
    </section>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { AdditionalPanel } from '../model/additional-panel.model'
import ControlPanelProperties from './ControlPanelProperties.vue'
import ControlPanelShapes from './ControlPanelShapes.vue'

export default defineComponent({
  components: { ControlPanelShapes, ControlPanelProperties },

  props: {
    // posible values
    // ['none', 'default', 'other-slot-values' from aditionalPanels memebrs]
    activeSlot: { type: String, default: 'none' },

    additionalPanels: {
      type: Array as PropType<AdditionalPanel[]>,
      default: () => []
    }
  },

  data() {
    return {
      tab: 'properties'
    }
  },

  computed: {
    active() {
      if (this.activeSlot == 'default') {
        return true
      } else {
        return !!this.additionalPanels.find((item) => item.slot == this.activeSlot)
      }
    },

    width() {
      if (this.activeSlot == 'default') {
        return 400
      } else {
        let panel = this.additionalPanels?.find((item) => item.slot == this.activeSlot)

        return panel ? panel.width : 400
      }
    }
  }
})
</script>
