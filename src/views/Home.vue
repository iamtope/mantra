<template>
  <base-frame
    image-header="/images/mantrahands.jpg"
  >
    <div

      slot="header"
      class="transparent-bg md:w-1/2 flex ml-auto h-full px-4 md:px-12 items-center"
    >
      <div class="header-inner">
        <div class="intro text-white">
          <h1 class="text-3xl text-medium text-strong text-white">
            {{ $t('home.title') }}
          </h1>
          <p class="text-lg  md:my-3 my-6">
            {{ $t('home.p1') }}
          </p>
        </div>
        <countdown-home :time="time"></countdown-home>
        {{ countdownIsOver }}
      </div>
    </div> <!-- end head slot -->

    <div class="newsletter flex items-center">
      <div class="container mx-auto px-4">
        <slide-transition>
          <step1
            v-if="!showNewsletter && !showStep2"
            :user="refName"
            @gotoStep2="activateStep2"
          ></step1>
          <step2
            v-else
            :email="userInfo.email || ''"
            :skip-to-email="showStep2"
            :is-loading="newsletterLoading"
            @subscribe="subscribe"
          ></step2>
        </slide-transition>
      </div>
    </div>
    <modal

      :title="$t(`modals.${updateResponse.status}.title`)"
      :show="showModal"
      :center="true"
      @close="showModal = false"
    >
      <template v-if="updateResponse.status === 'pending'">
        <pending-modal-content
          @close="showModal = false"
        />
      </template>
      <template v-if="updateResponse.status === 'subscribe'">
        <subscribe-modal-content
          :loading="privateIDLoading"
          :email="recoverEmail"
          :success="successRecoverEmail"
          @recover="recoverPrivatLink"
        />
      </template>
    </modal>
    <info-box v-if="hasEmail && userInfo.cofirmedEmail">
      {{ $t('home.alreadyRegistered.text') }}
      <router-link
        class="bg-white text-mantra block no-underline px-3 py-2 rounded whitespace-no-wrap"
        :to="{ name: 'ReferPage', params: { privateID}}"
      >
        {{ $t('home.alreadyRegistered.viewRewards') }}
      </router-link>
    </info-box>
  </base-frame>
</template>

<script>
import BaseFrame from '@/components/Base'
import SlideTransition from '@/components/SlideTransition'
import CountdownHome from '@/components/Countdown/CountdownHome'
import Modal from '@/components/Modal'
import InfoBox from '@/components/InfoBox'
import { Step1, Step2 } from '@/components/Steps'
import SubscribeModalContent from '@/components/ModalContent/Subscribe'
import PendingModalContent from '@/components/ModalContent/Pending'
import Cookie from 'js-cookie'

export default {
  name: 'Home',
  components: {
    Step1,
    Step2,
    SubscribeModalContent,
    PendingModalContent,
    BaseFrame,
    CountdownHome,
    Modal,
    InfoBox,
    SlideTransition
  },

  sockets: {
    connect () {
      const inviteID = this.$route.params.inviteID
      if (inviteID) {
        this.$socket.emit('livteVisit', inviteID)
      }
    }
  },

  data () {
    return {
      successRecoverEmail: false,
      recoverEmail: '',
      refName: undefined,
      privateID: false,
      showNewsletter: false,
      showCountdown: true,
      privateIDLoading: false,
      inviteID: undefined,
      showModal: false
    }
  },

  computed: {
    newsletterLoading () {
      return this.$store.state.user.isLoading
    },

    countdownIsOver () {
      return this.$store.getters['countdownIsOver']
    },
    time () {
      return this.$store.state.app.countdown
    },
    userInfo () {
      return this.$store.state.user.userInfo
    },
    hasEmail () {
      return this.userInfo.hasOwnProperty('email')
    },
    showStep2 () {
      // console.log(this.user.hasOwnProperty('email'))
      return this.userInfo.hasOwnProperty('firstName') && !this.hasEmail
    },

    updateResponse () {
      return this.$store.state.user.updateResponse
    }
  },
  // Todo: Handle alles in fetch methode
  async asyncData ({ redirect, route, req, res, $http, error }) {
    if (route.query.private) {
    }

    let isBot = false
    if (process.server) {
      isBot = req.useragent.isBot
    }

    const inviteID = route.params.refID
    if (!inviteID) return

    const visitedRefsCookie = process.server
      ? req.cookies.visited
      : Cookie.get('visited')

    const privateID = process.server
      ? req.cookies.privateID
      : Cookie.get('privateID')
    const parsedCookie = visitedRefsCookie ? JSON.parse(visitedRefsCookie) : []
    const alreadyCounted = parsedCookie.find(id => id === inviteID)

    try {
      const response = await $http.post(`api/v1/checkRef/${inviteID}`, {
        alreadyCounted,
        privateID,
        isBot
      })
      const counted = response.data.counted
      if (counted) {
        if (!alreadyCounted) {
          parsedCookie.push(inviteID)
        }

        const newCookies = JSON.stringify(parsedCookie)

        process.server
          ? res.cookie('visited', newCookies)
          : Cookie.set('visited', newCookies)
      }
      return {
        refName: response.data.refName,
        inviteID
      }
    } catch (error) {
      redirect({
        name: 'HomePage'
      })
    }
  },

  async fetch ({ store, req, redirect, route }) {
    const privateID = process.server
      ? req.cookies.privateID
      : Cookie.get('privateID')

    if (!privateID) return

    try {
      await store.dispatch('user/fetch', { privateID })
    } catch (error) {}
  },

  mounted () {
    if (this.inviteID) {
      this.$socket.io.opts.query.inviteID = this.inviteID
      this.$socket.open()
    }
    this.privateID = Cookie.get('privateID')
  },

  created () {
    if (this.time <= 0) {
      this.showCountdown = false
    }
  },

  methods: {
    activateStep2 () {
      this.showNewsletter = true
      this.$ga.event('home', 'activateNewsletterStep2')
    },

    async subscribe (form) {
      this.$store.dispatch('loading/start')
      const refID = this.$route.params.invite || null
      const email = form.email
      this.recoverEmail = email
      this.$ga.event('home', 'subscribe')

      const privateID = Cookie.get('privateID')

      if (!privateID) {
        this.showNewsletter = false
        return
      }
      await this.$store.dispatch('user/update', { privateID, refID, email })

      if (!this.updateResponse.error) {
        if (this.updateResponse.redirect) {
          this.$router.push({
            name: 'ReferPage',
            ...this.updateResponse.redirect
          })
        } else if (this.updateResponse.modal) {
          Cookie.remove('privateID')
          this.showModal = true
        }
        // Error
      } else {
      }
      this.$store.dispatch('loading/stop')
    },

    async recoverPrivatLink (email) {
      try {
        this.privateIDLoading = true
        await this.$http.post(`/api/v1/recover`, { email })
        this.successRecoverEmail = true
      } catch (error) {
        this.successRecoverEmail = false
      } finally {
        this.privateIDLoading = false
      }
    }
  }
}
</script>
<style lang="postcss" scoped>
@screen md {
  .newsletter {
    min-height: 330px;
    padding: 0;
  }
}

.newsletter {
  padding: 70px 0;
}

.transparent-bg {
  background: rgba(0, 0, 0, 0.5);
}

.newsletter {
  background: linear-gradient(134deg, #e52d55 0%, #f17187 100%);
}
</style>
