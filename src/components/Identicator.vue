<template>
  <div class="indicator flex md:block justify-between md:h-auto">
    <div
      v-if="requirements && requirements.length > 0"
      class="indenticators relative md:flex"
    >
      <div class="md:absolute level hidden md:block">{{ $t('friendsRequired') }}</div>
      <div
        v-for="requirement in requirements"
        :key="requirement.requires"
        class="step-identicator-wrapper md:w-1/4 md:flex justify-end"
      >
        <div
          :class="counter >= requirement.requires ? 'active': 'inactive'"
          class="step-identicator flex text-white justify-center items-center"
        >{{ requirement.requires }}</div>
      </div>
    </div>
    <div class="progress-wrapper">
      <div class="progress-base progress-rail progress-bar md:my-6">
        <div
          :class="widhtOrHeight"
          :style="{[widhtOrHeight]: progress}"
          class="current-progress"
        />
      </div>
    </div>
    <div class="infos flex flex-col md:flex-row justify-between md:justify-start">
      <div
        v-for="requirement in requirements"
        :key="requirement.requires"
        class="info md:w-1/4 md:flex justify-center"
      >
        <img
          :alt="requirement.info"
          :src="requirement.image"
        >
        <span class="info-text md:w-2/3 inline-block hidden">{{ requirement.info }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Identicator',

  props: {
    requirements: {
      type: Array,
      required: true,
      default: () => []
    },

    counter: {
      type: Number,
      required: true
    }
  },

  data () {
    return {}
  },

  computed: {
    widhtOrHeight () {
      const bigSizes = ['md', 'xl', 'lg']
      return bigSizes.includes(this.$mq) ? 'width' : 'height'
    },

    progress () {
      let step = 0
      let width = 0
      const requirementsLength = this.requirements.length
      const lastCount = this.requirements[requirementsLength - 1].requires

      if (this.counter >= lastCount) {
        return `100%`
      }

      const inc = 100 / this.requirements.length
      for (let requirement of this.requirements) {
        if (this.counter >= requirement.requires) {
          step++
        }
      }

      let stepwidth = step * inc
      const innersteps =
        step === 0
          ? inc / this.requirements[0].requires
          : inc /
            (this.requirements[step].requires -
              this.requirements[step - 1].requires)
      const innerstepwidth =
        innersteps *
        (step === 0
          ? this.counter
          : this.counter - this.requirements[step - 1].requires)

      width = stepwidth + innerstepwidth

      return `${width}%`
    }
  }
}
</script>

<style lang="postcss" scoped>
.step-identicator {
  border-radius: 50%;
  height: 32px;
  width: 32px;
  font-weight: 700;
  z-index: 2;
  box-sizing: border-box;
  /* box-shadow: 0 0 0 0 rgba(#e52d55, 0.5);
  -webkit-animation: pulse 1.5s infinite;*/
  margin-top: 109px;

  transform: translateY(16px);
  transition: opacity 0.5s;
  background: linear-gradient(-134deg, #e52d55, #f17187);
}

@screen md {
  .step-identicator {
    transform: translateX(16px);
    margin-top: inherit;
  }
  div:last-child > .step-identicator {
    transform: translateX(0) translateY(0);
  }
}

.inactive {
  opacity: 0.5;
}

@screen md {
  .info-text {
    @apply w-1/3 text-center;
  }
}

.info {
  //  height: 32px;

  display: flex;
  flex-direction: column;
  // width: 100%;
  transform: translateY(16px);
  margin-top: 109px;
}
@screen md {
  .info {
    transform: translateX(50%) translateY(0);
    // display: block;
    flex-direction: row;
    margin-top: inherit;
  }
}

@screen md {
  .info:last-child {
    transform: inherit;

    @apply justify-end;
    .info-text {
      text-align: right;
    }
  }
}

.level {
  top: 50%;
  transform: translateY(-50%);
}

.progress-bar {
  background: rgba(#e52d55, 0.2);

  //minheight: 100%;
  width: 10px;
  position: relative;
  /* &:after {
    position: absolute;
    content: '';
    background: green;
    height: 16px;
    width: 10px;
    bottom: -16px;
  }*/
}
.current-progress {
  @apply bg-mantra;
  transition: all 1s ease-in-out;
  opacity: 0.5;
  width: 10px;
}

.current-progress.height {
  width: 10px;
}
.current-progress.width {
  height: 10px;
}

.progress-base {
  height: calc(100% + 16px);
}

@screen md {
  .progress-base {
    height: 10px;
  }
  .progress-bar {
    background: rgba(#e52d55, 0.2);

    width: 100%;
  }
}

@keyframes pulse {
  0% {
    @include transform(scale(0.9));
  }
  70% {
    @include transform(scale(1));
    box-shadow: 0 0 0 20px rgba(#e52d55, 0);
  }
  100% {
    @include transform(scale(0.9));
    box-shadow: 0 0 0 0 rgba(#e52d55, 0);
  }
}
</style>
