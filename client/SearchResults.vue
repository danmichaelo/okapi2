<template>
  <div>
    <div v-show="busy">Hold on…</div>
    <div v-show="!busy">Got {{ documents.length }} of {{ total }} results</div>

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
      busy: true
    }
  },
  methods: {
    fetchResults: function () {
      var q = this.$route.query.q;
      q = q.replace(/realfagstermer:/g, 'noubomn:')
      const sort = this.$route.query.sort
      const order = this.$route.query.order
      this.documents = []
      this.busy = true
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
        this.busy = false
      })
    }
  }
}
</script>
