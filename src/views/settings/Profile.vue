<template>
  <div class="dashboard">
     <form class="card" @submit="updateSettings">
      <div class="card-title">
        <h2>{{ $t('settings.profileSettings') }}</h2>
      </div>

      <div class="card-content">
        <h3>{{ $t('settings.language') }}</h3>
        <p><languages id="locale" :selected.sync="locale"></languages></p>
      </div>

      <div class="card-action">
        <input class="flat" type="submit" :value="$t('buttons.update')">
      </div>
    </form>

    <form class="card" v-if="!user.lockPassword" @submit="updatePassword">
      <div class="card-title">
        <h2>{{ $t('settings.changePassword') }}</h2>
      </div>

      <div class="card-content">
        <p><input :class="passwordClass" type="password" :placeholder="$t('settings.newPassword')" v-model="password" name="password"></p>
        <p><input :class="passwordClass" type="password" :placeholder="$t('settings.newPasswordConfirm')" v-model="passwordConf" name="password"></p>
      </div>

      <div class="card-action">
        <input class="flat" type="submit" :value="$t('buttons.update')">
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { users as api } from '@/api'
import Languages from '@/components/Languages'

export default {
  name: 'settings',
  components: {
    Languages
  },
  data: function () {
    return {
      password: '',
      passwordConf: '',
      locale: ''
    }
  },
  computed: {
    ...mapState([ 'user' ]),
    passwordClass () {
      if (this.password === '' && this.passwordConf === '') {
        return ''
      }

      if (this.password === this.passwordConf) {
        return 'green'
      }

      return 'red'
    }
  },
  created () {
    this.locale = this.user.locale
  },
  methods: {
    async updatePassword (event) {
      event.preventDefault()

      if (this.password !== this.passwordConf || this.password === '') {
        return
      }

      let user = {
        id: this.user.id,
        password: this.password
      }

      try {
        await api.update(user, 'password')
        this.$showSuccess(this.$t('settings.passwordUpdated'))
      } catch (e) {
        this.$showError(e)
      }
    },
    async updateSettings (event) {
      event.preventDefault()

      let user = { ...this.user }
      user.locale = this.locale

      try {
        await api.update(user, 'partial')
        this.$store.commit('setUser', user)
        this.$showSuccess(this.$t('settings.settingsUpdated'))
      } catch (e) {
        this.$showError(e)
      }
    }
  }
}
</script>
