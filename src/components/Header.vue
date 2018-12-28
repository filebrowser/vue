<template>
  <header>
    <div>
      <button @click="openSidebar" :aria-label="$t('buttons.toggleSidebar')" :title="$t('buttons.toggleSidebar')" class="action">
        <i class="material-icons">menu</i>
      </button>
      <img src="../assets/logo.svg" alt="File Browser">
      <search></search>
    </div>
    <div>
      <button @click="openSearch" :aria-label="$t('buttons.search')" :title="$t('buttons.search')" class="search-button action">
        <i class="material-icons">search</i>
      </button>

      <button v-show="isEditor" :aria-label="$t('buttons.save')" :title="$t('buttons.save')" class="action" id="save-button">
        <i class="material-icons">save</i>
      </button>

      <button @click="openMore" id="more" :aria-label="$t('buttons.more')" :title="$t('buttons.more')" class="action">
        <i class="material-icons">more_vert</i>
      </button>

      <!-- Menu that shows on listing AND mobile when there are files selected -->
      <div id="file-selection" v-if="isMobile && req.kind === 'listing'">
        <span v-if="selectedCount > 0">{{ selectedCount }} selected</span>
        <share-button v-show="showShareButton"></share-button>
        <rename-button v-show="showRenameButton"></rename-button>
        <copy-button v-show="showCopyButton"></copy-button>
        <move-button v-show="showMoveButton"></move-button>
        <delete-button v-show="showDeleteButton"></delete-button>
      </div>

      <!-- This buttons are shown on a dropdown on mobile phones -->
      <div id="dropdown" :class="{ active: showMore }">
        <div v-if="!isListing || !isMobile">
          <share-button v-show="showShareButton"></share-button>
          <rename-button v-show="showRenameButton"></rename-button>
          <copy-button v-show="showCopyButton"></copy-button>
          <move-button v-show="showMoveButton"></move-button>
          <delete-button v-show="showDeleteButton"></delete-button>
        </div>

        <switch-button v-show="isListing"></switch-button>
        <download-button v-show="isFiles"></download-button>
        <upload-button v-show="showUpload"></upload-button>
        <info-button v-show="isFiles"></info-button>

        <button v-show="isListing" @click="openSelect" :aria-label="$t('buttons.selectMultiple')" :title="$t('buttons.selectMultiple')" class="action">
          <i class="material-icons">check_circle</i>
          <span>{{ $t('buttons.select') }}</span>
        </button>
      </div>
      <div v-show="showOverlay" @click="resetPrompts" class="overlay"></div>
    </div>
  </header>
</template>

<script>
import Search from './Search'
import InfoButton from './buttons/Info'
import DeleteButton from './buttons/Delete'
import RenameButton from './buttons/Rename'
import UploadButton from './buttons/Upload'
import DownloadButton from './buttons/Download'
import SwitchButton from './buttons/SwitchView'
import MoveButton from './buttons/Move'
import CopyButton from './buttons/Copy'
import ShareButton from './buttons/Share'
import {mapGetters, mapState} from 'vuex'
import * as api from '@/utils/api'
import buttons from '@/utils/buttons'

export default {
  name: 'header-layout',
  components: {
    Search,
    InfoButton,
    DeleteButton,
    ShareButton,
    RenameButton,
    DownloadButton,
    CopyButton,
    UploadButton,
    SwitchButton,
    MoveButton
  },
  data: function () {
    return {
      width: window.innerWidth,
      pluginData: {
        api,
        buttons,
        'store': this.$store,
        'router': this.$router
      }
    }
  },
  created () {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth
    })
  },
  computed: {
    ...mapGetters([
      'selectedCount',
      'isFiles',
      'isEditor',
      'isListing'
    ]),
    ...mapState([
      'req',
      'user',
      'loading',
      'reload',
      'multiple'
    ]),
    isMobile () {
      return this.width <= 736
    },
    showUpload () {
      return this.isListing && this.user.perm.create
    },
    showDeleteButton () {
      return this.isFiles && (this.isListing
        ? (this.selectedCount !== 0 && this.user.perm.delete)
        : this.user.perm.delete)
    },
    showRenameButton () {
      return this.isFiles && (this.isListing
        ? (this.selectedCount === 1 && this.user.perm.rename)
        : this.user.perm.rename)
    },
    showShareButton () {
      return this.isFiles && (this.isListing
        ? (this.selectedCount === 1 && this.user.perm.share)
        : this.user.perm.share)
    },
    showMoveButton () {
      return this.isFiles && (this.isListing
        ? (this.selectedCount > 0 && this.user.perm.rename)
        : this.user.perm.rename)
    },
    showCopyButton () {
      return this.isFiles && (this.isListing
        ? (this.selectedCount > 0 && this.user.perm.create)
        : this.user.perm.create)
    },
    showMore () {
      return this.isFiles && this.$store.state.show === 'more'
    },
    showOverlay () {
      return this.showMore
    }
  },
  methods: {
    openSidebar () {
      this.$store.commit('showHover', 'sidebar')
    },
    openMore () {
      this.$store.commit('showHover', 'more')
    },
    openSearch () {
      this.$store.commit('showHover', 'search')
    },
    openSelect () {
      this.$store.commit('multiple', true)
      this.resetPrompts()
    },
    resetPrompts () {
      this.$store.commit('closeHovers')
    }
  }
}
</script>
