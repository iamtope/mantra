<template>
  <div
    v-if="showCountdown"
    class="countdown"
  >
    <no-ssr>
      <countdown
        :time="time"
        tag="div"
        :transform="transform"
        @end="showCountdown = false"
      >
        <template slot-scope="props">
          <div class="sub-counters">
            {{ props.days }} Tage {{ props.hours }}:{{ props.minutes }}:{{ props.seconds }}
          </div>
        </template>
      </countdown>
    </no-ssr>
  </div>
  <div
    v-else
    class="countdown-end"
  >fewf
  </div>
</template>

<script>
export default {
  name: 'CountdownSimple',

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
  },

  methods: {
    transform (props) {
      Object.entries(props).forEach(([key, value]) => {
        // Adds leading zero
        const digits = value < 10 ? `0${value}` : value
        props[key] = `${digits}`
      })

      return props
    }
  }
}
</script>

<style lang="postcss" scoped>
</style>
