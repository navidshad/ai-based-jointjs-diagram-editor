<template>
  <div class="split h-full">
    <div id="split-0" class="overflow-y-scroll h-full">
      <hierarchy @selected="selected = $event" />
    </div>
    <div id="split-1" class="overflow-y-scroll h-full">
      <ElementProperties :item="selected as any" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Split from 'split.js'
import Hierarchy from './Hierarchy.vue'
import ElementProperties from './ElementProperties.vue'
import { onMounted, ref } from 'vue'
import type { HierarchyItem } from '@/model/hierarchy.model'

const selected = ref<HierarchyItem | null>(null)

onMounted(() => {
  Split(['#split-0', '#split-1'], {
    direction: 'vertical',
    sizes: [20, 80]
  })
})
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
