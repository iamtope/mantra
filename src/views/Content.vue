<template>

  <div class="container mx-auto py-10">
    <header class="text-center">
      <router-link
        tag="a"
        class="logo"
        :to="{name:'HomePage'}"
      >  <img
        src="http://acmelogos.com/images/logo-3.svg"
        alt=""
      ></router-link>
    </header>
    <div class="content markdown">

      <vue-markdown :source="content"></vue-markdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentPage',
  data () {
    return { content: '' }
  },
  async asyncData ({ route, $http }) {
    const response = await $http.get(`content/${route.meta.file}`)
    return {
      content: response.data
    }
  }
}
</script>

<style lang="postcss" scoped>
.content {
  @apply mt-16;
}
</style>
