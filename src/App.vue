<template>
  <Home/>
</template>

<script>
import Home from '@/views/Home.vue'

export default {
  name: 'App',
  components: {
    Home
  }
}
</script>

<style lang="scss">
@import './assets/scss/main.scss';
body{
  background: #202833;
}
</style>
