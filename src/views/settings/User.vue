<template>
  <div>
    <form @submit="save" class="card">
      <div class="card-title">
        <h2 v-if="id === 0">{{ $t('settings.newUser') }}</h2>
        <h2 v-else>{{ $t('settings.user') }} {{ username }}</h2>
      </div>

      <div class="card-content">
        <p>
          <label for="username">{{ $t('settings.username') }}</label>
          <input type="text" v-model="username" id="username">
        </p>

        <p>
          <label for="password">{{ $t('settings.password') }}</label>
          <input type="password" :placeholder="passwordPlaceholder" v-model="password" id="password">
        </p>

        <p>
          <label for="scope">{{ $t('settings.scope') }}</label>
          <input type="text" v-model="scope" id="scope">
        </p>

        <p>
          <label for="locale">{{ $t('settings.language') }}</label>
          <languages id="locale" :selected.sync="locale"></languages>
        </p>

        <p><input type="checkbox" :disabled="admin" v-model="lockPassword"> {{ $t('settings.lockPassword') }}</p>

        <h3>{{ $t('settings.permissions') }}</h3>
        <p class="small">{{ $t('settings.permissionsHelp') }}</p>

        <p><input type="checkbox" v-model="perm.admin"> {{ $t('settings.administrator') }}</p>
      
        <p><input type="checkbox" :disabled="perm.admin" v-model="perm.create"> {{ $t('settings.create') }}</p>
        <p><input type="checkbox" :disabled="perm.admin" v-model="perm.delete"> {{ $t('settings.delete') }}</p>
        <p><input type="checkbox" :disabled="perm.admin" v-model="perm.download"> {{ $t('settings.download') }}</p>
        <p><input type="checkbox" :disabled="perm.admin" v-model="perm.edit"> {{ $t('settings.edit') }}</p>
        <p><input type="checkbox" :disabled="perm.admin" v-model="perm.execute"> {{ $t('settings.execute') }}</p>
        <p><input type="checkbox" :disabled="perm.admin" v-model="perm.rename"> {{ $t('settings.rename') }}</p>
        <p><input type="checkbox" :disabled="perm.admin" v-model="perm.share"> {{ $t('settings.share') }}</p>

        <h3>{{ $t('settings.userCommands') }}</h3>
        <p class="small">{{ $t('settings.userCommandsHelp') }} <i>git svn hg</i>.</p>
        <input type="text" v-model.trim="perm.commands">

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

        <textarea v-model.trim="rules"></textarea>
      </div>

      <div class="card-action">
        <button v-if="id !== 0" @click.prevent="deletePrompt" type="button" class="flat delete" :aria-label="$t('buttons.delete')" :title="$t('buttons.delete')">{{ $t('buttons.delete') }}</button>
        <input class="flat" type="submit" :value="$t('buttons.save')">
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

export default {
  name: 'user',
  components: { Languages },
  data: () => {
    return {
      originalUser: null,
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
      password: '',
      username: '',
      scope: '',
      rules: '',
      locale: ''
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
    'perm.admin': function () {
      if (!this.perm.admin) return
      this.lockPassword = false
      
      for (const key in this.perm) {
        if (key === 'commands') continue
        this.perm[key] = true
      }
    }
  },
  methods: {
    ...mapMutations(['closeHovers']),
    async fetchData () {
      let id = this.$route.params.pathMatch

      if (this.$route.path === '/settings/users/new') {
        id = 'base'
      }

      try {
        const user = await api.get(id)

        this.originalUser = user
        this.id = user.id
        this.locale = user.locale
        this.perm = user.perm
        this.scope = user.scope
        this.username = user.username

        // TODO:Lock Pwd ?

        if (this.perm.commands) {
          this.perm.commands = this.perm.commands.join(' ')
        }

        /* for (const rule of user.rules) {
          console.log(rule)
        } */

        console.log(user)

      } catch (e) {
        console.error(e)
      }

      /*   

        for (let rule of user.rules) {
          if (rule.allow) {
            this.rules += 'allow '
          } else {
            this.rules += 'disallow '
          }

          if (rule.regex) {
            this.rules += 'regex ' + rule.regexp.raw
          } else {
            this.rules += rule.path
          }

          this.rules += '\n'
        }

        this.rules = this.rules.trim()
      }).catch(() => {
        this.$router.push({ path: '/settings/users/new' })
      }) */
    },
    capitalize (name) {
      let splitted = name.split(/(?=[A-Z])/)
      name = ''

      for (let i = 0; i < splitted.length; i++) {
        name += splitted[i].charAt(0).toUpperCase() + splitted[i].slice(1) + ' '
      }

      return name.slice(0, -1)
    },
    reset () {
      this.id = 0
      this.admin = false
      this.allowNew = false
      this.allowEdit = false
      this.allowPublish = false
      this.permissins = {}
      this.allowCommands = false
      this.lockPassword = false
      this.password = ''
      this.username = ''
      this.filesystem = ''
      this.rules = ''
      this.locale = ''
      this.commands = ''
    },
    deletePrompt () {
      this.$store.commit('showHover', 'deleteUser')
    },
    deleteUser (event) {
      event.preventDefault()

      deleteUser(this.id).then(() => {
        this.$router.push({ path: '/settings/users' })
        this.$showSuccess(this.$t('settings.userDeleted'))
      }).catch(e => {
        this.$showError(e)
      })
    },
    save (event) {
      event.preventDefault()
      let user = this.parseForm()

      if (this.$route.path === '/settings/users/new') {
        newUser(user).then(location => {
          this.$router.push({ path: location })
          this.$showSuccess(this.$t('settings.userCreated'))
        }).catch(e => {
          this.$showError(e)
        })

        return
      }

      updateUser(user).then(() => {
        if (user.ID === this.$store.state.user.ID) {
          this.$store.commit('setUser', user)
        }

        this.$showSuccess(this.$t('settings.userUpdated'))
      }).catch(e => {
        this.$showError(e)
      })
    },
    parseForm () {
      let user = this.originalUser
      user.username = this.username
      user.password = this.password
      user.lockPassword = this.lockPassword
      user.filesystem = this.filesystem
      user.admin = this.admin
      user.allowCommands = this.allowCommands
      user.allowNew = this.allowNew
      user.allowEdit = this.allowEdit
      user.allowPublish = this.allowPublish
      user.permissions = this.permissions
      user.locale = this.locale
      user.commands = this.commands.split(' ')
      user.rules = []

      let rules = this.rules.split('\n')

      for (let rawRule of rules) {
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
