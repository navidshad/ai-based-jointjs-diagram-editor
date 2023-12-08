import { useConfigStore } from './stores/config'
import { useDiagramStore } from './stores/diagram'
import type { GraphEvent, SettingsEvent } from './types/iframe-events'

//
// Events
//
window.onmessage = (event) => {
  const eventData = event.data

  // check if source and target is the same window
  if (event.source === window) return

  try {
    if (eventData.type === 'graph') {
      const { payload } = eventData as GraphEvent
      const diagramData = typeof payload == 'string' ? JSON.parse(payload) : payload
      useDiagramStore().insertDiagramData(diagramData)
    } else if (eventData.type === 'settings') {
      const settingsEvent = eventData as SettingsEvent
      useConfigStore().insertSettings(settingsEvent.payload)
    }
  } catch (e) {
    console.error('Error while parsing event data', e)
  }
}
