export const simplifiedCellsCSVSchema = `
1. Header Row Description:
   - title: A text string representing the name or title of an item.
   - color: A string in hexadecimal format representing a color (e.g., "#FFFFFF").
   - position.x: A numerical value representing the X-coordinate in a 2D space.
   - position.y: A numerical value representing the Y-coordinate in a 2D space.
   - connections: A list of strings, each representing a connection or link to another item.
   - groups: A list of strings, each representing a group or category that the item belongs to.

2. Data Type Specifications:
   - title (string): Plain text, no special format.
   - color (hex string): Must follow the standard hex color code format, starting with '#' followed by 6 hexadecimal digits.
   - position.x (number) and position.y (number): Integer or floating-point numbers.
   - connections (string array): Semicolon-separated values in one field, e.g., "item1;item2;item3". Each value is a plain text string.
    - groups (string array): Semicolon-separated values in one field, e.g., "group1;group2;group3". Each value is a plain text string.

3. Example Data Entry:
   - Gadget Pro, #00FF77, 102, 305, ConnectorA;ConnectorB;ConnectorC, GroupA;GroupB;GroupC

4. Instructions for GPT-4:
   - Title: Interpret as a simple text string.
   - Color: Validate as a hex color code. Optionally, translate hex codes into color names or descriptions.
   - Position Coordinates: Treat as numerical values. They can be used for plotting on a graph or map, or for any spatial calculations.
   - Connections: Split the string by semicolons to get an array of connections. Each connection can be treated as an identifier for another item or entity.
    - Groups: Split the string by semicolons to get an array of groups. Each group can be treated as an identifier for a category or classification.

5. Validation Rules:
   - Ensure that the color field matches the hex color pattern.
   - Check that position.x and position.y are valid numeric values.
   - Verify that the connections field correctly splits into an array of strings.
   - Verify that the groups field correctly splits into an array of strings.
`
function cleanString(str: string) {
  const list = ['"', '/', '\\', '\n', '\r']

  for (const item of list) {
    str = str.replace(item, '')
  }

  return str
}

export function parseCSV(csv: string) {
  const lines = csv.split('\n')
  const header = lines[0].split(',')
  const data = lines.slice(1).map((line) => line.split(','))
  const result = data.map((row) => {
    const obj: Record<string, string> = {}
    row.forEach((value, index) => {
      value = cleanString(value)
      header[index] = cleanString(header[index])

      obj[header[index].trim()] = value.trim()
    })
    return obj
  })

  console.log('CSV map', result)

  return result
}

export function mapCSVToSimplified(csv: string) {
  const data = parseCSV(csv)
  const columns = ['title', 'position.x', 'position.y']
  const cells = []

  for (let index = 0; index < data.length; index++) {
    const row = data[index]

    const connections = row.connections
      ? row.connections.split(';').map((connection) => connection.trim())
      : []

    // if has all columns
    const rowKeys = Object.keys(row)
    const hasAll = columns.every((column) => rowKeys.includes(column))
    if (!hasAll) {
      debugger
      continue
    }

    cells.push({
      title: row.title,
      color: row.color || '',
      position: {
        x: Number(row['position.x']),
        y: Number(row['position.y'])
      },
      connections
    })
  }

  return { cells }
}
