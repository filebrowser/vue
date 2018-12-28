<template>
  <div id="login" :class="{ recaptcha: recaptcha.length > 0 }">
    <form @submit="submit">
      <img src="../assets/logo.svg" alt="File Browser">
      <h1>File Browser</h1>
      <div v-if="error !== ''" class="wrong">{{ error }}</div>

      <input type="text" v-model="username" :placeholder="$t('login.username')">
      <input type="password" v-model="password" :placeholder="$t('login.password')">
      <input v-if="createMode" type="password" v-model="passwordConfirm" :placeholder="$t('login.passwordConfirm')" />

      <div v-if="recaptcha.length" id="recaptcha"></div>
      <input type="submit" :value="createMode ? $t('login.signup') : $t('login.submit')">

      <p @click="toggleMode" v-if="signup">{{ createMode ? $t('login.loginInstead') : $t('login.createAnAccount') }}</p>
    </form>
  </div>
</template>

<script>
import auth from '@/utils/auth'
import { mapState } from 'vuex'

export default {
  name: 'login',
  props: ['dependencies'],
  computed: mapState([ 'recaptcha', 'signup' ]),
  data: function () {
    return {
      createMode: false,
      error: '',
      username: '',
      password: '',
      passwordConfirm: ''
    }
  },
  mounted () {
    if (this.dependencies) this.setup()
  },
  watch: {
    dependencies: function (val) {
      if (val) this.setup()
    }
  },
  methods: {
    setup () {
      if (this.recaptcha.length === 0) return

      window.grecaptcha.render('recaptcha', {
        sitekey: this.recaptcha
      })
    },
    toggleMode () {
      this.createMode = !this.createMode
    },
    async submit (event) {
      event.preventDefault()
      event.stopPropagation()

      let redirect = this.$route.query.redirect
      if (redirect === '' || redirect === undefined || redirect === null) {
        redirect = '/files/'
      }

      let captcha = ''
      if (this.recaptcha.length > 0) {
        captcha = window.grecaptcha.getResponse()

        if (captcha === '') {
          this.error = this.$t('login.wrongCredentials')
          return
        }
      }

      if (this.createMode) {
        if (this.password !== this.passwordConfirm) {
          this.error = this.$t('login.passwordsDontMatch')
          return
        }
      }

      try {
        if (this.createMode) {
          await auth.signup(this.username, this.password)
        }

        await auth.login(this.username, this.password, captcha)
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
