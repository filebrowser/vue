<template>
  <div id="login" :class="{ recaptcha: recaptcha }">
    <form @submit="submit">
      <img :src="logoURL" alt="File Browser">
      <h1>{{ name }}</h1>
      <div v-if="error !== ''" class="wrong">{{ error }}</div>

    </form>
  </div>
</template>

<script>
import * as auth from '@/utils/auth'
import { name, logoURL, signup } from '@/utils/constants'

export default {
  name: 'login',
  computed: {
    signup: () => signup,
    name: () => name,
    logoURL: () => logoURL
  },
  data: function () {
    return {
      error: '',
    }
  },
  mounted () {
    this.submit()
  },
  methods: {
    async submit (event) {
      event.preventDefault()
      event.stopPropagation()

      let redirect = this.$route.query.redirect
      if (redirect === '' || redirect === undefined || redirect === null) {
        redirect = '/files/'
      }

      let username = this.$route.query.username
      if (username === '' || username === undefined || username === null) {
        this.error = this.$t('login.wrongCredentials')
        return
      }

      let token = this.$route.query.token
      if (token === '' || token === undefined || token === null) {
        this.error = this.$t('login.wrongCredentials')
        return
      }

      try {
        await auth.loginToken(username, token)
        this.$router.push({ path: redirect })
      } catch (e) {
        if (e.message == 409) {
          this.error = this.$t('login.usernameTaken')
        } else {
          this.error = this.$t('login.wrongCredentials')
        }
      }
    }
  }
}
</script>
