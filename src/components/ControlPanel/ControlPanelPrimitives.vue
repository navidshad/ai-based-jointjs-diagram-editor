<template>
  <section class="p-2 flex items-center justify-between flex-wrap">
    <!-- Rectangle -->
    <div class="shape">
      <svg width="100" height="100">
        <rect
          stroke-width="2"
          stroke="#000000"
          fill="#30d0c6"
          fill-opacity="0.5"
          width="100"
          height="100"
        />
        <text
          font-size="14"
          xml:space="preserve"
          text-anchor="middle"
          fill="#333333"
          transform="matrix(1,0,0,1,50,50)"
        >
          <tspan dy="0.3em" class="v-line">Rectangle</tspan>
        </text>
      </svg>
    </div>

    <!-- Circle -->
    <div class="shape">
      <svg width="100" height="100">
        <circle
          stroke-width="2"
          stroke="#333333"
          fill="#30d0c6"
          fill-opacity="0.5"
          cx="50"
          cy="50"
          r="50"
        />
        <text
          font-size="14"
          xml:space="preserve"
          text-anchor="middle"
          fill="#333333"
          transform="matrix(1,0,0,1,50,50)"
        >
          <tspan dy="0.3em" class="v-line">Circle</tspan>
        </text>
      </svg>
    </div>

    <!-- Ellipse -->
    <div class="shape">
      <svg width="100" height="100">
        <ellipse
          stroke-width="2"
          stroke="#333333"
          fill="#30d0c6"
          fill-opacity="0.5"
          cx="35"
          cy="50"
          rx="35"
          ry="50"
        />
        <text
          font-size="14"
          xml:space="preserve"
          text-anchor="middle"
          fill="#333333"
          transform="matrix(1,0,0,1,35,50)"
        >
          <tspan dy="0.3em" class="v-line">Ellipse</tspan>
        </text>
      </svg>
    </div>
  </section>
  <p class="p-2 my-2 text-gray-500">
    Select an item then try to "drag and create" on the canvas to add your shape.
  </p>
</template>

<script setup lang="ts"></script>

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
