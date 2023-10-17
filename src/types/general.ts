import { dia } from 'jointjs'

export interface CustomElementView extends dia.ElementView {
  id: string
  model: dia.Element
}

export interface Diagram {
  cells: dia.Cell[]
}
