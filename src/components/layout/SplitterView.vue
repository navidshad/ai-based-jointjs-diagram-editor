<template>
  <div class="h-full" :class="[{ flex: isHorizontal }]" ref="frame">
    <!-- Left column -->
    <div ref="first" :id="firstId" :class="[firstColumnClass]">
      <slot name="first" :width="firstWidth" :height="firstHeight" />
    </div>

    <!-- Right column -->
    <div ref="second" :id="secondId" :class="[secondColumnClass]">
      <slot name="second" :width="secondWidth" :height="secondHeight" />
    </div>
  </div>
</template>

<style lang="scss">
.gutter {
  background-repeat: no-repeat;
  background-position: 50%;
}

.gutter.gutter-horizontal {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
  cursor: col-resize;
}
</style>

<script>
import Split from 'split.js'
import { computed } from 'vue'
// import store from "@/store";

let splitInstance
let sizes = [50, 50]
let fullScreenOnInit = ''
let minSize = 100
let expandedSide = null

let firstEl
let secondEL

function createSplitterInstance(minSize, initSizes, isHorizontal, frameHtmlElement) {
  splitInstance = Split([firstEl, secondEL], {
    minSize: minSize,
    sizes: initSizes,
    direction: isHorizontal ? 'horizontal' : 'vertical'
  })

  frameHtmlElement
    .querySelector('.gutter')
    .setAttribute(
      'data-intro',
      'Not enough space for Terminal? Hover your mouse over this space to resize between quiz and terminal.'
    )
}

let self

export default {
  provide() {
    return {
      // Childe can inject this method and them use it for
      // expand first side
      // expandSplitterColumns('first')
      expandSplitterColumns: (side) => {
        this.expandSplitterColumns(side)
      },

      resizeSplitterColumns: (newSizes = [50, 50]) => {
        splitInstance.destroy()
        createSplitterInstance(minSize, newSizes, this.isHorizontal, self.$refs.frame)
      },

      firstHeight: computed(() => this.firstHeight),
      firstWidth: computed(() => this.firstWidth),
      secondHeight: computed(() => this.secondHeight),
      secondWidth: computed(() => this.secondWidth)
    }
  },

  props: {
    // CSS class for columns
    firstColumnClass: { type: String },
    secondColumnClass: { type: String },

    // An array contains 2 number for left and right width
    minSize: { default: 0 },

    // Initial sizes of each element in percents or CSS values
    sizes: { default: () => [80, 20] },

    fullScreenOnInit: {
      type: String,
      validator: (value) => {
        return ['first', 'second'].includes(value)
      }
    },

    isHorizontal: { type: Boolean, default: true }
  },

  watch: {
    isHorizontal() {
      if (splitInstance) {
        splitInstance.destroy()
      }

      this.initialize()
    },

    sizes() {
      if (splitInstance) {
        splitInstance.destroy()
      }

      this.initialize()
    }
  },

  data() {
    return {
      stamp: new Date().getTime(),

      resizeObserver: null,
      firstHeight: 0,
      firstWidth: 0,
      secondHeight: 0,
      secondWidth: 0
    }
  },

  computed: {
    splitInstance() {
      return splitInstance
    },

    firstId() {
      return 'first-' + this.stamp
    },

    secondId() {
      return 'second-' + this.stamp
    }
  },

  mounted() {
    this.initialize()
  },

  methods: {
    initialize() {
      self = this
      sizes = this.sizes
      fullScreenOnInit = this.fullScreenOnInit
      minSize = this.minSize

      firstEl = this.$refs.first
      secondEL = this.$refs.second

      createSplitterInstance(minSize, sizes, this.isHorizontal, this.$refs.frame)

      if (this.fullScreenOnInit) {
        this.expandSplitterColumns(this.fullScreenOnInit)
      }

      this.onResized()

      // https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API
      this.resizeObserve = new ResizeObserver(this.onResized)
      this.resizeObserve.observe(this.$refs.first)
    },

    onResized() {
      this.firstWidth = this.$refs.first.clientWidth
      this.firstHeight = this.$refs.first.clientHeight

      this.secondWidth = this.$refs.second.clientWidth
      this.secondHeight = this.$refs.second.clientHeight
    },

    // Chields can inject this method and them use it for
    // expand first side
    // expandSplitterColumns('first')
    expandSplitterColumns(side) {
      if (!expandedSide) {
        expandedSide = side
        splitInstance.destroy()

        // If side is left expandedSize is [100,0]
        // or if right => [0,100]
        let expandedSize = [side == 'first' ? 100 : 0, side == 'second' ? 100 : 0]

        createSplitterInstance(expandedSize, expandedSize, this.isHorizontal, self.$refs.frame)
        // this.setListeners()
      } else {
        expandedSide = null
        splitInstance.destroy()

        createSplitterInstance(minSize, sizes, this.isHorizontal, self.$refs.frame)
      }
    }
  }
}
</script>
