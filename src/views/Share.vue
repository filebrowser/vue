<template>
  <div class="share">
    <a href="?dl=1">
      <div v-if="file.isDir">Download Folder</div>
      <div v-else>Download File</div>
      <div>
        <svg v-if="file.isDir" fill="#40c4ff" height="150" viewBox="0 0 24 24" width="150" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
        <svg v-else fill="#40c4ff" height="150" viewBox="0 0 24 24" width="150" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
        <h1>{{ file.name }}</h1>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: 'share',
  data: () => ({
    file: {
      isDir: false,
      name: 'My file.zip'
    }
  })
}
</script>
