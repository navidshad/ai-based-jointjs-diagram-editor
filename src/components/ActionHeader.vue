<template>
  <div v-bind="$attrs" class="action-header" :style="{ width: width + 'px' }">
    <div class="action-group">
      <v-btn icon="m" color="white" size="x-small" @click="resetPan">
        <v-icon size="15" icon="mdi-eye-refresh" />

        <v-tooltip location="bottom" activator="parent">
          <span>Reset Viewport</span>
        </v-tooltip>
      </v-btn>

      <v-btn icon="m" color="white" size="x-small" @click="save">
        <v-icon size="15" icon="mdi-content-save" />

        <v-tooltip location="bottom" activator="parent">
          <span>Submit diagram in final JSON</span>
        </v-tooltip>
      </v-btn>

      <v-btn icon="m" color="white" size="x-small" @click="jsonView = true">
        <v-icon size="15" icon="mdi-code-json" />

        <v-tooltip location="bottom" activator="parent">
          <span>Json view</span>
        </v-tooltip>
      </v-btn>
    </div>

    <!-- 
      Transform actions
     -->
    <div class="action-group">
      <!-- <v-btn
        icon="m"
        size="x-small"
        @click="transform = 'move'"
        :color="isSelected('move')"
      >
        <v-icon size="15" icon="mdi-axis-arrow" />

        <v-tooltip location="bottom" activator="parent">
          <span>Move active element</span>
        </v-tooltip>
      </v-btn>

      <v-btn
        icon="m"
        size="x-small"
        @click="transform = 'rotate'"
        :color="isSelected('rotate')"
      >
        <v-icon size="15" icon="mdi-autorenew" />

        <v-tooltip location="bottom" activator="parent">
          <span>Rotate active element</span>
        </v-tooltip>
      </v-btn>

      <v-btn
        icon="m"
        size="x-small"
        @click="transform = 'scale'"
        :color="isSelected('scale')"
      >
        <v-icon size="15" icon="mdi-resize" />

        <v-tooltip location="bottom" activator="parent">
          <span>Scale active element</span>
        </v-tooltip>
      </v-btn> -->
    </div>

    <!-- 
      CONTROL PANEL TOGGLE
     -->
    <div class="action-group" id="diagram-panel-toggle"></div>
  </div>

  <v-dialog v-model="jsonView" persistent>
    <json-view-component @close="jsonView = false" />
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import JsonViewComponent from './JsonView.vue'

export default defineComponent({
  components: { JsonViewComponent },

  emits: ['save'],

  props: {
    resetPan: { type: Function },
    width: { type: Number, default: 0 }
  },

  data() {
    return {
      // transform: "move",
      jsonView: false
    }
  },

  watch: {
    // transform() {
    //   this.$emit("transform", this.transform);
    // },
  },

  methods: {
    // isSelected(key) {
    //   return key == this.transform ? "secondary" : "white";
    // },
    save() {
      this.$emit('save')
    }
  }
})
</script>

<style lang="scss" scoped>
.action-header {
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-items: center;
}

.action-group {
  display: flex;
  justify-content: space-between;
  justify-items: center;
  align-content: center;
  align-items: center;
  margin: 0px 10px;

  button {
    margin: 0 3px;
  }
}
</style>
