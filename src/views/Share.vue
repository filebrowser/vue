<template>
  <a href="?dl=1">
    <div>Download Folder</div>
    <div>
      <svg fill="#40c4ff" height="150" viewBox="0 0 24 24" width="150" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
      <svg fill="#40c4ff" height="150" viewBox="0 0 24 24" width="150" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
      <h1>namer</h1>
      </div>
  </a>
</template>

<style scoped>
* {
  box-sizing: border-box
}
body {
  font-family: Arial, sans-serif;
  color: #6f6f6f;
  background: #f8f8f8;
}
a {
  text-decoration: none;
  color: inherit;
}
body > a  {
  text-align: center;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  box-shadow: rgba(0, 0, 0, 0.06) 0px 1px 3px, rgba(0, 0, 0, 0.12) 0px 1px 2px;
  background: #fff;
  display: block;
  border-radius: 0.2em;
  width: 90%;
  max-width: 25em;
}
body > a > div:first-child {
  width: 100%;
  padding: 1em;
  cursor: pointer;
  background: #ffffff;
  color: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
body > a > div:last-child {
  padding: 2em 3em;
}
body > a * {
  margin: 0;
}
body > a h1 {
  margin-top: .2em;
  word-wrap: break-word;
}
</style>

<script>
export default {
  name: 'share',
}
</script>
