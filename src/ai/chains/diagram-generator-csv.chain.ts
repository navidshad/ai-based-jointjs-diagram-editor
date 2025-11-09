import { LLMChain } from 'langchain/chains'
import { ChatPromptTemplate } from 'langchain/prompts'
import { getGpt4Model } from '../llms/openai.llm'

import { mapCSVToSimplified, simplifiedCellsCSVSchema } from '../schema/csv.schema'
import {
  extractAndCreateGroups,
  mapSimplifiedCellsSchemaToJointJs
} from '../schema/simple-json.schema'
import { extractCSV } from '../helpers/json'

const chatTemplate = ChatPromptTemplate.fromMessages([
  [
    'system',
    `
      Consider yourself a Unified Modeling Language expert who is able to assume diagram based the given description, 
      and return the node title, position, and connections according to the given schema.

      Consideration:
        1. Connections must be one way.
        2. Consider at least 150 units gapes or more for positioning.
    `
  ],
  ['user', 'Description:{diagram_description}'],
  ['user', 'CSV Schema:{schema}'],
  ['system', 'CSV result is:']
])

export function generateDiagramWithCSV(description: string, options: { autoSelectIcons: boolean }) {
  const manipulationChain = new LLMChain({ llm: getGpt4Model(), prompt: chatTemplate })

  return manipulationChain
    .invoke({
      diagram_description: description,
      schema: simplifiedCellsCSVSchema
    })
    .then(({ text }) => text)
    .then((data) => extractCSV(data))
    .then((data) => mapCSVToSimplified(data))
    .then((data) => mapSimplifiedCellsSchemaToJointJs(data, options))
    .then((data) => extractAndCreateGroups(data.cells))
}
