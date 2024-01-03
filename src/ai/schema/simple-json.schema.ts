import { shapes, type dia } from 'jointjs'
import { z } from 'zod'
import { getCellsBoundary } from '../helpers/jointjs'

export type SimplifiedCellsType = {
  cells: Array<{
    title: string
    color: string
    position: {
      x: number
      y: number
    }
    connections: string[]
    groups: string[]
  }>
}

export type CellGroupType = {
  cells: Array<dia.Cell>
  title: string
}

export const simplifiedCellsSchema = z.object({
  cells: z
    .array(
      z.object({
        title: z.string().describe('Title of the cell.'),
        color: z.string().optional().describe('Color of the cell.'),
        position: z
          .object({
            x: z.number(),
            y: z.number()
          })
          .describe('Position of the cell, consider 200 units gap'),
        connections: z.array(
          z.string().describe('Other cell titles that this cell is connected to.')
        ),
        groups: z.array(z.string().describe('Any group that this cell is grouped with.'))
      })
    )
    .describe('Array of cells.')
})

// This function maps the jointjs cells to a simplified schema
// This schema is used to for ai related functions
export function mapJointJsToSimplifiedCellsSchema(cells: Array<dia.Cell>) {
  const simplifiedCells: SimplifiedCellsType = {
    cells: []
  }

  cells.forEach((cell) => {
    const isGroup = cell.attr('data/type') === 'group'

    if (cell.isElement() && !isGroup) {
      const position = cell.position()
      const title = cell.attr('label/text')

      simplifiedCells.cells.push({
        title,
        color: cell.attr('body/fill'),
        position: {
          x: position.x,
          y: position.y
        },
        connections: [],
        groups: cell.attr('data/groups') || []
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
        fill: simpleCell.color || '#2ECC71',
        fillOpacity: 0.5
      },
      label: {
        text: simpleCell.title,
        fill: '#000000'
      },
      data: {
        groups: simpleCell.groups
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

export function extractAndCreateGroups(cells: Array<dia.Cell>) {
  const groups: Array<CellGroupType> = []

  // Retrieve groups
  cells.forEach((cell) => {
    const cellGroups = cell.attr('data/groups')
    if (cellGroups) {
      cellGroups.forEach((groupTitle: string) => {
        const groupCells = groups.find((group) => group.title === groupTitle)
        if (groupCells) {
          groupCells.cells.push(cell)
        } else {
          groups.push({
            title: groupTitle,
            cells: [cell]
          })
        }
      })
    }
  })

  // Create groups
  groups.forEach((group) => {
    const boundary = getCellsBoundary(group.cells, 10)
    const rect = new shapes.standard.Rectangle()

    rect.position(boundary.x, boundary.y)
    rect.resize(boundary.width, boundary.height)

    rect.attr({
      body: {
        // fill: 'white',
        stroke: 'gray', // Color of the border
        strokeWidth: 2, // Width of the border
        strokeDasharray: '8,10' // Dash pattern (10px dash, 5px space)
      },
      label: {
        text: group.title,
        // fill: '#000000',
        textVerticalAnchor: 'top', // Aligns the text at the top of the label box
        textAnchor: 'middle', // Center aligns the text horizontally
        refY: '100%', // Positions the label box just below the rectangle
        refY2: 10 // Additional offset from the bottom of the rectangle
      },
      data: {
        type: 'group'
      }
    })

    if (group.cells.length > 1) {
      cells = [rect, ...cells]
    }
  })

  return { cells }
}
