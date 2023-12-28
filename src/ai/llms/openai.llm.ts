import { OpenAIChat } from 'langchain/llms/openai'

export const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY
export const orgId = import.meta.env.VITE_OPENAI_ORG_ID

export const gpt4Model = new OpenAIChat({
  openAIApiKey,
  modelName: 'gpt-4'
})

gpt4Model.organization = orgId
