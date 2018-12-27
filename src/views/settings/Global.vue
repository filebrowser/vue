<template>
  <div class="dashboard">
    <form class="card" @submit.prevent="saveCSS">
      <div class="card-title">
        <h2>{{ $t('settings.customStylesheet') }}</h2>
      </div>

      <div class="card-content">
        <textarea v-model="css"></textarea>
      </div>

      <div class="card-action">
        <input class="flat" type="submit" :value="$t('buttons.update')">
      </div>
    </form>

    <form class="card" @submit.prevent="saveCommands">
      <div class="card-title">
        <h2>{{ $t('settings.commands') }}</h2>
      </div>

      <div class="card-content">
        <p class="small">{{ $t('settings.commandsHelp') }}</p>

        <div v-for="command in commands" :key="command.name" class="collapsible">
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
import { getSettings, updateSettings } from '@/utils/api'

export default {
  name: 'settings',
  data: function () {
    return {
      commands: [],
      css: ''
    }
  },
  computed: {
    ...mapState([ 'user' ])
  },
  created () {
    getSettings()
      .then(settings => {
        for (let key in settings.commands) {
          this.commands.push({
            name: key,
            value: settings.commands[key].join('\n')
          })
        }

        this.css = settings.css
      })
      .catch(this.$showError)
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
    saveCommands () {
      let commands = {}

      for (let command of this.commands) {
        let value = command.value.split('\n')
        if (value.length === 1 && value[0] === '') {
          value = []
        }

        commands[command.name] = value
      }

      updateSettings(commands, 'commands')
        .then(() => { this.$showSuccess(this.$t('settings.commandsUpdated')) })
        .catch(this.$showError)
    },
    saveCSS () {
      updateSettings(this.css, 'css')
        .then(() => {
          this.$showSuccess(this.$t('settings.settingsUpdated'))
          this.$store.commit('setCSS', this.css)
          this.$emit('css')
        })
        .catch(this.$showError)
    }
  }
}
</script>
