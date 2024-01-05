import type { dia } from 'jointjs'

export function getCellsBoundary(cells: dia.Element[], padding: number = 10) {
  const boundary = {
    width: 0,
    height: 0,
    x: 0,
    y: 0
  }

  function getMin(cells: dia.Cell[], axis: 'x' | 'y') {
    return Math.min(...cells.map((cell) => cell.getBBox()[axis])) - padding
  }

  function getMax(cells: dia.Cell[], axis: 'x' | 'y') {
    return (
      Math.max(
        ...cells.map(
          (cell) => cell.getBBox()[axis] + cell.getBBox()[axis === 'x' ? 'width' : 'height']
        )
      ) + padding
    )
  }

  boundary.x = getMin(cells, 'x')
  boundary.y = getMin(cells, 'y')
  boundary.width = getMax(cells, 'x') - boundary.x
  boundary.height = getMax(cells, 'y') - boundary.y

  return boundary
}

export function normalizeCellsGap(cells: dia.Element[], minGap: 150) {
  const boundary = getCellsBoundary(cells)
  const cellsWidth = boundary.width
  const cellsHeight = boundary.height

  const cellsGap = Math.min(cellsWidth, cellsHeight)

  if (cellsGap < minGap) {
    const ratio = minGap / cellsGap
    cells.forEach((cell) => {
      const position = cell.position()
      cell.position(position.x * ratio, position.y * ratio)
    })
  }

  return cells
}
