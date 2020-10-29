<template>
  <div class="class text-white">
    <h2 class="text-2xl font-bold mb-8 uppercase text-white">
      <template v-if="user">
        {{ $t('home.steps.step1.titleWithUser', { name: user }) }}
      </template>
      <template v-else>
        {{ $t('home.steps.step1.title') }}
      </template>
    </h2>
    <p class="text-white">{{ $t('home.steps.step1.p1') }}</p>
    <p class="text-white mt-4">{{ $t('home.steps.step1.p2') }}</p>
    <mantra-button
      class="bg-white newsletter-form w-1/3 font-normal text-black form-field uppercase font-bold w-full mt-4 focus:outline-none focus text-input rounded-lg block text-lg justify-center"
      @click.native="$emit('gotoStep2')"
    >
      {{ $t('home.steps.step1.button') }}</mantra-button>
  </div>
</template>

<script>
import MantraButton from '@/components/MantraButton'

export default {
  name: 'NewsletterStep1',

  components: { MantraButton },

  props: {
    user: {
      type: String,
      required: false,
      default: undefined
    }
  }
}
</script>
