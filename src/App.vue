<template>
  <div id="app">
    <div class="site-content">
      <router-view :key="$route.fullPath" />
    </div>
    <page-footer />

    <div
      v-if="!isAnalyitcsEnabled"
      class="cookie-notice bg-mantra fixed"
    >
      <div class="container mx-auto">
        <div class="flex justify-between">
          <div class="cookie-content text-white">
            <p>
              {{ $t('cookie.p1') }}
            </p>

            <i18n
              path="cookie.p2"
              tag="p"
            >
              <router-link
                place="link"
                class="text-white no-underline"
                :to="{name:'PrivacyPage'}"
              >{{ $t('cookie.linkText') }} </router-link>
            </i18n>

          </div>
          <mantra-button
            class="bg-white rounded text-black"
            @click.native="enableCookies"
          >   {{ $t('cookie.button') }}</mantra-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PageFooter from '@/components/Footer'
import MantraButton from '@/components/MantraButton'
export default {
  name: 'App',
  components: {
    PageFooter,
    MantraButton
  },
  data: () => ({ isAnalyitcsEnabled: false }),
  head: {
    title: 'Mantraschmuck',

    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Mantraschmuck' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Rubik'
      }
    ],
    bodyAttrs: {
      class: 'tracking-wide leading-tight'
    }
  },
  mounted () {
    this.isAnalyitcsEnabled = localStorage.getItem('analytics')

    if (this.isAnalyitcsEnabled) {
      this.enableAnalytics()
    }
  },
  methods: {
    enableAnalytics () {
      this.$ga.enable()
    },
    enableCookies () {
      localStorage.setItem('analytics', true)
      this.isAnalyitcsEnabled = true
      this.enableAnalytics()
    }
  }
}
</script>

<style lang="postcss">
#app {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}
@screen md {
  .site-content {
    flex: 1;
  }
}

.cookie-notice {
  width: 100%;
  padding: 20px 0;
  bottom: 0;
  z-index: 99999;
}
</style>
