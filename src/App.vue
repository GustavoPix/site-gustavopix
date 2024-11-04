<template>
  <Home/>
  <Footer/>
</template>

<script>
import Home from '@/views/Home.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    Home,
    Footer
  }
}
</script>

<style lang="scss">
@import './assets/scss/main.scss';
body{
  background: #202833;
}
</style>
