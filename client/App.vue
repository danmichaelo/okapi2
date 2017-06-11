<template>
  <div class="mdl-grid mdl-grid--no-spacing">
    <div class="mdl-cell mdl-cell--8-col">
      <div style="padding:16px">
        <form action="#" v-on:submit.prevent="submitForm">
          <searchfield v-model="query" v-on:custom="submitForm"></searchfield>
        </form>
        <router-view></router-view>
      </div>
    </div>
    <div style="min-height: calc(100vh - 64px);" class="mdl-cell mdl-cell--4-col mdl-shadow--2dp mdl-color--white">

    </div>
  </div>
</template>

<script>
import SearchField from './SearchField.vue';

export default {
  components: {
    searchfield: SearchField
  },
  mounted: function () {
  },
  created: function () {
    console.log('Hello, Search created')
    this.getQueryString()
  },
  data: () => ({
    query: 'OST'
  }),
  watch: {
    // call again the method if the route changes
    '$route': 'getQueryString'
  },
  methods: {
    submitForm: function () {
      console.log('Submit form', this.query)
      this.$router.push({ path: '/search', query: { q: this.query } })
    },
    getQueryString: function () {
      this.query = this.$route.query.q
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.mdl-card {
    overflow: visible;
    z-index: auto;
}
</style>
