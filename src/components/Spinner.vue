<template>
  <div
    v-show="show"
    class="spinner"
  ></div>
</template>

<script>
export default {
  name: 'Spinner',

  props: {
    show: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss">
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

.spinner {
  height: 26px;
  width: 26px;
  margin-right: 8px;
  opacity: 1;
  filter: alpha(opacity=100);
  animation: rotation 0.7s infinite linear;
  border: 4px solid rgba(0, 0, 0, 0.2);
  border-top-color: white;
  border-radius: 100%;
  transition: 0.3s all ease;
}
</style>
