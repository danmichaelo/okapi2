<template>
  <section style="margin-bottom:16px;" class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">

    <header class="section__play-btn mdl-cell mdl-cell--3-col-desktop mdl-cell--2-col-tablet mdl-cell--4-col-phone mdl-color--teal-100 mdl-color-text--white">
<!--      <i class="material-icons">play_circle_filled</i>-->
    </header>

    <div class="mdl-card mdl-cell mdl-cell--9-col-desktop mdl-cell--6-col-tablet mdl-cell--4-col-phone">
      <div class="mdl-card__supporting-text">
        <h4 style="margin-top:8px;">{{doc.title}} ({{ doc.year }})</h4>
        {{ doc.author }} {{ doc.desc_extend }} {{ doc.holdings ? doc.holdings.length : '??' }} holding(s)
        {{ doc.description }}

        <a v-bind:href="'https://bibsys-almaprimo.hosted.exlibrisgroup.com/primo_library/libweb/action/dlSearch.do?institution=UBO&vid=UBO&search_scope=bibsys_ils&query=any,contains,' + doc.id" target="primo">Vis i Primo</a>
      </div>
      <div class="mdl-card__actions">
        <subject
          :data="subject"
          v-for="(subject, idx) in doc.subjects"
          v-if="subject.vocabulary"
          :key="doc.id + '-' + idx + '-s'"
          :unique-id="doc.id + '-' + idx + '-s'"></subject>
        <subject
          :data="subject"
          v-for="(subject, idx) in doc.classifications"
          v-if="subject.system == 'ddc'"
          :key="doc.id + '-' + idx + '-c'"
          :unique-id="doc.id + '-' + idx + '-c'"></subject>
      </div>
    </div>
<!--
    <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" v-bind:id="'btn-' +doc.id " data-upgraded=",MaterialButton,MaterialRipple">
      <i class="material-icons">more_vert</i>
    <span class="mdl-button__ripple-container"><span class="mdl-ripple is-animating" style="width: 92.5097px; height: 92.5097px; transform: translate(-50%, -50%) translate(29px, 12px);"></span></span></button>

    <div class="mdl-menu__container is-upgraded" style="right: 8px; top: 40px; width: 124px; height: 160px;"><div class="mdl-menu__outline mdl-menu--bottom-right" style="width: 124px; height: 160px;"></div><ul class="mdl-menu mdl-js-menu mdl-menu--bottom-right" v-bind:for="'btn-' +doc.id " data-upgraded=",MaterialMenu" style="clip: rect(0px 124px 0px 124px);">
      <li class="mdl-menu__item" tabindex="-1">Lorem</li>
      <li class="mdl-menu__item" disabled="" tabindex="-1">Ipsum</li>
      <li class="mdl-menu__item" tabindex="-1">Dolor</li>
    </ul></div>-->
  </section>

</template>

<script>

import Subject from './Subject.vue';

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
  components: {
    'subject': Subject,
    // 'editable-cover': EditableCover
  }
}

</script>
