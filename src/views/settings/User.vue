<template>
  <div>
    <form @submit="save" class="card">
      <div class="card-title">
        <h2 v-if="user.id === 0">{{ $t('settings.newUser') }}</h2>
        <h2 v-else>{{ $t('settings.user') }} {{ user.username }}</h2>
      </div>

      <div class="card-content">
        <p>
          <label for="username">{{ $t('settings.username') }}</label>
          <input type="text" v-model="user.username" id="username">
        </p>

        <p>
          <label for="password">{{ $t('settings.password') }}</label>
          <input type="password" :placeholder="passwordPlaceholder" v-model="user.password" id="password">
        </p>

        <p>
          <label for="scope">{{ $t('settings.scope') }}</label>
          <input type="text" v-model="user.scope" id="scope">
        </p>

        <p>
          <label for="locale">{{ $t('settings.language') }}</label>
          <languages id="locale" :selected.sync="user.locale"></languages>
        </p>

        <p><input type="checkbox" :disabled="user.perm.admin" v-model="user.lockPassword"> {{ $t('settings.lockPassword') }}</p>

        <h3>{{ $t('settings.permissions') }}</h3>
        <p class="small">{{ $t('settings.permissionsHelp') }}</p>

        <p><input type="checkbox" v-model="user.perm.admin"> {{ $t('settings.administrator') }}</p>

        <p><input type="checkbox" :disabled="user.perm.admin" v-model="user.perm.create"> {{ $t('settings.perm.create') }}</p>
        <p><input type="checkbox" :disabled="user.perm.admin" v-model="user.perm.delete"> {{ $t('settings.perm.delete') }}</p>
        <p><input type="checkbox" :disabled="user.perm.admin" v-model="user.perm.download"> {{ $t('settings.perm.download') }}</p>
        <p><input type="checkbox" :disabled="user.perm.admin" v-model="user.perm.edit"> {{ $t('settings.perm.edit') }}</p>
        <p><input type="checkbox" :disabled="user.perm.admin" v-model="user.perm.execute"> {{ $t('settings.perm.execute') }}</p>
        <p><input type="checkbox" :disabled="user.perm.admin" v-model="user.perm.rename"> {{ $t('settings.perm.rename') }}</p>
        <p><input type="checkbox" :disabled="user.perm.admin" v-model="user.perm.share"> {{ $t('settings.perm.share') }}</p>

        <h3>{{ $t('settings.userCommands') }}</h3>
        <p class="small">{{ $t('settings.userCommandsHelp') }} <i>git svn hg</i>.</p>
        <input type="text" v-model.trim="user.perm.commands">

        <h3>{{ $t('settings.rules') }}</h3>

        <p class="small">{{ $t('settings.rulesHelp1') }}</p>

        <i18n path="settings.rulesHelp2" tag="p" class="small">
          <code>allow</code><code>disallow</code><code>regex</code>
        </i18n>

        <p class="small"><strong>{{ $t('settings.examples') }}</strong></p>

        <ul class="small">
          <li><code>disallow regex [\\\/]\..+</code> - {{ $t('settings.ruleExample1') }}</li>
          <li><code>disallow /Caddyfile</code> - {{ $t('settings.ruleExample2') }}</li>
        </ul>

        <textarea v-model.trim="user.rules"></textarea>
      </div>

      <div class="card-action">
        <button
          v-if="user.id !== 0"
          @click.prevent="deletePrompt"
          type="button"
          class="flat delete"
          :aria-label="$t('buttons.delete')"
          :title="$t('buttons.delete')">{{ $t('buttons.delete') }}</button>
        <input
          class="flat"
          type="submit"
          :value="$t('buttons.save')">
      </div>
    </form>

    <div v-if="$store.state.show === 'deleteUser'" class="card floating">
      <div class="card-content">
        <p>Are you sure you want to delete this user?</p>
      </div>

      <div class="card-action">
        <button class="cancel flat"
          @click="closeHovers"
          v-focus
          :aria-label="$t('buttons.cancel')"
          :title="$t('buttons.cancel')">
          {{ $t('buttons.cancel') }}
        </button>
        <button class="flat"
          @click="deleteUser">
          {{ $t('buttons.delete') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { users as api } from '@/api'
import Languages from '@/components/Languages'

const emptyUser = {
  id: 0,
  perm: {
    admin: true,
    create: true,
    delete: true,
    download: true,
    edit: true,
    execute: true,
    rename: true,
    share: true,
    commands: '',
  },
  lockPassword: false,
  password: '',
  username: '',
  scope: '',
  rules: '',
  locale: ''
}

export default {
  name: 'user',
  components: { Languages },
  data: () => {
    return {
      originalUser: null,
      user: { ...emptyUser }
    }
  },
  computed: {
    passwordPlaceholder () {
      if (this.$route.path === '/settings/users/new') return ''
      return this.$t('settings.avoidChanges')
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData',
    'user.perm.admin': function () {
      if (!this.user.perm.admin) return
      this.user.lockPassword = false

      for (const key in this.user.perm) {
        if (key === 'commands') continue
        this.user.perm[key] = true
      }
    }
  },
  methods: {
    ...mapMutations([ 'closeHovers', 'showHover', 'setUser' ]),
    async fetchData () {
      let id = this.$route.params.pathMatch

      if (this.$route.path === '/settings/users/new') {
        // TODO: defaults
        return
      }

      try {
        let user = await api.get(id)
        user.rules = user.rules || []
        user.perm.commands = user.perm.commands.join(' ')

        let rules = ''
        for (let rule of user.rules) {
          rules += rule.allow ? 'allow ' : 'disallow '

          if (rule.regex) {
            rules += `rehex ${rule.regexp.raw}`
          } else {
            rules += rule.path
          }

          rules += '\n'
        }

        user.rules = rules.trim()
        this.user = { ...user }
      } catch (e) {
        this.$router.push({ path: '/settings/users/new' })
      }
    },
    deletePrompt () {
      this.showHover('deleteUser')
    },
    async deleteUser (event) {
      event.preventDefault()

      try {
        await api.remove(this.user.id)
        this.$router.push({ path: '/settings/users' })
        this.$showSuccess(this.$t('settings.userDeleted'))
      } catch (e) {
        this.$showError(e)
      }
    },
    async save (event) {
      event.preventDefault()
      const user = this.parseForm()

      try {
        if (this.user.id === 0) {
          const loc = await api.create(user)
          this.$route.push({ path: loc })
          this.$showSuccess(this.$t('settings.userCreated'))
        } else {
          await api.update(user)

          if (user.id === this.$store.state.user.id) {
            this.setUser(user)
          }

          this.$showSuccess(this.$t('settings.userUpdated'))
        }
      } catch (e) {
        this.$showError(e)
      }
    },
    parseForm () {
      let user = {
        ...this.originalUser,
        ...this.user,
        perm: {
          ...this.user.perm,
          commands: this.user.perm.commands.split(' ')
        },
        rules: []
      }

      let rawRules = this.user.rules.split('\n')

      for (let rawRule of rawRules) {
        let rule = {
          allow: true,
          path: '',
          regex: false,
          regexp: {
            raw: ''
          }
        }

        rawRule = rawRule.split(' ')

        // Skip a malformed rule
        if (rawRule.length < 2) {
          continue
        }

        // Skip a malformed rule
        if (rawRule[0] !== 'allow' && rawRule[0] !== 'disallow') {
          continue
        }

        rule.allow = (rawRule[0] === 'allow')
        rawRule.shift()

        if (rawRule[0] === 'regex') {
          rule.regex = true
          rawRule.shift()
          rule.regexp.raw = rawRule.join(' ')
        } else {
          rule.path = rawRule.join(' ')
        }

        user.rules.push(rule)
      }

      return user
    }
  }
}
</script>
