<template>
  <v-card variant="plain">
    <v-card-text>
      <v-form v-model:model-value="isValidPrompt" ref="form" fast-fail>
        <v-textarea
          label="Prompt"
          auto-grow
          max-rows="30"
          v-model="prompt"
          :loading="isImprovingPrompt"
          :rules="promptRules"
          :disabled="isImprovingPrompt || isGeneratingDiagram"
          :append-inner-icon="!isImprovingPrompt ? 'mdi-robot' : 'mdi-robot-vacuum'"
          @click:append-inner="improvePrompt"
        />

        <v-btn
          class="my-2"
          block
          variant="flat"
          color="primary"
          :disabled="isGeneratingDiagram || !isValidPrompt || !prompt.length"
          :loading="isGeneratingDiagram"
          @click="submit"
          >Submit</v-btn
        >
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { manipulateDiagram } from '@/ai-chains/manipulation.chain'
import { improviseBasePrompt } from '@/ai-chains/prompt-improviser.chain'
import { useDiagramStore } from '@/stores/diagram'
import type { Diagram } from '@/types/general'
import { ref } from 'vue'

const diagramStore = useDiagramStore()

const isGeneratingDiagram = ref(false)
const isImprovingPrompt = ref(false)

const isValidPrompt = ref(true)
const prompt = ref('')
const promptRules = [
  (v: string) => !!v || 'Prompt is required',
  (v: string) => v.length <= 20000 || 'Prompt must be less than 2000 characters'
]

async function improvePrompt() {
  isImprovingPrompt.value = true

  await improviseBasePrompt(prompt.value)
    .then((res) => {
      prompt.value = res
    })
    .finally(() => {
      isImprovingPrompt.value = false
    })
}

async function submit() {
  isGeneratingDiagram.value = true
  const diagramCells = JSON.stringify(diagramStore.graph.toJSON())

  await manipulateDiagram(prompt.value, diagramCells)
    .then((res) => {
      console.log(res)
      diagramStore.insertDiagramData(res as Diagram)
    })
    .finally(() => {
      isGeneratingDiagram.value = false
    })
}
</script>
