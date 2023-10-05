<template>
  <div
    class="pan-frame"
    :class="[{ 'is-panning': isPanning }]"
    :style="{ width: frameSize.width + 'px', height: frameSize.height + 'px' }"
  >
    <!-- @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    @mouseup="onMouseLeave" -->
    <div class="action-header" id="diagram-pan-header">
      <slot name="header" :resetPan="resetPan" />
    </div>

    <div
      class="pan-area"
      :style="{
        width: contentSize.width + 'px',
        height: contentSize.height + 'px',
        transform: `translate(${xPose}px, ${yPose}px)`
      }"
    >
      <slot name="canvas" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showControllers: { type: Boolean, default: true },
    frameSize: {
      // type: Object,
      default: () => {
        return { width: 512, height: 512 }
      }
    },

    contentSize: {
      // type: Object,
      default: () => {
        return { width: 1024, height: 1024 }
      }
    }
  },

  data() {
    return {
      isPanning: false,
      xPose: 0,
      yPose: 0
    }
  },

  watch: {
    frameSize: {
      immediate: true,
      deep: true,
      handler() {
        this.xPose = 0
      }
    }
  },

  methods: {
    onMouseDown() {
      this.isPanning = true
    },

    onMouseMove(event) {
      if (!this.isPanning) return

      if (this.xPose > 0) {
        this.xPose = 0
      } else {
        this.xPose += event.movementX
      }

      if (this.yPose > 0) {
        this.yPose = 0
      } else {
        this.yPose += event.movementY
      }
    },

    onMouseLeave() {
      this.isPanning = false
    },

    resetPan() {
      this.xPose = 0
      this.yPose = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.pan-frame {
  overflow: hidden;
  position: relative;
  // cursor: grab;

  .action-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}

.is-panning {
  cursor: move;
}
</style>
