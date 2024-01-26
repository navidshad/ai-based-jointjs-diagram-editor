import { useConfigStore } from './stores/config'
import { useDiagramStore } from './stores/diagram'
import type { GraphEvent, SettingsEvent } from './types/iframe-events'

export function registerGlobalEvents() {
  window.onmessage = (event) => {
    const eventData = event.data

    const configStore = useConfigStore()
    const diagramStore = useDiagramStore()

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
        configStore.ignoreNextChangeToUpdatePerChange = true
        diagramStore.insertDiagramData(diagramData)
      }
      //
      // Event: Settings
      // Description: receive settings data from iframe and insert it into the store.
      //
      else if (eventData.type === 'settings') {
        const settingsEvent = eventData as SettingsEvent
        configStore.insertSettings(settingsEvent.payload)
      }
    } catch (e) {
      console.error('Error while parsing event data', e)
    }
  }
}

export function registerGlobalEmits() {
  const configStore = useConfigStore()
  const diagramStore = useDiagramStore()

  diagramStore.hierarchyStore.addEvent('add', (item) => {
    if (!item) return
    const element = JSON.stringify(item.element.toJSON())
    configStore.updateParentWindowWithElementTransaction('add', element)
  })

  diagramStore.hierarchyStore.addEvent('remove', (item) => {
    if (!item) return
    const element = JSON.stringify(item.element.toJSON())
    configStore.updateParentWindowWithElementTransaction('remove', element)
  })

  diagramStore.hierarchyStore.addEvent('select', (item) => {
    if (!item) return
    const element = JSON.stringify(item.element.toJSON())
    configStore.updateParentWindowWithElementTransaction('select', element)
  })
}
