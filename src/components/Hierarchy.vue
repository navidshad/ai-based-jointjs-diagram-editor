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
      <v-list-item-title v-text="item.name" />
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { HierarchyItem } from '../model/hierarchy.model'
import { useDiagramStore } from '@/stores/diagram'

export default defineComponent({
  data(): { key: number; selected: HierarchyItem | null } {
    return {
      key: new Date().getTime(),
      selected: null
    }
  },

  setup() {
    return {
      diagramStore: useDiagramStore()
    }
  },

  computed: {
    hierarchyStore() {
      return this.diagramStore.hierarchyStore
    }
  },

  mounted() {
    this.diagramStore.hierarchyStore.addEvent('add', this.onItemAdded)
    this.diagramStore.hierarchyStore.addEvent('remove', this.generateNewKey)
    this.diagramStore.hierarchyStore.addEvent('select', this.activeItem)
  },

  beforeUnmount() {
    this.diagramStore.hierarchyStore.removeEvent('add', this.onItemAdded)
    this.diagramStore.hierarchyStore.removeEvent('remove', this.generateNewKey)
    this.diagramStore.hierarchyStore.removeEvent('select', this.activeItem)
  },

  methods: {
    generateNewKey() {
      this.key = new Date().getTime()
    },

    activeItem(item: HierarchyItem | undefined | null) {
      if (!item) return

      this.selected = item
      this.diagramStore.hierarchyStore.activeItem(item)
      this.key = new Date().getTime()
    },

    onItemAdded(item: HierarchyItem) {
      this.generateNewKey()
      this.activeItem(item)
    }
  }
})
</script>
