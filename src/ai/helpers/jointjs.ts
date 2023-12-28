import { shapes, type dia } from 'jointjs'
import type { SimplifiedCellsType } from '../schema/schemas'

// This function maps the jointjs cells to a simplified schema
// This schema is used to for ai related functions
export function mapJointJsToSimplifiedCellsSchema(cells: Array<dia.Cell>) {
  const simplifiedCells: SimplifiedCellsType = {
    cells: []
  }

  cells.forEach((cell) => {
    if (cell.isElement()) {
      const position = cell.position()
      const title = cell.attr('label/text')

      simplifiedCells.cells.push({
        title,
        position: {
          x: position.x,
          y: position.y
        },
        connections: []
      })
    }
  })

  cells.forEach((cell) => {
    if (cell.isLink()) {
      const source = cell.getSourceElement()
      const target = cell.getTargetElement()

      if (source && target) {
        const sourceTitle = source.attr('label/text')
        const targetTitle = target.attr('label/text')

        const sourceCell = simplifiedCells.cells.find(
          (simpleCell) => simpleCell.title === sourceTitle
        )
        const targetCell = simplifiedCells.cells.find(
          (simpleCell) => simpleCell.title === targetTitle
        )

        if (sourceCell && targetCell) {
          sourceCell.connections.push(targetCell.title)
        }
      }
    }
  })

  return simplifiedCells
}

// This function maps the simplified schema to jointjs cells
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
