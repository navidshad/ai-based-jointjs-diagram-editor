import { LLMChain } from 'langchain/chains'
import { ChatPromptTemplate } from 'langchain/prompts'
import { gpt4Model } from './openai.model'

const chatTemplate = ChatPromptTemplate.fromMessages([
  [
    'system',
    'you are a Jointjs diagram editor. take the given change request and the Jointjs JSON cells, then manipulate the diagram based on the description.'
  ],
  ['user', 'This is the change request:{diagram_description}'],
  ['user', 'This is the Jointjs JSON cells:{json_cells}'],
  //   [
  //     'user',
  //     `
  // 		  Consider the following Jointjs rules:
  // 		  - each node has a title and id.
  // 		  - each node has a position and size.
  // 		  - each node type is either 'standard.Rectangle' or 'standard.Link'.
  // 		  - create link between if needed.
  // 		  - use this Jointjs node schema: {element_schema}
  // 		  - use this Jointjs link schema: {link_schema}
  // 		`
  //   ],
  ['system', 'JSON result is:']
])

export const manipulationChain = new LLMChain({ llm: gpt4Model, prompt: chatTemplate })

function extractJson(text: string): { [key: string]: any } {
  // Extract json part of given text
  const jsonStart = text.indexOf('{')
  const jsonEnd = text.lastIndexOf('}')
  const json = text.substring(jsonStart, jsonEnd + 1)

  try {
    return JSON.parse(json)
  } catch (error) {
    return {}
  }
}

export function manipulateDiagram(description: string, jsonCells: string) {
  return manipulationChain
    .invoke({ diagram_description: description, json_cells: jsonCells })
    .then(({ text }) => extractJson(text))
}
