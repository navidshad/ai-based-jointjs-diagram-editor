<template>
  <splitter-component :sizes="[80, 20]">
    <template #first="{ width, height }">
      <!-- DIAGRAM CANVAS
  -->
      <diagram-canvas :width="width" :height="height" />

      <!-- ACTIONBAR
  -->

      <action-header-component class="w-full absolute left-0 top-0 z-10" />
    </template>

    <template #second="{ height }">
      <!-- CONTROL PANEL DRAWER
  -->
      <control-panel-component :activeSlot="activePanel" :style="{ height: height + 'px' }" />
    </template>
  </splitter-component>

  <!-- MENU TOGGLES
   -->
  <!-- <teleport to="#diagram-panel-toggle">
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
  </teleport> -->
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import DiagramCanvas from '@/components/DiagramCanvas.vue'
import ActionHeaderComponent from '@/components/ActionHeader.vue'
import ControlPanelComponent from '@/components/ControlPanel/ControlPanel.vue'
import SplitterComponent from '@/components/layout/SplitterView.vue'

const bodySize = inject<{ width: number; height: number }>('bodySize')

const activePanel = ref(true)
</script>

<style>
.rounded-none {
  border-radius: 0 !important;
}
</style>
