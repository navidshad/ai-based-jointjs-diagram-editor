export function extractJson(text: string): { [key: string]: any } {
  // Extract json part of given text
  const jsonStart = text.indexOf('{')
  const jsonEnd = text.lastIndexOf('}')
  const json = text.substring(jsonStart, jsonEnd + 1)

  try {
    return JSON.parse(json) // simplifiedCellsSchema.parse(json)
  } catch (error) {
    console.error('Error parsing json', text)
    return {}
  }
}

export function extractCSV(text: string): string {
  const wrapper = ['```csv', '```']

  const start = text.indexOf(wrapper[0])
  const end = text.indexOf(wrapper[1], start + wrapper[0].length)

  if (start === -1 || end === -1) {
    return text
  }

  const extracted = text.substring(start + wrapper[0].length, end).trim()
  return extracted
}
