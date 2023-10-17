<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { provide } from 'vue'

const main = ref<any | null>(null)
const bodySize = ref({ width: 0, height: 0 })

const bodySizeObserver = new ResizeObserver(() => {
  bodySize.value.width = main.value?.clientWidth || 0
  bodySize.value.height = main.value?.clientHeight || 0
})

onMounted(() => {
  bodySizeObserver.observe(main.value!)
})

provide('bodySize', bodySize)
</script>

<template>
  <section ref="main">
    <v-layout>
      <v-main class="w-screen h-screen">
        <RouterView />
      </v-main>
    </v-layout>
  </section>
</template>
