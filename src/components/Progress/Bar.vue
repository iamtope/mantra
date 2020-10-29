<template>
  <div class="progress flex">
    <div
      v-for="n in bars"
      :key="n"
      :style="{width: progressWitdh}"
      class="progress-step progress"
    >
      <step :should-fill="n <= filledBars"></step>
    </div>
  </div>
</template>

<script>
import Step from './Step'

export default {
  name: 'ProgressBar',

  components: {
    Step
  },

  props: {
    bars: { type: Number, default: 3 },
    filledBars: { type: Number, default: 2 }
  },

  computed: {
    progressWitdh () {
      return `${100 / this.bars}%`
    }
  }
}
</script>

<style lang="postcss" scoped>
.progress-step {
  background: rgba(229, 45, 85, 0.2);
  height: 10px;
  @apply mr-2;
  &:last-child {
    @apply mr-0;
  }
}
</style>
