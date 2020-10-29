<template>
  <transition name="slide-fade">
    <div
      v-if="show"
      class="block text-red  error-msg flex items-center"
      :class="{'w-full': full}"
    >
      <svg
        v-show="icon"
        class="mr-2"
        style="width:24px;height:24px"
        viewBox="0 0 24 24"
      >
        <path
          fill="#dc3545"
          d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16"
        />
      </svg>
      <div class="body-tooltip">
        {{ msg }}
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Tooltip',

  props: {
    show: {
      required: true,
      type: Boolean
    },

    full: {
      type: Boolean,
      required: false,
      default: false
    },

    icon: {
      type: Boolean,
      default: false
    },

    msg: {
      type: String,
      required: true
    },

    timeout: {
      type: Number,
      required: false,
      default: 0
    }
  },

  data: () => ({
    timer: undefined
  }),

  watch: {
    show (val, oldVal) {
      if (!val) {
        this.$emit('close')
        clearTimeout(this.timer)
      }

      if (val && this.timeout) {
        this.timer = setTimeout(() => {
          this.$emit('close')
        }, this.timeout)
      }
    }
  },

  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="postcss" scoped>
@screen md {
  .error-msg {
    left: 50%;
    transform: translateX(-50%);
  }
}

.error-msg {
  background: #3b4d67;
  z-index: 30;
  position: absolute;

  color: white;
  padding: 20px;
  border-radius: 8px;

  animation: float 4s ease-in-out infinite;

  top: calc(-100% - 6px);
  &:after {
    top: 100%;
    left: 50%;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(136, 183, 213, 0);
    border-top-color: #3b4d67;
    border-width: 12px;
    margin-left: -12px;
  }
}

@keyframes float {
  0% {
    box-shadow: 0 5px 5px 0px rgba(0, 0, 0, 0.3);
    transform: translateY(0px);
  }
  50% {
    box-shadow: 0 25px 5px 0px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
  }
  100% {
    box-shadow: 0 5px 5px 0px rgba(0, 0, 0, 0.3);
    transform: translateY(0px);
  }
}

@screen md {
  @keyframes float {
    0% {
      box-shadow: 0 5px 5px 0px rgba(0, 0, 0, 0.3);
      transform: translateY(0px) translateX(-50%);
    }
    50% {
      box-shadow: 0 25px 5px 0px rgba(0, 0, 0, 0.1);
      transform: translateY(-5px) translateX(-50%);
    }
    100% {
      box-shadow: 0 5px 5px 0px rgba(0, 0, 0, 0.3);
      transform: translateY(0px) translateX(-50%);
    }
  }
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
