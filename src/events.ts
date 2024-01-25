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
    //
    // Event: Graph
    // Description: receive diagram data from iframe and insert it into the store.
    //
    if (eventData.type === 'graph') {
      const { payload } = eventData as GraphEvent
      const diagramData = typeof payload == 'string' ? JSON.parse(payload) : payload
      useDiagramStore().insertDiagramData(diagramData)
    }
    //
    // Event: Settings
    // Description: receive settings data from iframe and insert it into the store.
    //
    else if (eventData.type === 'settings') {
      const settingsEvent = eventData as SettingsEvent
      useConfigStore().insertSettings(settingsEvent.payload)
    }
  } catch (e) {
    console.error('Error while parsing event data', e)
  }
}
