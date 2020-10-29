<template>
  <div class="form-group relative">
    <input
      ref="textField"
      :value="value"
      class="bg-white newsletter-form form-field focus:outline-none focus text-input rounded-lg block w-full"
      :class="{ 'has-error': errorState }"
      required
      :type="type"
      v-bind="$attrs"
      @input="handleInput"
      @keyup.enter="submitEnter"
      v-on="selectOnFocus ? { focus: handler } : {}"
    />
    <transition name="slide-fade">
      <mantra-button
        :class="{ small: smallButton, 'opacity-25': disableButton }"
        :disabled="disableButton"
        :is-loading="isLoading"
        class="submit-button border-white rounded-lg"
        type="button"
        @click.native.prevent="$emit('btnClicked', value)"
      >
        <slot />
      </mantra-button>
    </transition>
  </div>
</template>

<script>
import MantraButton from './MantraButton'

export default {
  name: 'TextField',

  components: {
    MantraButton
  },

  inheritAttrs: false,

  props: {
    value: { type: String, required: true },

    errorState: { type: Boolean, required: false },

    selectOnFocus: {
      type: Boolean,
      default: false
    },

    type: {
      required: false,
      type: String,
      default: 'text'
    },

    smallButton: {
      required: false,
      default: false,
      type: Boolean
    },

    disableButton: {
      required: false,
      default: false,
      type: Boolean
    },

    setFocus: {
      required: false,
      default: false,
      type: Boolean
    }
  },
  computed: {
    isLoading () {
      return this.$store.state.loading.is
    }
  },

  watch: {
    setFocus: {
      immediate: true,
      async handler (val) {
        if (process.client) {
          await this.$nextTick()
          if (val) {
            this.$refs.textField.focus()
          }
        }
      }
    }
  },
  methods: {
    handleInput (e) {
      this.$emit('input', e.target.value)
    },

    handler (event) {
      event.target.select()
    },

    submitEnter () {
      if (!this.disableButton) {
        this.$emit('btnClicked', this.value)
      }
    }
  }
}
</script>

<style lang="scss">
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.6s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.text-input {
  height: 65px;
  transition: box-shadow ease-in 0.3s;
  padding: 0 10px;
  &.has-error {
    box-shadow: 0 0 0 0.2rem #dc3545;
    &::placeholder {
      color: #dc3545;
    }
  }
  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(#890d22, 0.25);
  }
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
