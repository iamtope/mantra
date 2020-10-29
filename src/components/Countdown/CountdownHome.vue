<template>
  <div

    class="countdown text-white"
  >
    <no-ssr>
      <countdown

        :time="time"
        tag="div"
        @end="showCountdown = false"
      >
        <template slot-scope="props">
          <div class="flex items-center">
            <div class="counter days">
              {{ props.days }}
            </div>
            <span class="block-inline p-1 text-xs rounded day-badget ml-4">
              {{ $t('home.countdownLabels.days') }}
            </span>
          </div>
          <div class="sub-counters text-2xl mt-1 flex">
            <div
              class="sub-count mr-4"
            >
              <span class="sub-count-number">{{ props.hours }}</span>
              <span class="sub-count-label">S</span>
            </div>

            <div
              class="sub-count mr-4"
            >
              <span class="sub-count-number">{{ props.minutes }}</span>
              <span class="sub-count-label">M</span>
            </div>

            <div
              class="sub-count"
            >
              <span class="sub-count-number">{{ props.seconds }}</span>
              <span class="sub-count-label">S</span>
            </div>
          </div>
        </template>
      </countdown>
    </no-ssr>
  </div>

</template>

<script>
export default {
  name: 'CountdownHome',

  props: {
    time: {
      required: true,
      type: Number
    }
  },

  data () {
    return {
      showCountdown: true
    }
  }
}
</script>

<style lang="postcss" scoped>
.up {
  transform: translateY(-180px);
}
.counter.days {
  font-size: 5.5rem;
}
.day-badget {
  background: linear-gradient(134deg, #e52d55 0%, #f17187 100%);
  @apply uppercase font-light;
}
.sub-count-label {
  color: rgba(#f17187, 1);
  @apply text-xs;
}
</style>
