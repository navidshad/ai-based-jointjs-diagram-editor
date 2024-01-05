<template>
  <v-list :key="key">
    <v-list-item
      @click="activeItem(item as HierarchyItem)"
      v-for="(item, i) in hierarchyStore.data"
      :key="i"
      :value="item"
      :active="item.id == selectedId"
    >
      <template v-if="item.isGroup" #prepend>
        <v-chip class="mr-1">Group</v-chip>
      </template>

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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const diagramStore = useDiagramStore()
const key = ref(new Date().getTime())
const selectedId = ref<string | null>(null)

const emit = defineEmits<{ (event: 'selected', itemId: string | null | undefined): void }>()
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

function generateNewKey() {
  key.value = new Date().getTime()
}

function activeItem(item: HierarchyItem | undefined | null) {
  if (!item) return

  selectedId.value = item.id
  emit('selected', item.id)
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

  if (selectedId.value == item.id) {
    selectedId.value = null
  }
}
</script>
