<template>
  <button @click="change" @touchend="changeBackground" :aria-label="$t('buttons.repeat')" :title="$t('buttons.repeat')" class="action" id="repeat-button">
    <i class="material-icons">{{ icon }}</i>
    <span>{{ $t('buttons.repeat') }}</span>
  </button>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'repeat-button',
  computed: {
    ...mapState(['repeat']),
    icon: function () {
      if (this.repeat === 'repeat_one') {
        return 'repeat_one'
      } else if (this.repeat === 'repeat_all') {
        return 'repeat'
      } else {
        return 'repeat'
      }
    }
  },
  mounted () {
    if (this.$store.state.repeat !== 'repeat_all' && this.$store.state.repeat !== 'repeat_one') {
      document.querySelector(`#repeat-button > i`).style.opacity = 0.5
    }
  },
  methods: {
    ...mapMutations(['updateUser']),
    change: function (event) {
      let repeatIcon = document.querySelector(`#repeat-button > i`)

      if (this.$store.state.repeat === 'repeat_all') {
        repeatIcon.style.opacity = 1
        this.$store.commit('repeat', 'repeat_one')
      } else if (this.$store.state.repeat === 'repeat_one') {
        repeatIcon.style.opacity = 0.5
        this.$store.commit('repeat', '')
      } else {
        repeatIcon.style.opacity = 1
        this.$store.commit('repeat', 'repeat_all')
      }
    },
    changeBackground: function (event) {
      let repeat = document.getElementById('repeat-button')
      repeat.style.backgroundColor = 'transparent'
    }
  }
}
</script>
