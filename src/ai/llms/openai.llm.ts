import { OpenAIChat } from 'langchain/llms/openai'

export function getOpenAIApiKey(): string {
  return typeof window !== 'undefined' ? localStorage.getItem('OPENAI_API_KEY') || '' : ''
}
export const orgId = import.meta.env.VITE_OPENAI_ORG_ID

export function getGpt4Model() {
  return new OpenAIChat({
    openAIApiKey: getOpenAIApiKey(),
    modelName: 'gpt-5-mini-2025-08-07'
  })
}
