<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, onMounted, inject } from 'vue'

const main = ref<HTMLElement>()
const bodySize = ref({ width: 0, height: 0 })

const bodySizeObserver = new ResizeObserver(() => {
  bodySize.value.width = main.value?.clientWidth || 0
  bodySize.value.height = main.value?.clientHeight || 0
})

onMounted(() => {
  bodySizeObserver.observe(main.value!)
})

inject('bodySize', bodySize)
</script>

<template>
  <section ref="main">
    <v-layout>
      <RouterView />
    </v-layout>
  </section>
</template>
