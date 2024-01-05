import { shapes, type dia } from 'jointjs'
import { z } from 'zod'
import { getCellsBoundary, normalizeCellsGap } from '../helpers/jointjs'
import { selectBestMatchingIcon } from '../helpers/icon-selector'

export type SimplifiedCellType = {
  title: string
  color: string
  position: {
    x: number
    y: number
  }
  connections: string[]
  groups: string[]
}

export type SimplifiedCellsType = {
  cells: Array<SimplifiedCellType>
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
    const isGroup = cell.prop('data/type') === 'group'

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
  let cells: Array<dia.Element> = []

  // Create cells
  data.cells.forEach((simpleCell) => {
    const icon = selectBestMatchingIcon(simpleCell.title)

    if (icon.length) {
      const image = createImageFromSimplifiedCell(simpleCell, icon)
      cells.push(image)
    } else {
      const cell = createRectangleFromSimplifiedCell(simpleCell)
      cells.push(cell)
    }
  })

  // get sure all cells have at least 150 unit gap
  cells = normalizeCellsGap(cells, 150)

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
    const boundary = getCellsBoundary(group.cells, 30)
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
      }
    })

    rect.prop('data', {
      type: 'group',
      noneConnectable: true
    })

    if (group.cells.length > 1) {
      cells = [rect, ...cells]
    }
  })

  return { cells }
}

function createRectangleFromSimplifiedCell(cell: SimplifiedCellType) {
  const rect = new shapes.standard.Rectangle()

  rect.position(cell.position.x, cell.position.y)
  rect.resize(100, 100)
  rect.attr({
    body: {
      fill: cell.color || '#2ECC71',
      fillOpacity: 0.5
    },
    label: {
      text: cell.title,
      fill: '#000000',
      textWrap: {
        width: -10, // Negative value for padding from the rectangle's width
        height: 'auto', // 'auto' to automatically adjust height
        ellipsis: true // Add an ellipsis if the text is too long
      },
      textVerticalAnchor: 'middle', // Vertically center the text
      textAnchor: 'middle', // Horizontally center the text
      refX: '50%', // Center with respect to the rectangle's width
      refY: '50%' // Center with respect to the rectangle's height
    },
    data: {
      groups: cell.groups
    }
  })

  return rect
}

function createImageFromSimplifiedCell(cell: SimplifiedCellType, icon: string) {
  const image = new shapes.standard.Image()

  image.position(cell.position.x, cell.position.y)
  image.resize(100, 100)
  image.attr({
    image: {
      xlinkHref: icon
    },
    label: {
      text: cell.title,
      fill: '#000000',
      textWrap: {
        width: -10, // Negative value for padding from the rectangle's width
        height: 'auto', // 'auto' to automatically adjust height
        ellipsis: true // Add an ellipsis if the text is too long
      }
    },
    data: {
      groups: cell.groups
    }
  })

  return image
}
