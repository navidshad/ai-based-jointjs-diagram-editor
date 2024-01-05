<template>
  <div v-bind="$attrs" class="action-header">
    <div class="action-group">
      <v-btn icon="m" color="white" size="x-small" @click="resetPan">
        <v-icon size="15" icon="mdi-eye-refresh" />

        <v-tooltip location="bottom" activator="parent">
          <span>Reset Viewport</span>
        </v-tooltip>
      </v-btn>

      <v-btn icon="m" color="white" size="x-small" @click="save">
        <v-icon size="15" icon="mdi-content-save" />

        <v-tooltip location="bottom" activator="parent">
          <span>Submit diagram in final JSON</span>
        </v-tooltip>
      </v-btn>

      <v-btn icon="m" color="white" size="x-small" @click="jsonView = true">
        <v-icon size="15" icon="mdi-code-json" />

        <v-tooltip location="bottom" activator="parent">
          <span>Json view</span>
        </v-tooltip>
      </v-btn>
    </div>

    <!-- 
      Transform actions
     -->
    <div class="action-group">
      <v-slider v-model="zoom" class="w-48" :max="3" :min="0.1" />
    </div>

    <!-- 
      CONTROL PANEL TOGGLE
     -->
    <div class="action-group" id="diagram-panel-toggle" />
  </div>

  <v-dialog v-model="jsonView" persistent>
    <json-view-component @close="jsonView = false" />
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import JsonViewComponent from './JsonView.vue'
import { useConfigStore } from '@/stores/config'
import { useDiagramStore } from '@/stores/diagram'
import { watch } from 'vue'
import { onMounted } from 'vue'

const configStore = useConfigStore()
const diagramStore = useDiagramStore()
const jsonView = ref(false)

function save() {
  configStore.updateParentWindowWithGraph(diagramStore.graph.toJSON())
}

function resetPan() {
  diagramStore.paper.value.translate(0, 0)
  diagramStore.paper.value.scale(1)
}

const zoom = ref(1)
watch(
  () => zoom.value,
  (val) => {
    diagramStore.paper.value.scale(val)
  }
)

onMounted(() => {
  zoom.value = diagramStore.paper.value.scale().sx
})
</script>

<style lang="scss" scoped>
.action-header {
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-items: center;
}

.action-group {
  display: flex;
  justify-content: space-between;
  justify-items: center;
  align-content: center;
  align-items: center;
  margin: 0px 10px;

  button {
    margin: 0 3px;
  }
}
</style>
