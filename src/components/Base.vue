<template>
  <div class="inner-page">
    <header
      class="image-holder"
      :style="{backgroundImage: `url('${imageHeader}')`}"
    >
      <div class="head-slot h-full">
        <slot name="header" />
      </div>
    </header>
    <main
      class="content"
    >
      <slot />
    </main>
  </div>
</template>

<script>
export default {
  name: 'Base',

  props: {
    imageHeader: {
      required: true,
      type: String
    }
  }
}
</script>

<style lang="postcss" scoped>
.head-slot {
  position: relative;
  z-index: 10;
}

.image-holder {
  background: black;
  background-repeat: no-repeat;
  height: 60vh;
  background-size: cover;
  background-position: center center;
}
</style>
