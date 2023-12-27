<template>
  <v-card variant="plain">
    <!-- <v-card-title>Label</v-card-title> -->
    <v-card-text>
      <v-form v-model:model-value="isValidPrompt" ref="form" fast-fail>
        <v-textarea label="Prompt" v-model:model-value="prompt" :rules="promptRules" />
        <v-btn
          class="my-2"
          block
          variant="flat"
          color="primary"
          :disabled="!isValidPrompt || !prompt.length"
          :loading="isLoading"
          @click="submit"
          >Submit</v-btn
        >
      </v-form>

      <!--
		<script>
		import axios from "axios";
		
		export default {
			data: () => ({
				valid: true,
				name: "",
				nameRules: [v => !!v || "Name is required", v => (v && v.length <= 10) || "Name must be less than 10 characters"],
				email: "",
				emailRules: [v => !!v || "E-mail is required", v => /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/.test(v) || "E-mail must be valid"],
				select: null,
				items: ["Item 1", "Item 2", "Item 3", "Item 4"],
				checkbox: false
			}),
		
			methods: {
				submit() {
					if (this.$refs.form.validate()) {
						// Native form submission is not yet supported
						axios.post("/api/submit", {
							name: this.name,
							email: this.email,
							select: this.select,
							checkbox: this.checkbox
						});
					}
				},
				clear() {
					this.$refs.form.reset();
				}
			}
		};
		</script>
		-->
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { manipulateDiagram } from '@/ai-chains/manipulation.chain'
import { useDiagramStore } from '@/stores/diagram'
import type { Diagram } from '@/types/general'
import { ref } from 'vue'

const diagramStore = useDiagramStore()

const isLoading = ref(false)
const isValidPrompt = ref(true)
const prompt = ref('')
const promptRules = [
  (v: string) => !!v || 'Prompt is required',
  (v: string) => v.length <= 20000 || 'Prompt must be less than 2000 characters'
]

async function submit() {
  isLoading.value = true
  const diagramCells = JSON.stringify(diagramStore.graph.toJSON())

  await manipulateDiagram(prompt.value, diagramCells)
    .then((res) => {
      console.log(res)
      diagramStore.insertDiagramData(res as Diagram)
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>
