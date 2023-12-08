<template>
  <!-- DIAGRAM CANVAS
  -->
  <diagram-canvas :width="bodySize?.width" :height="bodySize?.height" />

  <!-- ACTIONBAR
  -->

  <action-header-component
    class="w-full absolute left-0 top-0 z-10"
    @save="configStore.updateParentWindowWithGraph"
  />

  <!-- MENU TOGGLES
   -->
  <teleport to="#diagram-panel-toggle">
    <v-btn
      class="rounded-sm"
      variant="flat"
      icon="m"
      size="small"
      :color="activePanel ? 'blue' : 'blue-grey-lighten-5'"
      @click="activePanel = !activePanel"
    >
      <v-icon
        size="15"
        :icon="!activePanel ? 'mdi-table-cog' : 'mdi-close'"
        :color="!activePanel ? 'black' : 'white'"
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

<script setup lang="ts">
import { inject, ref } from 'vue'
import DiagramCanvas from '@/components/DiagramCanvas.vue'
import ActionHeaderComponent from '@/components/ActionHeader.vue'
import ControlPanelComponent from '@/components/ControlPanel/ControlPanel.vue'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()
const bodySize = inject<{ width: number; height: number }>('bodySize')

const activePanel = ref(true)
</script>

<style>
.rounded-none {
  border-radius: 0 !important;
}
</style>
