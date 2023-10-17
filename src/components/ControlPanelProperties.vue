<template>
  <div class="split h-full">
    <div id="split-0" class="overflow-y-scroll h-full">
      <hierarchy />
    </div>
    <div id="split-1" class="overflow-y-scroll h-full"></div>
  </div>
</template>

<script setup lang="ts">
import Split from 'split.js'
import Hierarchy from './Hierarchy.vue'
import { onMounted } from 'vue'

onMounted(() => {
  Split(['#split-0', '#split-1'], {
    direction: 'vertical'
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
