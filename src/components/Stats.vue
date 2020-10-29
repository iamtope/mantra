<template>

  <div class="stats">
    <div
      class="bg-grey-lightest card px-6 mb-10 py-4"
    >
      <p class="text-xl font-bold">Deine nächste Belohnung:</p>
      <div class="flex mt-3">
        <img
          :src="getNextReward.image"
          :alt="getNextReward.info"
        >
        <div class="count flex items-center w-full justify-center">
          <span class="text-xl mr-8">
            Noch:
          </span>
          <span class="text-4xl text-mantra counter-number">{{ getNextReward.left }}</span>
        </div>

      </div>
      <div class="reward-info mt-3">
        {{ getNextReward.info }}
      </div>
    </div>
    <div
      class="bg-grey-lightest card px-6 py-4"
    >
      <i18n
        class="entry"
        path="stats.currentVisitors"
        tag="div"
      >
        <span
          class="text-mantra"
          place="liveVisits"
        >{{ liveVisits }}</span>
      </i18n>
      <i18n
        class="entry"
        path="stats.totalVisits"
        tag="div"
      >
        <span
          class="text-mantra"
          place="totalVisits"
        >{{ totalVisits }}</span>
      </i18n>

      <i18n
        class="entry"
        path="stats.potential"
        tag="div"
      >
        <span
          class="text-mantra"
          place="pendingSubscribes"
        >{{ potential }}</span>
      </i18n>

      <i18n
        path="stats.countdown"
        tag="div"
        class="entry"
      >

        <countdown-simple
          :time="time"
          place="countdown"
        ></countdown-simple>
      </i18n>

      <!-- count down -->

      <div class="entry">
        {{ $t('stats.inviteFriends') }}
      </div>
    </div>
  </div>
</template>

<script>
import CountdownSimple from '@/components/Countdown/CountdownSimple'

export default {
  name: 'Stats',

  components: {
    CountdownSimple
  },

  props: {
    liveVisits: {
      type: Number,
      required: false,
      default: 3
    },

    totalVisits: {
      type: Number,
      required: false,
      default: 4
    },

    subscriberCount: {
      type: Number,
      required: true
    },

    potential: {
      type: Number,
      required: false,
      default: 5
    },

    requirements: {
      type: Array,
      required: true
    }
  },

  computed: {
    time () {
      return this.$store.state.app.countdown
    },

    getNextReward () {
      let nextRewardIndex = 0
      const requirementsLength = this.requirements.length
      const lastCount = this.requirements[requirementsLength - 1].requires

      if (this.subscriberCount >= lastCount) {
        return this.requirements[requirementsLength]
      }

      for (let requirement of this.requirements) {
        if (requirement.requires <= this.subscriberCount) {
          nextRewardIndex++
        }
      }
      const left =
        this.requirements[nextRewardIndex].requires - this.subscriberCount
      return { ...this.requirements[nextRewardIndex], left }
    }
  }
}
</script>

<style lang="postcss" scoped>
.entry {
  @apply mb-4 flex justify-between border-b border-grey-light pb-2;

  &:last-child {
    @apply mb-0 pb-0 border-0;
  }
}

.card {
  border-radius: 4px;
}
.counter-number {
  font-size: 5.5rem;
}
</style>
