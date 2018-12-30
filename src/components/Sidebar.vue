<template>
  <nav :class="{active}">
    <router-link class="action" to="/files/" :aria-label="$t('sidebar.myFiles')" :title="$t('sidebar.myFiles')">
      <i class="material-icons">folder</i>
      <span>{{ $t('sidebar.myFiles') }}</span>
    </router-link>

    <div v-if="user.perm.create">
      <button @click="$store.commit('showHover', 'newDir')" class="action" :aria-label="$t('sidebar.newFolder')" :title="$t('sidebar.newFolder')">
        <i class="material-icons">create_new_folder</i>
        <span>{{ $t('sidebar.newFolder') }}</span>
      </button>

      <button @click="$store.commit('showHover', 'newFile')" class="action" :aria-label="$t('sidebar.newFile')" :title="$t('sidebar.newFile')">
        <i class="material-icons">note_add</i>
        <span>{{ $t('sidebar.newFile') }}</span>
      </button>
    </div>

    <div>
      <router-link class="action" to="/settings" :aria-label="$t('sidebar.settings')" :title="$t('sidebar.settings')">
        <i class="material-icons">settings_applications</i>
        <span>{{ $t('sidebar.settings') }}</span>
      </router-link>

      <button v-if="!noAuth" @click="logout" class="action" id="logout" :aria-label="$t('sidebar.logout')" :title="$t('sidebar.logout')">
        <i class="material-icons">exit_to_app</i>
        <span>{{ $t('sidebar.logout') }}</span>
      </button>
    </div>

    <p class="credits">
      <span>
        <span v-if="disableExternal">File Browser</span>
        <a v-else rel="noopener noreferrer" target="_blank" href="https://github.com/filebrowser/filebrowser">File Browser</a>
        <span> v{{ version }}</span>
      </span>
      <span><a @click="help">{{ $t('sidebar.help') }}</a></span>
    </p>
  </nav>
</template>

<script>
import {mapState} from 'vuex'
import auth from '@/utils/auth'
import { version, disableExternal, noAuth } from '@/utils/constants'

export default {
  name: 'sidebar',
  computed: {
    ...mapState(['user']),
    active () {
      return this.$store.state.show === 'sidebar'
    },
    version: () => version,
    disableExternal: () => disableExternal,
    noAuth: () => noAuth
  },
  methods: {
    help () {
      this.$store.commit('showHover', 'help')
    },
    logout: auth.logout
  }
}
</script>
