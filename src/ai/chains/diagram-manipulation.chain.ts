import { LLMChain } from 'langchain/chains'
import { ChatPromptTemplate } from 'langchain/prompts'
import { gpt4Model } from '../llms/openai.llm'

import { extractJson } from '../helpers/json'
import zodToJsonSchema from 'zod-to-json-schema'

import type { dia } from 'jointjs'

import {
  extractAndCreateGroups,
  mapJointJsToSimplifiedCellsSchema,
  mapSimplifiedCellsSchemaToJointJs,
  simplifiedCellsSchema,
  type SimplifiedCellsType
} from '../schema/simple-json.schema'

const chatTemplate = ChatPromptTemplate.fromMessages([
  [
    'system',
    `
      You able to change the diagram based the given description. 
      take the given change description and the cells array, 
      then manipulate the diagram based on the description according to the given schema.
    `
  ],
  ['user', 'This is the change description:{diagram_description}'],
  ['user', 'This is the cells array:{json_cells}'],
  ['user', 'Schema:{schema}'],
  ['system', 'JSON result is:']
])

export const manipulationChain = new LLMChain({ llm: gpt4Model, prompt: chatTemplate })

export function manipulateDiagram(
  description: string,
  cells: dia.Cell[],
  options: { selectIcon: boolean }
) {
  return manipulationChain
    .invoke({
      diagram_description: description,
      json_cells: JSON.stringify(mapJointJsToSimplifiedCellsSchema(cells)),
      schema: JSON.stringify(zodToJsonSchema(simplifiedCellsSchema))
    })
    .then(({ text }) => extractJson(text) as SimplifiedCellsType)
    .then((data) => mapSimplifiedCellsSchemaToJointJs(data, options))
    .then((data) => extractAndCreateGroups(data.cells))
}
