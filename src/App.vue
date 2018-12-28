<template>
  <router-view :dependencies="loaded"></router-view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'app',
  computed: mapState(['recaptcha']),
  data () {
    return {
      loaded: false
    }
  },
  mounted () {
    if (this.recaptcha.length === 0) {
      this.unload()
      return
    }

    let check = () => {
      if (typeof window.grecaptcha === 'undefined') {
        setTimeout(check, 100)
        return
      }

      this.unload()
    }

    check()
  },
  methods: {
    unload () {
      this.loaded = true
      // Remove loading animation.
      let loading = document.getElementById('loading')
      loading.classList.add('done')

      setTimeout(function () {
        loading.parentNode.removeChild(loading)
      }, 200)
    }
  }
}
</script>

<style>
@import './css/styles.css';
</style>
