import type { dia } from 'jointjs'

export function getCellsBoundary(cells: dia.Cell[], padding: number = 10) {
  const boundary = {
    width: 0,
    height: 0,
    x: 0,
    y: 0
  }

  function getMin(cells: dia.Cell[], axis: 'x' | 'y') {
    return Math.min(...cells.map((cell) => cell.position()[axis])) - padding
  }

  function getMax(cells: dia.Cell[], axis: 'x' | 'y') {
    return (
      Math.max(
        ...cells.map(
          (cell) => cell.position()[axis] + cell.getBBox()[axis === 'x' ? 'width' : 'height']
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
