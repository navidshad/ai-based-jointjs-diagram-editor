import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { GraphEvent, Settings } from '@/types/iframe-events'
import { clone } from '@/helpers/object'

export const useConfigStore = defineStore('config', () => {
  const settings = ref<Settings>({
    update_per_change: false,
    toggle_control_panel: true
  })

  const ignoreNextChangeToUpdatePerChange = ref(false)

  const updatePerChange = computed({
    get: () => settings.value.update_per_change || false,
    set: (value: boolean) => (settings.value.update_per_change = value)
  })

  // This value changes when the settings change.
  const configKey = computed(() => window.btoa(JSON.stringify(settings.value)))

  //
  // Methods
  //
  function updateParentWindowWithGraph(data: GraphEvent['payload']) {
    if (ignoreNextChangeToUpdatePerChange.value) {
      ignoreNextChangeToUpdatePerChange.value = false
      return
    }

    const event: GraphEvent = { type: 'graph', payload: clone(data) }
    window.parent.postMessage(event, '*')
  }

  function insertSettings(settingsData: Settings) {
    for (const key in settingsData) {
      if (key in settings.value) {
        settings.value[key as keyof Settings] = settingsData[key as keyof Settings]
      }
    }
  }

  function updateParentWindowWithReadySignal() {
    const event = { type: 'ready' }
    window.parent.postMessage(event, '*')
  }

  return {
    settings,
    configKey,
    updatePerChange,
    ignoreNextChangeToUpdatePerChange,

    updateParentWindowWithGraph,
    updateParentWindowWithReadySignal,
    insertSettings
  }
})
