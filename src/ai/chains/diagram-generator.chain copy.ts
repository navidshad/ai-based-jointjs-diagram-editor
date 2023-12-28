import { LLMChain } from 'langchain/chains'
import { ChatPromptTemplate } from 'langchain/prompts'
import { gpt4Model } from '../llms/openai.llm'
import { simplifiedCellsSchema, type SimplifiedCellsType } from '@/ai/schema/schemas'
import zodToJsonSchema from 'zod-to-json-schema'
import { extractJson } from '../helpers/json'
import { mapSimplifiedCellsSchemaToJointJs } from '../helpers/jointjs'

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

export function generateDiagram(description: string) {
  return manipulationChain
    .invoke({
      diagram_description: description,
      schema: JSON.stringify(zodToJsonSchema(simplifiedCellsSchema))
    })
    .then(({ text }) => extractJson(text) as SimplifiedCellsType)
    .then((data) => mapSimplifiedCellsSchemaToJointJs(data))
}
