<template>
  <form id="editor" :class="req.language">
    <textarea v-model="content" placeholder="add multiple lines"></textarea>
  </form>
</template>

<script>
import { mapState } from 'vuex'
import { files as api } from '@/api'
import buttons from '@/utils/buttons'

export default {
  name: 'editor',
  computed: {
    ...mapState(['req'])
  },
  data: function () {
    return {
      content: null
    }
  },
  created () {
    window.addEventListener('keydown', this.keyEvent)
    document.getElementById('save-button').addEventListener('click', this.save)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.keyEvent)
    document.getElementById('save-button').removeEventListener('click', this.save)
  },
  mounted: function () {
    if (this.req.content === undefined || this.req.content === null) {
      this.req.content = ''
    }

    this.content = this.req.content
  },
  methods: {
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
    async save () {
      const button = 'save'
      buttons.loading('save')

      try {
        api.put(this.$route.path, this.content)
        buttons.success(button)
      } catch (e) {
        buttons.done(button)
        this.$showError(e)
      }
    }
  }
}
</script>
