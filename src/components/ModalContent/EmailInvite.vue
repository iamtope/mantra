<template>
  <div class="email-invite">
    <div class="body">
      <div class="px-6 pb-6">
        Invite deine Freunde
        <form
          action="api/v1/invite"
          method="post"
        >
          <div class="form-group relative w-full">
            <no-ssr>
              <tags-input
                v-model="emails"
                placeholder="Email"
                element-id="tags"
                :validate="validateEmail"
              ></tags-input>
            </no-ssr>
            <small>Email eingeben und mit Enter bestätigen</small>
            <tooltip
              :full="true"
              :icon="true"
              :add-tags-on-comma="true"
              :show="showInvalidEmail"
              msg="Bitte geben sie eine gültige Email ein"
            />
          </div>
        </form>
      </div>
    </div>
    <mantra-button
      class="block w-full text-center link"
      @click.native="$emit('inviteFriends', emails)"
    >
      {{ emails.length }} Freunde einladen.
    </mantra-button>
  </div>
</template>

<script>
import MantraButton from '@/components/MantraButton'
import isEmail from 'isemail'
import Tooltip from '@/components/Tooltip'

export default {
  name: 'InviteModalContent',

  components: {
    MantraButton,
    Tooltip
  },

  props: {
    initialLength: {
      type: Number,
      reuired: false,
      default: 3
    },

    success: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      emails: [
        'marko@renka.de',
        'sh4fty@gmail.com',
        'rene2@renka.de',
        'rene@renka.de'
      ],
      showInvalidEmail: false
    }
  },

  methods: {
    validateEmail (email) {
      const isValid = isEmail.validate(email)
      this.showInvalidEmail = !isValid
      return isValid
    }
  }
}
</script>

<style lang="postcss">
.link {
  border-radius: 0.8rem;
  @apply py-6 rounded-t-none border-t-0 justify-center normal-case text-sm;

  transform: translateY(1px);
}
/* The input */
.tags-input {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.tags-input input {
  flex: 1;
  background: transparent;
  border: none;
}

.tags-input input:focus {
  outline: none;
}

.tags-input input[type='text'] {
  color: #495057;
}

.tags-input-wrapper-default {
  padding: 0.5rem 0.25rem;

  background: #fff;

  border: 1px solid transparent;
  border-radius: 0.25rem;
  border-color: #dbdbdb;
}

/* The tag badges & the remove icon */
.tags-input span {
  margin-right: 0.3rem;
}

.tags-input-remove {
  cursor: pointer;
  position: relative;
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  overflow: hidden;
}

.tags-input-remove:before,
.tags-input-remove:after {
  content: '';
  position: absolute;
  width: 100%;
  top: 50%;
  left: 0;
  background: #5dc282;

  height: 2px;
  margin-top: -1px;
}

.tags-input-remove:before {
  transform: rotate(45deg);
}
.tags-input-remove:after {
  transform: rotate(-45deg);
}

/* Tag badge styles */
.tags-input-badge {
  display: inline-block;
  padding: 0.25em 0.4em;

  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.tags-input-badge-pill {
  padding-right: 0.6em;
  padding-left: 0.6em;
  border-radius: 10rem;
}

.tags-input-badge-selected-default {
  color: #212529;
  background-color: #f0f1f2;
}

/* Typeahead - badges */
.typeahead-badges > span {
  cursor: pointer;
  margin-right: 0.3rem;
}

/* Typeahead - dropdown */
.typeahead-dropdown {
  list-style-type: none;
  padding: 0;
  margin: 0;
  position: absolute;
  width: 100%;
}

.typeahead-dropdown li {
  padding: 0.25rem 1rem;
  cursor: pointer;
}

/* Typeahead elements style/theme */
.tags-input-typeahead-item-default {
  color: #fff;
  background-color: #343a40;
}

.tags-input-typeahead-item-highlighted-default {
  color: #fff;
  background-color: #007bff;
}
</style>
