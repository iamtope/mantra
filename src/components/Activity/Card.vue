<template>
  <div
    class="bg-white card  overflow-hidden mb-10 shadow-lg"
    :class="activity.status"
  >
    <div class="text-left sm:flex-grow">
      <div class="px-6 py-4">
        <header class="text-grey-dark flex justify-between items-center">
          <h4 class="text-xl leading-tight ">
            {{ $t(`status.${activity.status}.title`,{name: activity.firstName, email: activity.email}) }}
          </h4>
          <timeago
            class="text-sm"
            :auto-update="60"
            :datetime="activity.updatedAt"
          ></timeago>
        </header>
        <progress-bar-step
          class="my-2"
          :bars="4"
          :filled-bars="progressSteps"
        ></progress-bar-step>
        <div class="content flex items-center">
          <div class="icon mr-2"><lamp-icon></lamp-icon></div>
          <p
            class="text-sm leading-tight text-grey-dark"
          >
            {{ $t(`status.${activity.status}.info`,{name: activity.firstName, email: activity.email} ) }}

          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBarStep from '@/components/Progress/Bar'
import LampIcon from '@/assets/icons/lamp.svg'

export default {
  name: 'ActivityCard',

  components: {
    LampIcon,
    ProgressBarStep
  },

  props: {
    activity: {
      required: true,
      type: Object
    }
  },

  computed: {
    progressSteps () {
      switch (this.activity.status) {
        case 'invitedByEmail':
          return 1

        case 'firstName':
          return 2

        case 'pending':
          return 3

        case 'subscribe':
          return 4

        default:
          return 0
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.card {
  color: rgb(243, 243, 243);
  border-radius: 4px;
}
</style>
