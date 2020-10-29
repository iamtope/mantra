<template>
  <div class="pending-content">
    <div class="body">
      <div class="px-6 pb-6">
        <p class="text-sm">
          {{ $t('modals.pending.text') }}
        </p>
      </div>
      <mantra-button
        class="block w-full text-center link bg-green"
        @click.native="$emit('close', true)"
      >
        {{ $t('modals.pending.closeButton') }}
      </mantra-button>
    </div>
  </div>
</template>

<script>
import MantraButton from '@/components/MantraButton'

export default {
  name: 'PendingModalContent',

  components: {
    MantraButton
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
