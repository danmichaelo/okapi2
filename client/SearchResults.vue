<template>
  <div>
    <div v-show="busy">Hold on…</div>
    <div v-show="!busy">Fetched {{ documents.length }} of {{ total }} results</div>
    <div v-show="error" style="color:red;">{{error}}</div>

    <document :doc="doc" v-for="doc in documents" :key="doc.id"></document>

  </div>
</template>

<script>

import Document from './Document.vue';

export default {
  components: {
    'document': Document
  },
  created: function () {
    console.log('Hello, SearchResults created')
    this.fetchResults()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchResults'
  },
  components: {
    'document': Document
  },
  data: function () {
    return {
      documents: [],
      total: 0,
      //totalResults: 0,
      busy: true,
      error: '',
    }
  },
  methods: {
    fetchResults: function () {
      const q = this.$route.query.q
      const sort = this.$route.query.sort
      const order = this.$route.query.order
      this.documents = []
      this.busy = true
      this.error = ''
      console.log('Searching for: ' + q)
      let documents = this.$resource('/api/biblios/query')

      documents.query({q: q, sort: sort, order: order}).then((response) => {
        console.log('Got ' + response.body.data.length + ' results')
        this.documents = response.body.data;
        this.total = response.body.total;
        // this.totalResults = response.body.total
        this.busy = false
      }, (response) => {
        // error callback
        console.log(response)
        if (response.body.error.msg !== undefined) {
          this.error = response.body.error.msg
        }
        if (response.body.error.message !== undefined) {
          this.error = response.body.error.message
        }
        this.documents = []
        this.total = 0
        this.busy = false
      })
    }
  }
}
</script>
