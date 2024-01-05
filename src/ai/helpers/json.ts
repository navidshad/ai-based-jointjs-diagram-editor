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
