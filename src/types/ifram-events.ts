import type { dia } from 'jointjs'

// To send/receive Grapgh data between the app and the parent window.
export interface GraphEvent {
  type: 'graph'
  payload: { cells: dia.Cell[] }
}

// To receive settings from the parent window.
export interface SettingsEvent {
  type: 'settings'
  payload: Settings
}

export interface Settings {
  update_per_change: boolean
}
