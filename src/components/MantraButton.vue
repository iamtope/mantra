<template>
  <button

    :class="{'opacity-25': isLoading}"
    class="bg-mantra rounded text-white text-xs py-3 px-2 uppercase tracking-wide flex items-center"
    :disabled="isLoading"
  >
    <spinner :show="isLoading"></spinner>
    <slot />
  </button>
</template>

<script>
import Spinner from '@/components/Spinner'
export default {
  name: 'MantraButton',
  components: { Spinner },
  props: {
    isLoading: { type: Boolean, default: false }
  }
}
</script>

<style>
</style>
