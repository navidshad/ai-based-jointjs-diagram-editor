<template>
  <!-- DIAGRAM CANVAS
  -->
  <diagram-canvas :width="bodySize?.width" :height="bodySize?.height" />

  <!-- ACTIONBAR
  -->

  <action-header-component class="w-full absolute left-0 top-0 z-10" @save="save" />

  <!-- MENU TOGGLES
   -->
  <teleport to="#diagram-panel-toggle">
    <v-btn
      class="rounded-sm"
      variant="flat"
      icon="m"
      size="small"
      :color="isDefaultPanelShown ? 'blue' : 'blue-grey-lighten-5'"
      @click="togglePanel('default')"
    >
      <v-icon
        size="15"
        :icon="!isDefaultPanelShown ? 'mdi-table-cog' : 'mdi-close'"
        :color="!isDefaultPanelShown ? 'black' : 'white'"
      />
      <v-tooltip location="bottom" activator="parent">
        <span>Toggle control panel</span>
      </v-tooltip>
    </v-btn>
  </teleport>

  <!-- CONTROL PANEL DRAWER
  -->
  <control-panel-component :activeSlot="activePanel" />
</template>

<script lang="ts">
import DiagramCanvas from '@/components/DiagramCanvas.vue'
import ActionHeaderComponent from '@/components/ActionHeader.vue'
import ControlPanelComponent from '@/components/ControlPanel.vue'

import { canvas } from '../services/canvas.service'
import { HierarchyItem } from '../model/hierarchy.model'
import { defineComponent } from 'vue'
import { inject } from 'vue'

export default defineComponent({
  components: {
    DiagramCanvas,
    ActionHeaderComponent,
    ControlPanelComponent
  },

  setup() {
    return {
      bodySize: inject<{ width: number; height: number }>('bodySize')
    }
  },

  data() {
    return {
      controlPanelToggle: false,
      activePanel: 'none',
      graph_element: ''
    }
  },

  computed: {
    isDefaultPanelShown() {
      return this.activePanel == 'default'
    },

    isTestPanelShown() {
      return this.activePanel == 'tests-panel'
    }
  },

  watch: {
    bodySize: {
      deep: true,
      handler(value) {
        console.log('Body size changed')
      }
    }
  },

  mounted() {
    canvas.hierarchyStore.addEvent('select', this.onElementSelected)
    window.onmessage = this.onMessage
  },

  unmounted() {
    window.onmessage = null
    canvas.hierarchyStore.removeEvent('select', this.onElementSelected)
  },

  methods: {
    togglePanel(type: string) {
      if (this.activePanel == type) this.activePanel = 'none'
      else {
        this.activePanel = type
      }
    },

    save() {
      const data = canvas.graph.toJSON()
      window.parent.postMessage({ type: 'graph', payload: data }, '*')
    },

    onElementSelected(element: HierarchyItem) {
      this.graph_element = element.id
    },

    onMessage(event: MessageEvent) {
      const { type, payload } = event.data

      if (type == 'graph' && payload) {
        const diagram = typeof payload == 'string' ? JSON.parse(payload) : payload
        canvas.graph.fromJSON(diagram)
      }
    }
  }
})
</script>

<style>
.rounded-none {
  border-radius: 0 !important;
}
</style>
