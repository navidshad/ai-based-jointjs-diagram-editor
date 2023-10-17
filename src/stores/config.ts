import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { GraphEvent, Settings } from '@/types/ifram-events'
import { canvas } from '@/services/canvas.service'
import type { Diagram } from '@/types/general'
import { clone } from '@/helpers/object'

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
  function updateParentWindowWithGraph(data: GraphEvent['payload']) {
    const event: GraphEvent = { type: 'graph', payload: clone(data) }
    window.parent.postMessage(event, '*')
  }

  function inserDiagramData(data: Diagram) {
    diagramData.value = data
  }

  function insertSettins(settingsData: Settings) {
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
