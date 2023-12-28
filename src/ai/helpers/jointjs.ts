import { shapes, type dia } from 'jointjs'
import type { SimplifiedCellsType } from '../schema/schemas'

export function mapSimplifiedCellsSchemaToJointJs(data: SimplifiedCellsType) {
  const cells: Array<dia.Cell> = []

  // Create cells
  data.cells.forEach((simpleCell) => {
    const cell = new shapes.standard.Rectangle()

    cell.position(simpleCell.position.x, simpleCell.position.y)
    cell.resize(100, 100)
    cell.attr({
      body: {
        fill: '#2ECC71',
        fillOpacity: 0.5
      },
      label: {
        text: simpleCell.title,
        fill: '#000000'
      }
    })

    cells.push(cell)
  })

  // create links
  data.cells.forEach((simpleCell) => {
    simpleCell.connections.forEach((connection) => {
      const sourceCell = cells.find((cell) => cell.attr('label/text') === simpleCell.title)
      const targetCell = cells.find((cell) => cell.attr('label/text') === connection)

      if (sourceCell && targetCell) {
        const link = new shapes.standard.Link()
        link.source(sourceCell)
        link.target(targetCell)
        cells.push(link)
      }
    })
  })

  return { cells }
}
