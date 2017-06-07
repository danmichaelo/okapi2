<template>
  <li class="mdl-list__item">
    <span>
      <img v-if="doc.cover" :src="doc.cover.thumb.url" class="mdl-list__item-avatar" />
      <div>{{ doc.title }}</div>
      <div style="color: rgba(0,0,0,.54); font-size: 14px; font-weight: 400; line-height: 18px;">
          {{ doc.publisher }} {{ doc.year }}
          ISBN: <span v-for="isbn in doc.isbns"> {{ isbn }}</span>
      <!--    <div v-for="holding in localHoldings">
            {{ holding.barcode }} :
            {{ holding.callcode }}
          </div>-->

        <!--    <div v-for="holding in localHoldings">
              {{ holding.barcode }} :
              {{ holding.callcode }}
            </div>-->
      </div>
      <div>
        <span class="mdl-chip" v-for="sub in doc.subjects" v-if="sub.vocabulary">
          <span class="mdl-chip__text"> {{ sub.term }} ({{ sub.vocabulary }}) </span>
        </span>
        <span class="mdl-chip mdl-color--blue-100" v-for="sub in doc.classifications" v-if="sub.system == 'ddc'">
          <span class="mdl-chip__text"> {{ sub.number }} ({{ sub.edition }}) </span>
        </span>
      </div>
    </span>
  </li>
</template>

<script>

export default {
  props: {
    doc: Object
  },
  computed: {
    localHoldings: function () {
      if (this.doc.holdings) {
        return this.doc.holdings.filter(holding => holding.shelvinglocation === 'k00475')
      } else {
        return []
      }
    }
  },
  /*components: {
    'editable-cover': EditableCover
  }*/
}

</script>
