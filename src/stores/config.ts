import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { GraphEvent, SettingsEvent, Settings } from '@/types/ifram-events'
import { canvas } from '@/services/canvas.service'

export const useConfigStore = defineStore('config', () => {
  const settings = ref<Settings>({ update_per_change: false })

  const updatePerChange = computed({
    get: () => settings.value.update_per_change,
    set: (value: boolean) => (settings.value.update_per_change = value)
  })

  // This value changes when the settings change.
  const configKey = computed(() => window.btoa(JSON.stringify(settings.value)))

  //
  // Events
  //
  window.onmessage = (event) => {
    const eventData = event.data

    if (eventData.type === 'graph') {
      const { payload } = eventData as GraphEvent
      const diagram = typeof payload == 'string' ? JSON.parse(payload) : payload
      canvas.updateByJson(diagram)
    } else if (eventData.type === 'settings') {
      const settingsEvent = eventData as SettingsEvent
      settings.value = settingsEvent.payload
    }
  }

  //
  // Methods
  //
  function updateParentWindowWithGraph() {
    const data = canvas.graph.toJSON()
    const event: GraphEvent = { type: 'graph', payload: data }
    window.parent.postMessage(event, '*')
  }

  return {
    settings,
    configKey,
    updatePerChange,

    updateParentWindowWithGraph
  }
})
