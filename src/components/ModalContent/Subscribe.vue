<template>
  <div class="subscribe-content">

    <div class="body">
      <div class="px-6 pb-6">
        <p class="text-sm">
          {{ $t('modals.subscribe.text') }}
        </p>

      </div>
      <ZoomCenterTransition>
        <mantra-button
          v-if="!success"
          :is-loading="loading"
          class="block w-full text-center link"
          @click.native="$emit('recover', email)"
        >
          {{ $t('modals.subscribe.emailInfo',{email}) }}
        </mantra-button>
        <div
          v-else
          class="block w-full text-center link bg-green"
        >
          {{ $t('modals.subscribe.success') }}
        </div>
      </ZoomCenterTransition>
    </div>
  </div>
</template>

<script>
import { SlideXRightTransition as ZoomCenterTransition } from 'vue2-transitions'
import MantraButton from '../MantraButton'

export default {
  name: 'SubscribeModalContent',

  components: {
    MantraButton,
    ZoomCenterTransition
  },

  props: {
    email: {
      required: true,
      type: String
    },

    success: {
      type: Boolean,
      default: true
    },

    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="postcss" scoped>
.link {
  border-radius: 0.8rem;
  @apply py-6 rounded-t-none border-t-0 justify-center normal-case text-sm;

  transform: translateY(1px);
}
</style>
