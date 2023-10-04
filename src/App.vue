<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { provide } from 'vue'

const main = ref<Element | null>(null)
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
  <section class="w-screen h-screen" ref="main">
    <v-layout>
      <v-main>
        <RouterView />
      </v-main>
    </v-layout>
  </section>
</template>
