<template>
  <div
    class="progress-filler"
    :class="{fill: shouldFill}"
  >
  </div>
</template>

<script>
export default {
  name: 'ProgressStep',

  props: {
    shouldFill: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="postcss">
.progress-filler {
  height: 10px;
  width: 0%;
  transition: width 1s ease-in-out;
  @apply bg-mantra;
  &.fill {
    width: 100%;
  }
}
</style>
