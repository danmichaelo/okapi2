<template>
  <div>
    <form action="#" v-on:submit.prevent="submitForm">
      <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width:100%;">
        <input class="mdl-textfield__input" type="text" id="searchfield" v-model="query">
        <label class="mdl-textfield__label" for="searchfield">Søke litt da vel...</label>
      </div>
    </form>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  created: function () {
    console.log('Hello, Search created')
    this.getQueryString()
  },
  data: () => ({
    query: ''
  }),
  watch: {
    // call again the method if the route changes
    '$route': 'getQueryString'
  },
  methods: {
    submitForm: function () {
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
.content-grid {
  max-width: 960px;
}
/*
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}*/
</style>
