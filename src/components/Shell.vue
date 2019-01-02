<template>
  <div @click="focus" class="shell" ref="scrollable" :class="{ ['shell--hidden']: !showShell}">
    <div v-for="(c, index) in content" :key="index" class="shell__result" :class="{ prompt: c.prompt }" >
      <div class="shell__prompt"><i v-if="c.prompt" class="material-icons">chevron_right</i></div>
      <pre class="shell__text">{{ c.text }}</pre>
    </div>

    <div class="shell__result prompt" :class="{ 'shell__result--hidden': !canInput }" >
      <div class="shell__prompt"><i class="material-icons">chevron_right</i></div>
      <pre tabindex="0" ref="input" class="shell__text" contenteditable="true" @keypress.prevent.enter="submit" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { ws as api } from '@/api'

export default {
  name: 'shell',
  computed: {
    ...mapState([ 'user', 'showShell' ]),
    ...mapGetters([ 'isFiles', 'isLogged' ]),
    path: function () {
      if (this.isFiles) {
        return this.$route.path
      }

      return ''
    }
  },
  data: () => ({
    content: [],
    canInput: true
  }),
  methods: {
    scroll: function () {
      this.$refs.scrollable.scrollTop = this.$refs.scrollable.scrollHeight
    },
    focus: function () {
      this.$refs.input.focus()
    },
    submit: function (event) {
      const cmd = event.target.innerText.trim()

      if (cmd === '') {
        return
      }

      if (cmd === 'clear()') {
        this.content = []
        event.target.innerHTML = ''
        return
      }

      this.content.push({
        prompt: true,
        text: cmd
      })

      this.canInput = false
      event.target.innerHTML = ''

      let results = {
        prompt: false,
        text: ''
      }

      this.content.push(results)

      api.command(
        this.path,
        cmd,
        event => {
          results.text += `${event.data}\n`
          this.scroll()
        },
        () => {
          results.text = results.text.trimEnd()
          this.canInput = true
          this.$refs.input.focus()
          this.scroll()
        }
      )
    }
  }
}
</script>
