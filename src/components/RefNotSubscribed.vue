<template>
  <SlideXRightTransition>
    <div
      v-if="show"
      class="toast-wrapper"
    >
      <div
        class="toast toast--blue flex items-center"
      >
        <div class="toast__icon mr-4">
          <email-icon></email-icon>
        </div>

        <div

          class="toast__content text-sm "
        >
          <p class="toast__type text-grey-dark">
            {{ $t('refer.notSubscribed.title') }}
          </p>
          {{ $t('refer.notSubscribed.text') }}
        </div>

      </div>

    </div>
  </SlideXRightTransition>
</template>

<script>
import EmailIcon from '@/assets/icons/email.svg'
import { SlideXRightTransition } from 'vue2-transitions'

export default {
  name: 'RefNotSubscribed',

  components: {
    EmailIcon,
    SlideXRightTransition
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },

    showSuccessText: { type: Boolean, default: false }
  }
}
</script>

<style lang="postcss" scoped>
.resublink {
  background: #e52d55;

  color: white;
  padding: 2px 4px;
  border-radius: 2px;
}
.toast-wrapper {
  position: fixed;
  right: 0;
  width: 100%;
  top: 0;
  z-index: 30;
}

@screen md {
  .toast-wrapper {
    right: 20px;
    top: 20px;
    width: auto;
  }
}

.toast--blue:before {
  background-color: #ed7899;
}

.toast {
  text-align: left;
  padding: 20px;
  background-color: #fff;
  border-radius: 0;
  width: 100%;

  top: 0px;
  background: #fff;
  padding-left: 20px;
  position: relative;
  box-shadow: 1px 7px 14px -5px rgba(0, 0, 0, 0.2);
}

@screen md {
  .toast {
    transform: translatey(0px);
    animation: float 6s ease-in-out infinite;
    max-width: 500px;
    border-radius: 4px;
  }
}

@screen md {
  .toast:before {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
}
.toast:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;

  width: 4px;
  height: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.toast__type {
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 3px;
  color: #4b456f;
}

.toast__message {
  font-size: 14px;
  margin-top: 0;
  margin-bottom: 0;
  color: #88889b;
}

@keyframes float {
  0% {
    box-shadow: 1px 7px 14px -5px rgba(0, 0, 0, 0.6);
    transform: translatey(0px);
  }
  50% {
    box-shadow: 1px 7px 14px -5px rgba(0, 0, 0, 0.2);
    transform: translatey(-10px);
  }
  100% {
    box-shadow: 1px 7px 14px -5px rgba(0, 0, 0, 0.6);
    transform: translatey(0px);
  }
}
</style>
