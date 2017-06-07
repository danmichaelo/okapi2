<template>
  <div>
    <div v-show="busy">Hold on…</div>
    <div v-show="!busy">Got {{ documents.length }} results</div>
    <ul class="mdl-list">
      <document :doc="doc" v-for="doc in documents" :key="doc.id"></document>
    </ul>
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
      //totalResults: 0,
      busy: true
    }
  },
  methods: {
    fetchResults: function () {
      this.documents = []
      this.busy = true
      console.log('Searching for: ' + this.$route.query.q)
      let documents = this.$resource('/api/biblios/query')

      documents.query({q: this.$route.query.q}).then((response) => {
        console.log('Got ' + response.body.length + ' results')
        this.documents = response.body
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
