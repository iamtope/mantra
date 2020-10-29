import Vue from 'vue'
import VueCountdown from '@chenfengyuan/vue-countdown'
import NoSSR from 'vue-no-ssr'
import VueClipboard from 'vue-clipboard2'
import VueSocial from 'vue-social-sharing'
import VueMq from 'vue-mq'
import Facebook from '@/assets/icons/facebook.svg'
import Twitter from '@/assets/icons/twitter.svg'
import Whatsapp from '@/assets/icons/whatsapp.svg'

import VueTimeago from 'vue-timeago'
import VueMarkdown from 'vue-markdown'
export default {
  beforeCreate ({ store }) {
    Vue.component('facebook', Facebook)
    Vue.component('twitter', Twitter)
    Vue.component('whatsapp', Whatsapp)
    Vue.component('no-ssr', NoSSR)
    Vue.component('vue-markdown', VueMarkdown)
    Vue.use(VueSocial)

    Vue.use(VueTimeago, {
      name: 'timeago',
      locale: 'de',
      locales: {
        de: require('date-fns/locale/de')
      }
    })

    Vue.component(VueCountdown.name, VueCountdown)
    Vue.use(VueClipboard)
    Vue.use(VueMq, {
      breakpoints: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px'
      },
      defaultBreakpoint: 'sm' // customize this for SSR
    })

    if (process.client) {
      Vue.component('tags-input', require('@voerro/vue-tagsinput').default)
    }
  }
}
