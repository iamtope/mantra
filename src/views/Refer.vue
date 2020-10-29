<template>
  <base-frame image-header="/images/mantrahands.jpg">
    <div
      slot="header"
      class="px-4 max-w-4xl mx-auto flex h-full"
    >
      <div class="w-full xl:w-1/3 flex ml-auto items-center">
        <div class="header-inner w-full">
          <div class="text-white">
            <p class="text-center md:text-left">{{ $t('refer.info') }}</p>
          </div>
          <div class="form-group relative my-8">
            <tooltip
              :msg="copyMessage"
              :show="copySuccess"
              :timeout="2000"
              @close="copySuccess = false"
            />
            <url-field
              ref="urlField"
              :prefix="inviteLink"
              :select-on-focus="true"
              :value="userInfo.inviteID"
              readonly
              @updateURL="updateInviteID"
              @focus="$event.target.select()"
            >
              <svg
                style="width:24px;height:24px"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
                  fill="#FFF"
                ></path>
              </svg>
            </url-field>
          </div>
          <div class="social-sharing">
            <div class="text-white">
              <p class="text-center md:text-left">{{ $t('refer.infoOverLink') }}</p>
            </div>
            <social-sharing
              :description="$t('refer.social.description')"
              :networks="overriddenNetworks"
              :title="$t('refer.social.title')"
              :url="`${inviteLink}${userInfo.inviteID}`"
              inline-template
              quote="$t('refer.social.quote')"
            >
              <div class="flex justify-center md:justify-start mt-6">
                <network network="facebook">
                  <div
                    class="icon cursor-pointer"
                    style="width:24px; color:#3B5998"
                  >
                    <facebook />
                  </div>
                </network>

                <network
                  class="ml-6"
                  network="twitter"
                >
                  <div
                    class="icon cursor-pointer"
                    style="width:24px; color:#1DA1F2"
                  >
                    <twitter />
                  </div>
                </network>
                <no-ssr>
                  <network
                    class="ml-6"
                    network="whatsappFix"
                  >
                    <div
                      class="icon cursor-pointer"
                      style="width:24px; color:#25d366"
                    >
                      <whatsapp />
                    </div>
                  </network>
                </no-ssr>
              </div>
            </social-sharing>
          </div>
        </div>
      </div>
    </div>

    <div class="statistics px-4 py-12 md:py-16 max-w-4xl mx-auto">
      <h3
        class="text-center mb-16"
      >{{ $tc('refer.friends',user.subscriberCounter, {count: user.subscriberCounter}) }}</h3>
      <identicator
        :counter="user.subscriberCounter"
        :requirements="requirements"
      />
      <div class="container max-w-4xl mx-auto mt-16">

        <div class="flex -mx-4 flex-wrap">
          <div class="w-full lg:w-3/5 px-4">
            <activity-list
              v-if="true"
              :activities="user.activities"
            ></activity-list>
          </div>
          <div class="w-full lg:w-2/5 px-4">
            <stats
              :total-visits="user.anonymCount"
              :requirements="requirements"
              :potential="pendingCounter"
              :subscriber-count="user.subscriberCounter"
            />
          </div>
          <button @click="showEmailInvite = !showEmailInvite">Invite per Email</button>
        </div>
      </div>
    </div>

    <modal
      :show="showEmailInvite"
      title="InviteFriends"
      @close="showEmailInvite = false"
    >
      <invite-modal-content @inviteFriends="inviteFriendsByEmail">
      </invite-modal-content></modal>

    <modal
      :center="true"
      :closeable="!showThankYou"
      :show="showThankYou"
      :title="$t('refer.thankYouModal.title')"
      @close="showThankYou = false"
    >
      <div class="mb-4"></div>
    </modal>
    <ref-not-subscribed :show="!subscribed" />

  </base-frame>
</template>

<script>
import UrlField from '@/components/UrlField'
import Identicator from '@/components/Identicator'
import BaseFrame from '@/components/Base'
import Modal from '@/components/Modal'
import Tooltip from '@/components/Tooltip'
import ActivityList from '@/components/Activity/List'
import RefNotSubscribed from '@/components/RefNotSubscribed'
import Stats from '@/components/Stats'

import InviteModalContent from '@/components/ModalContent/EmailInvite'
export default {
  name: 'Refer',

  head () {
    return {
      title: this.$tc('refer.friends', this.user.subscriberCounter, {
        count: this.user.subscriberCounter
      }),
      meta: [{ content: 'noindex', name: 'robots' }]
    }
  },

  components: {
    Identicator,
    BaseFrame,
    UrlField,
    Tooltip,
    Modal,
    ActivityList,
    RefNotSubscribed,
    Stats,
    InviteModalContent
  },

  data: () => ({
    error: {
      state: false,
      msg: '',
      code: ''
    },

    newInviteID: '',
    copyMessage: '',
    copySuccess: false,
    showThankYou: false,
    firstName: '',
    successResub: false,
    showEmailInvite: false
  }),

  computed: {
    inviteLink () {
      return `${process.env.VUE_APP_URL}/r/`
    },
    updateFailed () {
      return this.$store.state.user.inviteLinkUpdateFailed
    },

    subscribed () {
      return this.userInfo.status === 'subscribe'
    },

    requirements () {
      return this.$store.state.requirements.all
    },
    userInfo () {
      return this.user.userInfo
    },
    user () {
      return this.$store.state.user
    },

    pendingCounter () {
      if (this.user.activities.length > 0) {
        return this.user.activities.filter(user => user.status === 'pending')
          .length
      } else {
        return 0
      }
    }
  },

  asyncData () {
    return {
      overriddenNetworks: {
        whatsappFix: {
          sharer: `https://api.whatsapp.com/send?text=@description%0D%0A@url`,
          type: 'popup',
          action: 'share/whatsapp/share'
        }
      }
    }
  },

  async fetch ({ redirect, route, store, error }) {
    // Todo: check if reponse is not 404 and privateLink is set in route.params

    if (!route.params.privateID) return redirect({ name: 'HomePage' })

    try {
      await store.dispatch('requirements/fetch')
      await store.dispatch('user/fetchExtended', route.params.privateID)
    } catch (error) {
      if (
        (error.response && error.response.status === 404) ||
        error.message === 'EMAIL_NOT_CONFIRMED'
      ) {
        return redirect({ name: 'HomePage' })
      }
    }
  },

  sockets: {
    connect (client) {
      this.$socket.emit('join', this.userInfo.privateID)
    }
  },

  mounted () {
    //  Cookie.set('token', this.user.privateLink)
    this.$socket.open()
    this.$socket.io.opts.query.privateID = this.$route.params.privateID

    this.$root.$on('social_shares_open', function (network, url) {
      this.$ga.social({
        socialNetwork: network,
        socialAction: 'open',
        socialTarget: url
      })
    })
  },

  methods: {
    async updateInviteID (newInviteID) {
      try {
        await this.$store.dispatch('invite/updateInviteID', {
          privateID: this.userInfo.privateID,
          newInviteID
        })

        this.$refs.urlField.reset()
      } catch (error) {}
    },
    async inviteFriendsByEmail (emails) {
      const { privateID, inviteID } = this.userInfo

      this.$store.dispatch('invite/users', {
        privateID,
        emails,
        inviteID
      })
    }
  }
}
</script>

<style lang="postcss" scoped>
@screen md {
  .statistics {
    height: auto;
  }
}
</style>
