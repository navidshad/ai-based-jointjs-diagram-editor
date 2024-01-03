import { LLMChain } from 'langchain/chains'
import { ChatPromptTemplate } from 'langchain/prompts'
import { gpt4Model } from '../llms/openai.llm'

import { mapCSVToSimplified, simplifiedCellsCSVSchema } from '../schema/csv.schema'
import { mapSimplifiedCellsSchemaToJointJs } from '../schema/simple-json.schema'

const chatTemplate = ChatPromptTemplate.fromMessages([
  [
    'system',
    `
      Consider yourself a Unified Modeling Language expert who is able to assume diagram based the given description, 
      and return the node title, position, and connections according to the given schema.

      Consideration:
        1. Consider One way Flow for connections.
        2. Consider 150 units gapes for positioning.
    `
  ],
  ['user', 'Description:{diagram_description}'],
  ['user', 'CSV Schema:{schema}'],
  ['system', 'CSV result is:']
])

export const manipulationChain = new LLMChain({ llm: gpt4Model, prompt: chatTemplate })

export function generateDiagramWithCSV(description: string) {
  return manipulationChain
    .invoke({
      diagram_description: description,
      schema: simplifiedCellsCSVSchema
    })
    .then(({ text }) => text)
    .then((data) => mapCSVToSimplified(data))
    .then((data) => mapSimplifiedCellsSchemaToJointJs(data))
}
