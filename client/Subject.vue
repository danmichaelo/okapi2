<template>
  <span>
    <button
      v-bind:id="'menu-sub-btn-' + uniqueId"
      style="height:24px; line-height: 24px; margin-right:4px;"
      class="mdl-chip mdl-color--teal-100 ">
        <span class="mdl-chip__text">
          {{ label }}
          <span style="font-size:80%; color: #666;">({{ qualifier}})</span>
        </span>
    </button>
    <ul style="position:absolute;z-index:999" class="mdl-menu mdl-js-menu mdl-js-ripple-effect"
        v-bind:for="'menu-sub-btn-' + uniqueId" v-bind:id="'menu-sub-' + uniqueId">
      <li class="mdl-menu__item" v-on:click="search()">Søk</li>
      <li class="mdl-menu__item" disabled>AND</li>
      <li class="mdl-menu__item" disabled>OR</li>
      <li class="mdl-menu__item" disabled>NOT</li>
      <li class="mdl-menu__item" disabled>Mer info</li>
    </ul>
</span>


</template>

<script>

export default {
  mounted: function() {
    componentHandler.upgradeElement(document.getElementById('menu-sub-' + this.uniqueId));
    //componentHandler.upgradeElement(document.getElementById('menu-sub-btn-' + this.uniqueId));
  },
  props: {
    uniqueId: String,
    data: Object
  },
  computed: {
    qualifier: function () {
      // Generate unique id for this field
      return this.data.system || this.data.vocabulary
    },
    label: function () {
      return this.data.number || this.data.term
    }
  },
  methods: {
    search: function() {
      this.$router.push({ path: '/search', query: { q: this.qualifier + ':"' + this.label + '"'} })
    }
  },
  components: {
  }
}

</script>
