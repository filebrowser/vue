<template>
  <div id="previewer">
    <div class="bar">
      <button @click="back" class="action" :title="$t('files.closePreview')" :aria-label="$t('files.closePreview')" id="close">
        <i class="material-icons">close</i>
      </button>
      <repeat-button v-if="req.type == 'audio' || req.type == 'video'"></repeat-button>
      <rename-button v-if="allowEdit()"></rename-button>
      <delete-button v-if="allowEdit()"></delete-button>
      <download-button></download-button>
      <info-button></info-button>
    </div>

    <button class="action" id="button-previous" @click="prev" v-show="hasPrevious" :aria-label="$t('buttons.previous')" :title="$t('buttons.previous')">
      <i class="material-icons">chevron_left</i>
    </button>
    <button class="action" id="button-next" @click="next" v-show="hasNext" :aria-label="$t('buttons.next')" :title="$t('buttons.next')">
      <i class="material-icons">chevron_right</i>
    </button>

    <div class="preview">
      <img v-if="req.type == 'image'" :src="raw()">
      <audio id="preview-audio" v-else-if="req.type == 'audio'" :src="raw()" @ended="playNext" autoplay controls></audio>
      <video id="preview-video" v-else-if="req.type == 'video'" :src="raw()" @ended="playNext" autoplay controls>
        <track v-for="(sub, index) in subtitles" :kind="sub.kind" :src="'/api/subtitle/' + sub.src" :label="sub.label" :default="index === 0">
        Sorry, your browser doesn't support embedded videos,
        but don't worry, you can <a :href="download()">download it</a>
        and watch it with your favorite video player!
      </video>
      <object v-else-if="req.extension == '.pdf'" class="pdf" :data="raw()"></object>
      <a v-else-if="req.type == 'blob'" :href="download()">
        <h2 class="message">{{ $t('buttons.download') }} <i class="material-icons">file_download</i></h2>
      </a>
      <pre v-else >{{ req.content }}</pre>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import url from '@/utils/url'
import * as api from '@/utils/api'
import InfoButton from '@/components/buttons/Info'
import DeleteButton from '@/components/buttons/Delete'
import RenameButton from '@/components/buttons/Rename'
import DownloadButton from '@/components/buttons/Download'
import RepeatButton from '@/components/buttons/Repeat'

export default {
  name: 'preview',
  components: {
    InfoButton,
    DeleteButton,
    RenameButton,
    DownloadButton,
    RepeatButton
  },
  data: function () {
    return {
      previousLink: '',
      nextLink: '',
      nextMedia: '',
      listing: null,
      subtitles: []
    }
  },
  computed: {
    ...mapState(['req', 'oldReq']),
    hasPrevious () {
      return (this.previousLink !== '')
    },
    hasNext () {
      return (this.nextLink !== '')
    },
    hasNextMedia () {
      return (this.nextMedia !== '')
    }
  },
  mounted () {
    window.addEventListener('keyup', this.key)
    api.fetch(url.removeLastDir(this.$route.path))
      .then(req => {
        this.listing = req
        this.updateLinks()
      })
      .catch(this.$showError)
    if (this.req.type === 'audio' || this.req.type === 'video') {
      api.subtitles(this.req.url.slice(6))
        .then(req => {
          this.subtitles = req
        })
        .catch(this.$showError)
    }
  },
  beforeDestroy () {
    window.removeEventListener('keyup', this.key)
  },
  methods: {
    download () {
      let url = `${this.$store.state.baseURL}/api/download`
      url += this.req.url.slice(6)

      return url
    },
    raw () {
      return `${this.download()}?&inline=true`
    },
    back (event) {
      let uri = url.removeLastDir(this.$route.path) + '/'
      this.$router.push({ path: uri })
    },
    prev () {
      this.$router.push({ path: this.previousLink })
    },
    next () {
      this.$router.push({ path: this.nextLink })
    },
    playNext () {
      if (this.$store.state.repeat === 'repeat_all' && this.hasNextMedia) {
        this.$router.push({ path: this.nextMedia })
      } else if (this.$store.state.repeat === 'repeat_one') {
        let v = document.getElementById('preview-video')
        let a = document.getElementById('preview-audio')
        if (v) {
          v.currentTime = 0
          v.play()
        }
        if (a) {
          a.currentTime = 0
          a.play()
        }
      }
    },
    key (event) {
      event.preventDefault()

      if (event.which === 13 || event.which === 39) { // right arrow
        if (this.hasNext) this.next()
      } else if (event.which === 37) { // left arrow
        if (this.hasPrevious) this.prev()
      }
    },
    updateLinks () {
      let pos = null

      for (let i = 0; i < this.listing.items.length; i++) {
        if (this.listing.items[i].name === this.req.name) {
          pos = i
          break
        }
      }

      if (pos === null) {
        return
      }

      if (pos !== 0) {
        this.previousLink = this.listing.items[pos - 1].url
      }

      if (pos !== this.listing.items.length - 1) {
        this.nextLink = this.listing.items[pos + 1].url
      }

      let mediapos = null
      for (let i = pos + 1; i < this.listing.items.length; i++) {
        if (this.listing.items[i].type === 'audio' || this.listing.items[i].type === 'video') {
          mediapos = i
          break
        }
      }
      if (mediapos === null) {
        for (let i = 0; i < pos; i++) {
          if (this.listing.items[i].type === 'audio' || this.listing.items[i].type === 'video') {
            mediapos = i
            break
          }
        }
      }
      if (mediapos !== null) {
        this.nextMedia = this.listing.items[mediapos].url
      }
    },
    allowEdit (event) {
      return this.$store.state.user.allowEdit
    }
  }
}
</script>
