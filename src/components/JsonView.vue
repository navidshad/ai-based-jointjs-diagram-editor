<template>
  <v-card>
    <v-card-title> Json view </v-card-title>

    <v-card-subtitle>
      You can edit the content.
      <a href="https://resources.jointjs.com/tutorial" target="_blank"><u>documentation</u></a>
    </v-card-subtitle>

    <v-card-text class="">
      <v-textarea class="h-full" v-model="jsonContent" />
    </v-card-text>

    <v-card-actions>
      <v-btn @click="$emit('close')">Cancel</v-btn>
      <v-btn @click="update">Update</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { canvas } from '../services/canvas.service'

export default {
  data() {
    return {
      jsonContent: ''
    }
  },

  mounted() {
    this.jsonContent = JSON.stringify(canvas.graph.toJSON(), null, 2)
  },

  methods: {
    update() {
      canvas.updateByJson(this.jsonContent)
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.editor {
  width: 700px !important;
  height: 400px;
}
</style>
