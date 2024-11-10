<template>
  <Header
    @changePage="changePage"
  />
  <Home
    v-if="page === 'home'"
    @changePage="changePage"
  />
  <Memocalc
    v-else-if="page === 'memocalc'"
    @changePage="changePage"
  />
  <Footer/>
</template>

<script>
import Home from '@/views/Home.vue'
import Memocalc from '@/views/Memocalc.vue';
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    Home,
    Memocalc,
    Footer,
    Header
  },
  data(){
    return {
      page: 'home'
    }
  },
  methods: {
    changePage(page){
      //set scroll to top
      window.scrollTo(0, 0)
      this.page = page
    }
  }
}
</script>

<style lang="scss">
@import './assets/scss/main.scss';
body{
  background: #202833;
}
</style>
