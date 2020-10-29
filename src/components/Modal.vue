<template>
  <transition name="fade">
    <div
      v-show="show"
      class="modal-outer"
    >
      <div
        class="modal"
        :class="{'center': center}"
      >
        <transition
          name="slide"
        >
          <div
            v-show="show"
            class="modal-dialog"
          >
            <div class="modal-content">
              <header class="modal-header p-6">
                <h5 class="modal-title">
                  {{ title }}
                </h5>
                <button
                  v-if="closeable"
                  type="button"
                  aria-label="Close"
                  class="close"
                  @click="close"
                >
                  ×
                </button>
              </header>
              <slot>No Content provided</slot>
            </div>
          </div>
        </transition>
      </div>
      <div
        class="modal-backdrop"
        @click="close"
      />
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',

  props: {
    show: {
      type: Boolean,
      default: false
    },

    title: {
      type: String,
      required: false,
      default: ''
    },

    closeable: {
      default: true,
      type: Boolean
    },

    center: {
      required: false,
      default: false,
      type: Boolean
    }
  },

  watch: {
    show (isOpen) {
      if (isOpen) {
        document.documentElement.style.overflow = 'hidden'
        document.body.addEventListener('touchstart', this.disableBodyScroll)
      } else {
        document.documentElement.style.overflow = 'auto'
        document.removeEventListener('touchstart', this.disableBodyScroll)
      }
    }
  },

  mounted () {
    document.addEventListener('keydown', this.closeModalWithEsc)
  },

  destroyed () {
    document.removeEventListener('keydown', this.closeModalWithEsc)
  },

  methods: {
    close () {
      if (!this.closeable) return
      this.$emit('close', true)
    },

    closeModalWithEsc (e) {
      if (!this.closeable) return
      if (e.keyCode === 27 && this.show) {
        this.$emit('close', true)
      }
    },

    disableBodyScroll (e) {
      e.preventDefault()
    }
  }
}
</script>

<style lang="scss">
.close {
  float: right;
  font-size: 24px;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  padding: 1rem;
  background-color: transparent;
  border: 0;
  margin: -16px -16px -16px auto;
  -webkit-appearance: none;
  cursor: pointer;
  text-shadow: 0 1px 0 #fff;
  opacity: 0.5;
}

.modal-title {
  margin-bottom: 0;
  line-height: 1.5;
  font-size: 1.25rem;
}
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1072;
  pointer-events: none;
  outline: 0;
  margin: 0.5rem;
  &.center {
    top: 50%;
    transform: translateY(-50%);
  }
}
.modal-body {
  position: relative;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: 24px 16px;
}
.modal-dialog {
  position: relative;
  width: auto;

  max-width: 500px;
  margin: 1.75rem auto;
}

.modal-backdrop {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  z-index: 1070;
  position: fixed;
  background: rgba(0, 0, 0, 0.3);
}
.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;

  border-radius: 0.8rem;

  outline: 0;
}
.modal-header {
  display: flex;
  justify-content: space-between;
}
/* -- slideDown -- */

@keyframes slide-enter {
  from {
    transform: translate3d(0, -100px, 0);
  }
}

.slide-enter-active {
  animation: slide-enter both cubic-bezier(0.4, 0, 0, 1.5);
  animation-duration: 300ms;
}

@keyframes slide-leave {
  to {
    transform: translate3d(0, -100px, 0);
  }
}

.slide-leave-active {
  animation: slide-leave both;
  animation-duration: 300ms;
}

/* -- fade -- */

@keyframes vodal-fade-enter {
  from {
    opacity: 0;
  }
}

.fade-enter-active {
  animation: vodal-fade-enter both ease-in;
  animation-duration: 100ms;
}

@keyframes vodal-fade-leave {
  to {
    opacity: 0;
  }
}

.fade-leave-active {
  animation: vodal-fade-leave both ease-out;
  animation-duration: 100ms;
}
</style>
