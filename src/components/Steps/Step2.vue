<template>
  <form

    method="POST"
    @submit.prevent
  >
    <slide-transition>
      <div
        v-if="!showEmail && !skipToEmail"
        key="email"
        class="firstName-step"
      >
        <div class="mb-6">
          <h2 class="text-2xl font-bold uppercase text-white mb-2">
            {{ $t('home.steps.step2.firstName.title') }}
          </h2>
          <p class="text-white">
            {{ $t('home.steps.step2.firstName.text') }}
          </p>
        </div>
        <div class="relative">
          <text-field
            v-model.trim="form.firstName"
            class="w-full"
            :disable-button="!showNextButton"
            :set-focus="firstNameFocus"

            :placeholder="$t('home.steps.step2.firstName.inputPlaceholder')"
            @btnClicked="showNewsletterInput"
          >
            {{ $t('home.steps.step2.firstName.buttons.next') }}
          </text-field>
        </div>
      </div>
      <div
        v-else
        key="lastname"
        class="newsletter-step"
      >
        <div class="relative">

          <div class="mb-6">
            <i18n
              class="text-2xl font-normal uppercase text-white mb-2"
              path="home.steps.step2.firstName.hello"
              tag="h2"
            >
              <span
                place="name"
                class="font-bold"
              >{{ form.firstName }}</span>
            </i18n>

            <p class="text-white">
              {{ $t('home.steps.step2.email.askForEmail.p1') }}
            </p>
            <p class="text-white">
              {{ $t('home.steps.step2.email.askForEmail.p2') }}
            </p>
            <p class="text-white mt-4 text-xs">
              {{ $t('home.steps.step2.email.askForEmail.privacy') }}
            </p>
          </div>
          <div class="relative">
            <text-field
              v-model.trim="form.email"
              type="email"
              class="w-full"
              :disable-button="!isEmail || isEmailError"
              :set-focus="firstNameFocus"

              :error-state=" isEmailError"
              :placeholder="$t('home.steps.step2.email.inputPlaceholder')"
              @btnClicked="subscribe"
            >
              {{ $t('home.steps.step2.email.subscribe') }}
            </text-field>
            <tool-tip
              :show="isEmailError"
              :msg="emailError"
              :icon="true"
            />
          </div>
        </div>
      </div>
    </slide-transition>
  </form>
</template>

<script>
import TextField from '@/components/TextField'
import ToolTip from '@/components/Tooltip'
import isEmail from 'isemail'
import SlideTransition from '@/components/SlideTransition'

export default {
  name: 'NewsletterStep2',

  components: {
    ToolTip,
    TextField,
    SlideTransition
  },

  props: {
    emailError: {
      required: false,
      default: '',
      type: String
    },

    skipToEmail: {
      required: false,
      default: false,
      type: Boolean
    },

    email: {
      required: false,
      type: String,
      default: ''
    }
  },

  data: () => ({
    form: {
      email: '',
      firstName: ''
    },
    firstNameFocus: false,
    showEmail: false
  }),

  computed: {
    showNextButton () {
      return this.form.firstName.length > 1
    },

    isEmailError () {
      return this.emailError.length > 0
    },

    isEmail () {
      const email = this.form.email
      return isEmail.validate(email)
    },

    hasFirstName () {

      return (
        this.$store.getters['user/shouldShowStep2'] &&
        this.form.firstName === ''
      )
    }
  },

  watch: {
    'form.email' (val, oldVal) {
      if (val !== oldVal) {
        this.emailError = ''
      }
    },

    hasFirstName: {
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal) {
          this.form.firstName = this.$store.state.user.userInfo.firstName
        }
      }
    }
  },

  created () {
    this.firstNameFocus = true

    if (this.email.length > 0) {
      this.form.email = this.email
    }
  },

  methods: {
    subscribe () {
      this.$emit('subscribe', this.form)
    },

    async showNewsletterInput () {
      const refID = this.$route.params.refID
      const privateID = this.$route.query.private || false
      this.$store.dispatch('loading/start')
      await this.$store.dispatch('user/setFirstname', {
        firstName: this.form.firstName,
        refID,
        privateID
      })
      this.showEmail = true
      this.$ga.event('home', 'firstname')
      this.$store.dispatch('loading/stop')
    }
  }
}
</script>

<style lang="scss">
</style>
