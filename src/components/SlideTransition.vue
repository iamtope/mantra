<template>
  <transition
    name="slide-fade"
    mode="out-in"
    appear
  >
    <slot />
  </transition>
</template>

<script>
export default {
  name: 'SlideTransition'
}
</script>

<style lang="scss">
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.6s ease-out, opacity 0.3s ease-out;
  opacity: 0;
}
.slide-fade-enter-to {
  opacity: 1;
}
.slide-fade-enter {
  transform: translateX(-20%);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20%);
}
</style>
