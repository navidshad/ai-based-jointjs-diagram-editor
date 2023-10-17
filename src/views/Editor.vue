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

<script setup lang="ts">
import { inject, ref, computed } from 'vue'
import DiagramCanvas from '@/components/DiagramCanvas.vue'
import ActionHeaderComponent from '@/components/ActionHeader.vue'
import ControlPanelComponent from '@/components/ControlPanel.vue'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()
const bodySize = inject<{ width: number; height: number }>('bodySize')

const activePanel = ref<'default' | 'tests-panel' | 'none'>('none')

const isDefaultPanelShown = computed(() => {
  return activePanel.value == 'default'
})

function togglePanel(type: string) {
  if (activePanel.value == type) activePanel.value = 'none'
  else {
    activePanel.value = type as any
  }
}
</script>

<style>
.rounded-none {
  border-radius: 0 !important;
}
</style>
