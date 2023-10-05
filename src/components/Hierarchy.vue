<template>
  <v-list :key="key">
    <v-list-item
      @click="activeItem(item)"
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
import { canvas } from '../services/canvas.service'

export default defineComponent({
  data(): { key: number; selected: HierarchyItem | null } {
    return {
      key: new Date().getTime(),
      selected: null
    }
  },
  computed: {
    hierarchyStore() {
      return canvas.hierarchyStore
    }
  },

  mounted() {
    canvas.hierarchyStore.addEvent('add', this.onItemAdded)
    canvas.hierarchyStore.addEvent('remove', this.generateNewKey)
    canvas.hierarchyStore.addEvent('select', this.activeItem)
  },

  beforeUnmount() {
    canvas.hierarchyStore.removeEvent('add', this.onItemAdded)
    canvas.hierarchyStore.removeEvent('remove', this.generateNewKey)
    canvas.hierarchyStore.removeEvent('select', this.activeItem)
  },

  methods: {
    generateNewKey() {
      this.key = new Date().getTime()
    },

    activeItem(item: HierarchyItem | undefined | null) {
      if (!item) return

      this.selected = item
      canvas.hierarchyStore.activeItem(item)
      this.key = new Date().getTime()
    },

    onItemAdded(item: HierarchyItem) {
      this.generateNewKey()
      this.activeItem(item)
    }
  }
})
</script>
