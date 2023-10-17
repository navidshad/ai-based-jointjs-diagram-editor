import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { GraphEvent, Settings } from '@/types/ifram-events'
import { canvas } from '@/services/canvas.service'
import type { Diagram } from '@/types/general'

export const useConfigStore = defineStore('config', () => {
  const settings = ref<Settings>({ update_per_change: false })
  const diagramData = ref<Diagram>({ cells: [] })

  const updatePerChange = computed({
    get: () => settings.value.update_per_change,
    set: (value: boolean) => (settings.value.update_per_change = value)
  })

  // This value changes when the settings change.
  const configKey = computed(() => window.btoa(JSON.stringify(settings.value)))

  //
  // Methods
  //
  function updateParentWindowWithGraph() {
    const data = canvas.graph.toJSON()
    const event: GraphEvent = { type: 'graph', payload: data }
    window.parent.postMessage(event, '*')
  }

  function inserDiagramData(data: Diagram) {
    console.log('inserDiagramData', data)
    diagramData.value = data
  }

  function insertSettins(settingsData: Settings) {
    console.log('insertSettins', settingsData)
    settings.value = settingsData
  }

  return {
    settings,
    diagramData,
    configKey,
    updatePerChange,

    updateParentWindowWithGraph,
    inserDiagramData,
    insertSettins
  }
})
