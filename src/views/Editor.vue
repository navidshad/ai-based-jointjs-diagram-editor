<template>
  <splitter-component :sizes="sizes">
    <template #first="{ width, height }">
      <!-- DIAGRAM CANVAS
  -->
      <diagram-canvas :width="width" :height="height" />

      <!-- ACTION BAR
  -->

      <action-header-component
        class="w-full absolute left-0 top-0 z-10"
        :style="{ width: width + 'px' }"
      />
    </template>

    <template #second="{ width }">
      <!-- CONTROL PANEL DRAWER
  -->
      <control-panel-component :width="width" />
    </template>
  </splitter-component>
</template>

<script setup lang="ts">
import DiagramCanvas from '@/components/DiagramCanvas.vue'
import ActionHeaderComponent from '@/components/ActionHeader.vue'
import ControlPanelComponent from '@/components/ControlPanel/ControlPanel.vue'
import SplitterComponent from '@/components/layout/SplitterView.vue'
import { useConfigStore } from '@/stores/config'
import { ref, watch } from 'vue'

const configStore = useConfigStore()

const sizes = ref([70, 30])
watch(
  () => configStore.settings.toggle_control_panel,
  (val) => {
    if (val == true) {
      sizes.value = [70, 30]
    } else {
      sizes.value = [100, 0]
    }
  }
)
</script>

<style>
.rounded-none {
  border-radius: 0 !important;
}
</style>
