<template>
  <section class="overflow-y-auto bg-white h-screen">
    <v-tabs v-model="tab" fixed-tabs>
      <v-tab value="properties">Properties</v-tab>
      <v-tab value="primitives">Primitives</v-tab>
      <v-tab value="shapes">Shapes</v-tab>
      <v-tab value="ai">AI</v-tab>
    </v-tabs>

    <v-window class="flex-1 h-full" v-model="tab">
      <v-window-item value="shapes" class="h-full overflow-y-scroll">
        <control-panel-shapes />
      </v-window-item>

      <v-window-item value="primitives" class="h-full overflow-y-scroll">
        <control-panel-primitives />
      </v-window-item>

      <v-window-item value="properties" class="h-full">
        <control-panel-properties />
      </v-window-item>

      <v-window-item value="ai" class="h-full">
        <control-panel-ai />
      </v-window-item>
    </v-window>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { AdditionalPanel } from '@/model/additional-panel.model'
import ControlPanelProperties from './ControlPanelProperties.vue'
import ControlPanelShapes from './ControlPanelShapes.vue'
import ControlPanelPrimitives from './ControlPanelPrimitives.vue'
import ControlPanelAi from './ControlPanelAi.vue'

export default defineComponent({
  components: {
    ControlPanelShapes,
    ControlPanelProperties,
    ControlPanelPrimitives,
    ControlPanelAi
  },

  props: {
    // possible values
    // ['none', 'default', 'other-slot-values' from additionalPanels members]
    activeSlot: { type: Boolean, default: true },

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
    width() {
      return 400
    }
  }
})
</script>
