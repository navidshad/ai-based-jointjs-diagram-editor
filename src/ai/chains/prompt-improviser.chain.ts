import { LLMChain } from 'langchain/chains'
import { ChatPromptTemplate } from 'langchain/prompts'
import { gpt4Model } from '../llms/openai.llm'

const chatTemplate = ChatPromptTemplate.fromMessages([
  [
    'system',
    'You are a Jointjs diagram editor. take the given base prompt and improvise it to detailed prompt for generating a Jointjs JSON cells.'
  ],
  ['user', 'This is the base prompt:{base_prompt}'],

  ['system', 'improvised prompt is:']
])

export const promptImproviserChain = new LLMChain({ llm: gpt4Model, prompt: chatTemplate })

export function improviseBasePrompt(basePrompt: string) {
  return promptImproviserChain.invoke({ base_prompt: basePrompt }).then(({ text }) => text)
}
