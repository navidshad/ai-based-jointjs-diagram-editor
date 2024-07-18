import { LLMChain } from 'langchain/chains'
import { ChatPromptTemplate } from 'langchain/prompts'
import { gpt4Model } from '../llms/openai.llm'
import { extractJson } from '../helpers/json'
import {
  mapSimplifiedCellsSchemaToJointJs,
  simplifiedCellsSchema,
  type SimplifiedCellsType
} from '../schema/simple-json.schema'
import zodToJsonSchema from 'zod-to-json-schema'

const chatTemplate = ChatPromptTemplate.fromMessages([
  [
    'system',
    `
      Consider yourself a Unified Modeling Language expert who is able to assume diagram based the given description, 
      and return the node title, position, and connections according to the given schema.

      Consideration:
        1. Consider One way Flow for connections.
        2. Consider 200 units gapes for positioning.
    `
  ],
  ['user', 'Description:{diagram_description}'],
  ['user', 'Schema:{schema}'],
  ['system', 'JSON result is:']
])

export const manipulationChain = new LLMChain({ llm: gpt4Model, prompt: chatTemplate })

export function generateDiagramWithSimplifiedJSON(
  description: string,
  options: { autoSelectIcons: boolean }
) {
  return manipulationChain
    .invoke({
      diagram_description: description,
      schema: JSON.stringify(zodToJsonSchema(simplifiedCellsSchema))
    })
    .then(({ text }) => extractJson(text) as SimplifiedCellsType)
    .then((data) => mapSimplifiedCellsSchemaToJointJs(data, options))
}
