import { useConfigStore } from './stores/config'
import type { GraphEvent, SettingsEvent } from './types/ifram-events'

//
// Events
//
window.onmessage = (event) => {
  const eventData = event.data
  const store = useConfigStore()

  try {
    if (eventData.type === 'graph') {
      const { payload } = eventData as GraphEvent
      const diagramData = typeof payload == 'string' ? JSON.parse(payload) : payload
      store.inserDiagramData(diagramData)
    } else if (eventData.type === 'settings') {
      const settingsEvent = eventData as SettingsEvent
      store.insertSettins(settingsEvent.payload)
    }
  } catch (e) {
    console.error('Error while parsing event data', e)
  }
}
