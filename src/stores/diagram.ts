import { ref } from 'vue'
import { defineStore } from 'pinia'

import type { Diagram } from '@/types/general'

import { HierarchyStore } from '@/services/hierarchy-store.service'

export const useDiagramStore = defineStore('diagram', () => {
  const diagramData = ref<Diagram>({ cells: [] })
  const hierarchyStore = new HierarchyStore()

  function inserDiagramData(data: Diagram) {
    diagramData.value = data
  }

  return {
    diagramData,

    hierarchyStore,

    inserDiagramData
  }
})
