import Vue from 'vue'
import App from './App.vue'
import createRouter from './router'
import VueMeta from 'vue-meta'
import './assets/styles/tailwind.css'
import './assets/styles/markdown.scss'
import './assets/styles/global.scss'
import createStore from './store'
import createI18n from './i18n'

Vue.config.productionTip = false

Vue.use(VueMeta, { keyName: 'head' })
const i18n = createI18n()

export default () => {
  const router = createRouter()
  const store = createStore()
  return new Vue({
    i18n,
    store,
    router,
    render: h => h(App)
  })
}

if (module.hot) {
  module.hot.accept(['./locales/de'], function () {
    i18n.setLocaleMessage('de', require('./locales/de').default)
  })
}
