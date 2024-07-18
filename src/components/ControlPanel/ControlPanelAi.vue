<template>
  <v-card variant="plain">
    <v-card-text>
      <v-form v-model:model-value="isValidPrompt" ref="form" fast-fail>
        <v-textarea
          label="Prompt"
          v-model="prompt"
          :loading="isImprovingPrompt"
          :rules="promptRules"
          :disabled="isImprovingPrompt || isGeneratingDiagram"
          :append-inner-icon="!isImprovingPrompt ? 'mdi-robot' : 'mdi-robot-vacuum'"
          @click:append-inner="improvePrompt"
        />

        <v-checkbox
          v-model="autoSelectIcons"
          label="Auto select icons (AWS only)"
          :disabled="isImprovingPrompt || isGeneratingDiagram"
        />

        <div class="flex space-x-2">
          <v-btn
            class="flex-1"
            variant="flat"
            :color="isEditingDiagramAllowed() ? '' : 'primary'"
            :disabled="isGeneratingDiagram || isEditingDiagram || !isValidPrompt || !prompt.length"
            :loading="isGeneratingDiagram"
            @click="generateByAi"
          >
            Generate New
          </v-btn>

          <v-btn
            v-if="isEditingDiagramAllowed()"
            class="flex-1"
            variant="flat"
            color="primary"
            :disabled="isEditingDiagram || isGeneratingDiagram || !isValidPrompt || !prompt.length"
            :loading="isEditingDiagram"
            @click="editByAi"
          >
            Edit
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { manipulateDiagram, improviseBasePrompt, generateDiagramWithCSV } from '@/ai'
import { useDiagramStore } from '@/stores/diagram'
import type { Diagram } from '@/types/general'

import { ref } from 'vue'

const diagramStore = useDiagramStore()

const isGeneratingDiagram = ref(false)
const isEditingDiagram = ref(false)
const isImprovingPrompt = ref(false)
const autoSelectIcons = ref(true)

const prompt = ref(`My requirement is for a user to make a request to a 3-tier application. 

Once the user makes the request to the front page, which is deployed on a network load balancer running on 5 container apps, 

The second tier consists of business logic which is deployed on a private EC2 cluster that can only be connected to via a bastion host. 

The final layer is deployed partly on RDS and partly on DynamoDB.`)

const isValidPrompt = ref(true)
const promptRules = [
  (v: string) => !!v || 'Prompt is required',
  (v: string) => v.length <= 20000 || 'Prompt must be less than 2000 characters'
]

function isEditingDiagramAllowed() {
  return diagramStore.hierarchyStore.data.length
}

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

async function generateByAi() {
  isGeneratingDiagram.value = true

  await generateDiagramWithCSV(prompt.value, { autoSelectIcons: autoSelectIcons.value })
    .then((res) => {
      diagramStore.insertDiagramData(res as any)
    })
    .finally(() => {
      isGeneratingDiagram.value = false
    })
}

async function editByAi() {
  isEditingDiagram.value = true
  const diagramCells = diagramStore.graph.getCells()

  await manipulateDiagram(prompt.value, diagramCells, { autoSelectIcons: autoSelectIcons.value })
    .then((res) => {
      diagramStore.insertDiagramData(res as Diagram)
    })
    .finally(() => {
      isEditingDiagram.value = false
    })
}
</script>
