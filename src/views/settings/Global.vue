<template>
  <div class="dashboard" v-if="settings !== null">
    <form class="card" @submit.prevent="save">
      <div class="card-title">
        <h2>{{ $t('settings.globalSettings') }}</h2>
      </div>

      <div class="card-content">
        <p><input type="checkbox" v-model="settings.signup"> {{ $t('settings.allowSignup') }}</p>

        <h3>{{ $t('settings.rules') }}</h3>
        <p class="small">{{ $t('settings.globalRules') }}</p>
        <rules :rules.sync="settings.rules" />
      </div>

      <div class="card-action">
        <input class="flat" type="submit" :value="$t('buttons.update')">
      </div>
    </form>

    <form class="card" @submit.prevent="save">
      <div class="card-title">
        <h2>{{ $t('settings.userDefaults') }}</h2>
      </div>

      <div class="card-content">
        <p class="small">{{ $t('settings.defaultUserDescription') }}</p>

        <user-form :isNew="false" :isDefault="true" :user.sync="settings.defaults" />
      </div>

      <div class="card-action">
        <input class="flat" type="submit" :value="$t('buttons.update')">
      </div>
    </form>

    <form class="card" @submit.prevent="save">
      <div class="card-title">
        <h2>{{ $t('settings.commands') }}</h2>
      </div>

      <div class="card-content">
        <p class="small">{{ $t('settings.commandsHelp') }}</p>

        <div v-for="command in settings.commands" :key="command.name" class="collapsible">
          <input :id="command.name" type="checkbox">
          <label :for="command.name">
            <p>{{ capitalize(command.name) }}</p>
            <i class="material-icons">arrow_drop_down</i>
          </label>
          <div class="collapse">
            <textarea v-model.trim="command.value"></textarea>
          </div>
        </div>
      </div>

      <div class="card-action">
        <input class="flat" type="submit" :value="$t('buttons.update')">
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { settings as api } from '@/api'
import UserForm from '@/components/settings/UserForm'
import Rules from '@/components/settings/Rules'

export default {
  name: 'settings',
  components: {
    UserForm,
    Rules
  },
  data: function () {
    return {
      originalSettings: null,
      settings: null
    }
  },
  computed: {
    ...mapState([ 'user' ])
  },
  async created () {
    try {
      const original = await api.get()
      let settings = { ...original, commands: [] }

      for (const key in original.commands) {
        settings.commands.push({
          name: key,
          value: original.commands[key].join('\n')
        })
      }

      this.originalSettings = original
      this.settings = settings
      console.log(settings)
    } catch (e) {
      this.$showError(e)
    }
  },
  methods: {
    capitalize (name, where = '_') {
      if (where === 'caps') where = /(?=[A-Z])/
      let splitted = name.split(where)
      name = ''

      for (let i = 0; i < splitted.length; i++) {
        name += splitted[i].charAt(0).toUpperCase() + splitted[i].slice(1) + ' '
      }

      return name.slice(0, -1)
    },
    async save () {
      let settings = {
        ...this.settings,
        commands: {}
      }

      for (const { name, value } of this.settings.commands) {
        settings.commands[name] = value.split('\n').filter(cmd => cmd !== '')
      }

      try {
        await api.update(settings)
        this.$showSuccess(this.$t('settings.settingsUpdated'))
      } catch (e) {
        this.$showError(e)
      }
    }
  }
}
</script>
