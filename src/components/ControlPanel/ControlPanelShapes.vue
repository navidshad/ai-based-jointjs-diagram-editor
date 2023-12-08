<template>
  <v-container>
    <v-row>
      <v-col
        @dragend="onDrop($event, img)"
        v-for="(img, i) of imgs"
        :key="i"
        cols="4"
        class="shape d-flex justify-center"
      >
        <img :src="img" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { shapes } from 'jointjs'
import { defineComponent } from 'vue'

import { resourceNames } from '@/static/resource-names'
import { useDiagramStore } from '@/stores/diagram'

export default defineComponent({
  computed: {
    imgs() {
      return resourceNames.split(',') || []
    }
  },

  setup() {
    return {
      diagramStore: useDiagramStore()
    }
  },

  methods: {
    onDrop(event: DragEvent, img: string = '') {
      let pos = this.diagramStore.paper.localToPaperPoint(event.clientX, event.clientY)

      var image = new shapes.standard.Image()
      let title = img.split('/').pop()?.split('_')[0]

      image.resize(60, 60)
      image.position(pos.x, pos.y)
      image.attr('root/title', 'joint.shapes.standard.Image')
      image.attr('label/text', title)
      image.attr('image/xlinkHref', img)

      this.diagramStore.addElement(image)
    }
  }
})
</script>

<style lang="scss" scoped>
.shape {
  padding: 5px;
  transition: all ease 200ms;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: lightblue;
  }

  img {
    width: auto;
    height: 80px;
  }
}
</style>
