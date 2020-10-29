<template>
  <div
    class="progress-base progress-bar"
  ><div
    class="progress-base current-progress"
    :style="{width}"
  >
  </div>
  </div>
</template>

<script>
export default {
  name: 'Progressbar',

  props: {
    width: {
      type: String,
      default: '0%'
    }
  }
}
</script>

<style lang="postcss" scoped>
.progress-bar {
  background: rgba(#e52d55, 0.2);
  height: 10px;
}
.current-progress {
  @apply bg-mantra;
  transition: width 1s ease-in-out;
  opacity: 0.5;
  height: 10px;
}
</style>
