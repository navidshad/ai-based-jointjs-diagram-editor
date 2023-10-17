import { useConfigStore } from './stores/config'
import { useDiagramStore } from './stores/diagram'
import type { GraphEvent, SettingsEvent } from './types/ifram-events'

//
// Events
//
window.onmessage = (event) => {
  const eventData = event.data

  try {
    if (eventData.type === 'graph') {
      const { payload } = eventData as GraphEvent
      const diagramData = typeof payload == 'string' ? JSON.parse(payload) : payload
      useDiagramStore().inserDiagramData(diagramData)
    } else if (eventData.type === 'settings') {
      const settingsEvent = eventData as SettingsEvent
      useConfigStore().insertSettins(settingsEvent.payload)
    }
  } catch (e) {
    console.error('Error while parsing event data', e)
  }
}
