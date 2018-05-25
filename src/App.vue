<template>
  <div id="app">
    <div id="bg-main"></div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  metaInfo: {
    title: 'Login',
    titleTemplate: '%s | ITCAMP14-W'
  }
}
</script>

<style>
#app {
  font-family: 'Kanit', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#bg-main {
  background-image: url('assets/bg-main.png');
  background-size: cover;
  min-height: 100vh;
  filter: blur(2px);
  transform: scale(1.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
