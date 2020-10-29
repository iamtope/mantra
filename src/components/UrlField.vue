<template>
  <div
    class="form-group relative flex"
  >
    <div
      v-if="editable"
      class="editable flex"
    >
      <div
        class="prefix bg-white rounded-lg rounded-r-none form-field flex items-center pl-4 text-base tracking-normal leading-normal"
      >
        {{ prefix }}
      </div>
      <input
        ref="inputField"
        v-model="cleanValue"
        :maxlength="maxLength"
        class="form-field text-base block w-full  outline-none text-base"
        required
        type="text"

        @keyup.enter="updateInviteID"
      />
    </div>
    <div
      v-else
      class="full-input w-full"
    >
      <input
        ref="fullLinkInput"
        :value="fullLink"
        class="text-mantra-main form-field rounded-lg pl-4 rounded-r-none block w-full h-full outline-none"
        readonly
        type="text"
      />
    </div>
    <div
      class="suffix bg-grey-lightest rounded-lg rounded-l-none form-field flex items-center px-2"
    >
      <button
        v-if="!editable"
        class="edit-icon outline-none focus:outline-none p-2 mr-2"
        @click="makeEditable"
      >
        <edit-icon
          :style="iconSizeStyle"
          class="edit-icon"
          :class="editable ? 'text-mantra' : 'text-mantra-transparent'"
        >
        </edit-icon>
      </button>
      <button
        v-if="!editable"
        style="line-height:0"
        class="edit-icon outline-none focus:outline-none  bg-mantra-blue rounded-lg p-2"
        @click="copyLink"
      >
        <copy-icon
          :style="iconSizeStyle"
          class="text-white"
        >
        </copy-icon>
      </button>
      <div
        v-if="editable"
        class="editable-group flex"
      >
        <button
          type="button"
          class="edit-icon outline-none focus:outline-none  p-2 mr-2"
          @click="updateInviteID"
        >
          <check-icon
            :style="iconSizeStyle"
            class="edit-icon text-green"
          >
          </check-icon>
        </button>
        <button
          type="button"
          class="edit-icon outline-none focus:outline-none  p-2"
          @click="editable = false, newInviteID = value"
        >
          <cancel-icon
            :style="iconSizeStyle"
            class="edit-icon text-red"
          >
          </cancel-icon>
        </button>
      </div>
      <tooltip
        :icon="true"
        :show="updateFailed"
        msg="Failed"
      ></tooltip>
      <tooltip
        :show="copied"
        :timeout="5000"
        :msg="copyMessage"
        @close="copied=false"
      ></tooltip>
    </div>
  </div>
</template>

<script>
import EditIcon from '@/assets/icons/edit.svg'
import vClickOutside from 'v-click-outside'
import CancelIcon from '@/assets/icons/cancel.svg'
import CheckIcon from '@/assets/icons/check.svg'
import CopyIcon from '@/assets/icons/copy.svg'
import slugify from 'slugify'
import Tooltip from '@/components/Tooltip'
export default {
  name: 'UrlField',

  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    CopyIcon,
    EditIcon,
    CancelIcon,
    CheckIcon,
    Tooltip
  },
  inheritAttrs: false,
  props: {
    value: { type: String, required: true },
    errorState: { type: Boolean, required: false },
    selectOnFocus: {
      type: Boolean,
      default: false
    },
    prefix: {
      type: String,
      required: false,
      default: undefined
    },
    smallButton: {
      required: false,
      default: false,
      type: Boolean
    },

    maxLength: {
      type: Number,
      default: 20,
      required: false
    }
  },
  data: () => ({
    editable: false,
    newInviteID: '',
    originalInviteID: '',
    EditIcon,
    copied: false,
    copyMessage: ''
  }),

  computed: {
    updateFailed () {
      return this.$store.state.invite.inviteLinkUpdateFailed
    },

    fullLink () {
      return `${this.prefix}${this.value}`
    },

    iconSizeStyle () {
      return {
        height: '24px',
        width: '24px'
      }
    },

    cleanValue: {
      get () {
        return slugify(this.newInviteID)
      },
      set (value) {
        if (this.updateFailed) {
          this.$store.dispatch('invite/toggleInviteLinkUpdateFailed', false)
        }
        this.newInviteID = value
      }
    }
  },
  watch: {
    value (newVal) {
      this.newInviteID = newVal
      this.originalInviteID = newVal
    }
  },

  created () {
    this.newInviteID = this.value
    this.originalInviteID = this.value
  },

  methods: {
    async copyLink (val) {
      try {
        await this.$copyText(this.fullLink)
        this.copyMessage = this.$t('refer.linkCopied.succces')
        this.copied = true
        this.$ga.event('refer', 'copyLink')
      } catch (err) {
        this.copyMessage = this.$t('refer.linkCopied.failed')
      }
    },

    reset () {
      this.editable = false
      this.newInviteID = this.value
    },

    makeEditable () {
      this.editable = true
      this.copied = false
    },

    setFullURLFocus () {
      this.$refs.fullLinkInput.focus()
    },

    updateInviteID () {
      if (this.originalInviteID === this.newInviteID) {
        this.editable = false
        return
      }
      this.$emit('updateURL', this.cleanValue)
    }
  }
}
</script>

<style lang="postcss" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.edit-icon {
  transition: color 0.4s;
}
.slide-fade-leave-active {
  transition: all 0.6s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

.form-group {
  height: 65px;
}

.submit-button {
  height: 55px;
  right: 5px;
  top: 5px;
  padding: 0 30px;
  background: #5966d6;
  position: absolute;
  font-weight: 700;
  z-index: 3;
  &.small {
    padding: 0 10px;
  }
  &:focus {
    outline: none;
  }
  &:after {
    content: '';
    background: white;
    height: 100%;
    width: 10px;

    position: absolute;
    z-index: 2;
    right: 100%;
    top: 0;
  }
}
</style>
