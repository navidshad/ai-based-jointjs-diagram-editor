<template>
  <div class="split h-full">
    <div id="split-0" class="overflow-y-scroll h-full">
      <div class="flex justify-end border-b-2 border-t-2 fixed bottom-0 p-2 w-full bg-white z-10">
        <v-btn variant="outlined" density="compact" id="add-custom-image" icon>
          <v-icon :size="16">mdi-image-plus-outline</v-icon>
          <add-custom-image-form activator="#add-custom-image" />
          <v-tooltip location="top center" activator="parent">
            <span>Add Custom Image</span>
          </v-tooltip>
        </v-btn>
      </div>
      <div class="mb-10">
        <hierarchy @selected="onElementSelected" />
      </div>
    </div>

    <div id="split-1" class="overflow-y-scroll h-full relative">
      <!-- @vue-skip -->
      <ElementProperties v-if="selected != null" :itemId="selected" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Split from 'split.js'
import Hierarchy from './ControlPanelPropertiesHierarchy.vue'
import ElementProperties from './ControlPanelPropertiesElementProperties.vue'
import { onMounted, ref } from 'vue'
import AddCustomImageForm from '@/components/ControlPanel/AddCustomImageForm.vue'

const selected = ref<string | null>(null)

onMounted(() => {
  Split(['#split-0', '#split-1'], {
    direction: 'vertical',
    sizes: [30, 70]
  })
})

function onElementSelected(id: string | null | undefined) {
  selected.value = id || null
}
</script>

<style>
.gutter {
  background-color: #eee;
  background-repeat: no-repeat;
  background-position: 50%;
}

.gutter.gutter-vertical {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
  cursor: row-resize;
}
</style>
