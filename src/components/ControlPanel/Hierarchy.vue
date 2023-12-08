<template>
  <v-list :key="key">
    <v-list-item
      @click="activeItem(item as HierarchyItem)"
      v-for="(item, i) in hierarchyStore.data"
      :key="i"
      :value="item"
      :active="item.id == selected?.id"
    >
      <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
      <v-list-item-title v-text="item.name || item.id" />

      <template v-slot:append>
        <!-- @vue-skip -->
        <v-btn size="small" variant="text" icon="mdi-close" @click="onRemoveItem(item)" />
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { HierarchyItem } from '@/model/hierarchy.model'
import { useDiagramStore } from '@/stores/diagram'
import { watch } from 'vue'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const diagramStore = useDiagramStore()
const key = ref(new Date().getTime())
const selected = ref<HierarchyItem | null>(null)

const emit = defineEmits<{ (event: 'selected', item: HierarchyItem | null): void }>()
const hierarchyStore = computed(() => diagramStore.hierarchyStore)

onMounted(() => {
  diagramStore.hierarchyStore.addEvent('add', onItemAdded)
  diagramStore.hierarchyStore.addEvent('remove', generateNewKey)
  diagramStore.hierarchyStore.addEvent('select', activeItem)
})

onBeforeUnmount(() => {
  diagramStore.hierarchyStore.removeEvent('add', onItemAdded)
  diagramStore.hierarchyStore.removeEvent('remove', generateNewKey)
  diagramStore.hierarchyStore.removeEvent('select', activeItem)
})

watch(
  () => selected.value,
  (value) => {
    emit('selected', value as any)
  },
  { immediate: true, deep: true }
)

function generateNewKey() {
  key.value = new Date().getTime()
}

function activeItem(item: HierarchyItem | undefined | null) {
  if (!item) return

  selected.value = item
  diagramStore.hierarchyStore.activeItem(item)
  key.value = new Date().getTime()
}

function onItemAdded(item: HierarchyItem) {
  generateNewKey()
  activeItem(item)
}

function onRemoveItem(item: HierarchyItem) {
  diagramStore.graph.removeCells([item.element])
  diagramStore.hierarchyStore.remove(item.id)

  if (selected.value?.id == item.id) {
    selected.value = null
  }
}
</script>
