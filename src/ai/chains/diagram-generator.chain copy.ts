import { LLMChain } from 'langchain/chains'
import { ChatPromptTemplate } from 'langchain/prompts'
import { gpt4Model } from '../llms/openai.llm'
import { simplifiedCellsSchema, type SimplifiedCellsType } from '@/ai/schema/schemas'
import zodToJsonSchema from 'zod-to-json-schema'
import { dia, shapes } from 'jointjs'

const chatTemplate = ChatPromptTemplate.fromMessages([
  [
    'system',
    `
      You able to assume diagram based the given description, 
      and return the node title, position, and connections according to the given schema.

      Consideration:
        1. connect each node with next or prevues node only.
    `
  ],
  ['user', 'Description:{diagram_description}'],
  ['user', 'Schema:{schema}'],
  ['system', 'JSON result is:']
])

export const manipulationChain = new LLMChain({ llm: gpt4Model, prompt: chatTemplate })

function extractJson(text: string): { [key: string]: any } {
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

function mapSimplifiedCellsSchemaToJointJs(data: SimplifiedCellsType) {
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

export function generateDiagram(description: string) {
  return manipulationChain
    .invoke({
      diagram_description: description,
      schema: JSON.stringify(zodToJsonSchema(simplifiedCellsSchema))
    })
    .then(({ text }) => extractJson(text) as SimplifiedCellsType)
    .then((data) => mapSimplifiedCellsSchemaToJointJs(data))
}
