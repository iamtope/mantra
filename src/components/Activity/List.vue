<template>
  <zoom-center-transition group>
    <card
      v-for="activity in activities"
      :key="activity._id"
      :activity="activity"
    ></card>
  </zoom-center-transition>
</template>

<script>
import { ZoomCenterTransition } from 'vue2-transitions'
import Card from './Card'

export default {
  name: 'ActivityList',

  components: {
    ZoomCenterTransition,
    Card
  },

  props: {
    activities: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss">
.list {
  height: 500px;
  overflow-y: scroll;
}
</style>
