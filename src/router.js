import Vue from 'vue'
import Router from 'vue-router'
import ContentPage from './views/Content.vue'
Vue.use(Router)

export default () => {
  return new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior (to, from, savedPosition) {
      return { x: 0, y: 0 }
    },
    routes: [
      {
        path: '/impressum',
        name: 'ImprintPage',
        component: ContentPage,
        meta: {
          file: 'imprint.md',
          title: 'Impressum'
        }
      },
      {
        path: '/datenschutz',
        name: 'PrivacyPage',
        component: ContentPage,
        meta: {
          file: 'privacy.md',
          title: 'Datenschutz'
        }
      },
      {
        path: '/agb',
        name: 'TosPage',
        component: ContentPage,
        meta: {
          file: 'tos.md',
          title: 'AGB'
        }
      },
      {
        path: '/',
        name: 'HomePage',
        component: () => import('./views/Home.vue')
      },
      {
        path: '/r/:refID?',
        name: 'HomePageWithRef',
        component: () => import('./views/Home.vue')
      },
      {
        path: '/refer/:privateID?',
        name: 'ReferPage',
        component: () => import('./views/Refer.vue')
      },

      {
        path: '*',
        name: 'NotFoundPage',
        component: () => import('./views/NotFound.vue')
      }
    ]
  })
}
