<template>
    <form id="editor" :class="req.language">

    </form>
</template>

<script>
import { mapState } from 'vuex'
import CodeMirror from '@/utils/codemirror'
import * as api from '@/utils/api'
import buttons from '@/utils/buttons'

export default {
  name: 'editor',
  computed: {
    ...mapState(['req', 'schedule'])
  },
  data: function () {
    return {
      metadata: null,
      metalang: null,
      content: null
    }
  },
  created () {
    window.addEventListener('keydown', this.keyEvent)
    document.getElementById('save-button').addEventListener('click', this.save)

    let publish = document.getElementById('publish-button')
    if (publish !== null) {
      publish.addEventListener('click', this.publish)
    }
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.keyEvent)
    document.getElementById('save-button').removeEventListener('click', this.save)

    let publish = document.getElementById('publish-button')
    if (publish !== null) {
      publish.removeEventListener('click', this.publish)
    }
  },
  mounted: function () {
    if (this.req.content === undefined || this.req.content === null) {
      this.req.content = ''
    }

    const language = this.req.extension.slice(1)
    const isMarkdown = language  === '.markdown' ||
      language === '.md'

    // Set up the main content editor.
    this.content = CodeMirror(document.getElementById('editor'), {
      value: this.req.content,
      lineNumbers: !isMarkdown,
      viewportMargin: 500,
      autofocus: true,
      mode: language,
      theme: isMarkdown ? 'markdown' : 'ttcn',
      lineWrapping: isMarkdown
    })

    CodeMirror.autoLoadMode(this.content, language)
  },
  methods: {
    // Saves the content when the user presses CTRL-S.
    keyEvent (event) {
      if (!event.ctrlKey && !event.metaKey) {
        return
      }

      if (String.fromCharCode(event.which).toLowerCase() !== 's') {
        return
      }

      event.preventDefault()
      this.save()
    },
    // Publishes the file.
    publish (event) {
      this.save(event, true)
    },
    // Saves the file.
    save (event, regenerate = false) {
      let button = regenerate ? 'publish' : 'save'
      if (this.schedule !== '') button = 'schedule'
      let content = this.content.getValue()
      buttons.loading(button)

      api.put(this.$route.path, content, regenerate, this.schedule)
        .then(() => {
          buttons.success(button)
          this.$store.commit('setSchedule', '')
        })
        .catch(error => {
          buttons.done(button)
          this.$showError(error)
          this.$store.commit('setSchedule', '')
        })
    }
  }
}
</script>
