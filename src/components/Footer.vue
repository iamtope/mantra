<template>
  <footer
    class="page-footer bg-mantra flex items-center justify-center md:justify-end px-4"
  >
    <div class="md:flex justify-end flex-wrap items-center">
      <ul class="list-reset md:flex">
        <router-link
          v-for="{ name, label } in footerItems"
          :key="name"
          class="uppercase text-sm text-center"
          tag="li"
          :to="{ name }"
        >
          <a class="link block">
            {{ label }}
          </a>
        </router-link>
      </ul>
      <div class="copyright text-white md:mt-0">
        {{ $t('footer.copyright') }}
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'PageFooter',

  computed: {
    footerItems () {
      return [
        {
          name: 'ImprintPage',
          label: this.$t('footer.imprint')
        },
        {
          name: 'PrivacyPage',
          label: this.$t('footer.privacy')
        },
        {
          name: 'TosPage',
          label: this.$t('footer.tos')
        }
      ]
    }
  }
}
</script>

<style lang="postcss">
.page-footer {
  background: linear-gradient(-134deg, #e52d55 0%, #f17187 100%);
  padding: 30px 0;
}

@screen md {
  .page-footer {
    min-height: 50px;
    padding: 0;
  }
}

.link {
  @apply no-underline text-white mr-4;
}
</style>
