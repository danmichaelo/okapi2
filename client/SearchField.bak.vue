<template>
  <div>
    <div class="richtext" style="width:200px; height:20px;">
      <pre v-html="formatted"></pre>
      <input type="text"
        v-bind:value="value"
        v-on:input="updateValue($event.target.value)">
    </div>
  </div>
</template>

<style>
.richtext {
  display: inline-block;
  overflow: hidden;
  margin: 2px 0;
  vertical-align: top;
}
.richtext > pre {
  color: red;
  margin: 0;
  padding: 0;
  width: 200px;
  display: inline-block;
  border2: 1px solid transparent;
  z-index: 1;
  position: absolute;
  overflow: hidden;
  height: 25px;
  background: #fff;
  z-index: 1;
}
.richtext > input {
  width: 200px;
  background: transparent;
  z-index: 2;
  position: absolute;
  margin: 0;
  padding: 0;
  border: 0;
}

input, .richtext {
    padding: 5px;
    color: #282828;
    background: #fff;
    outline: 0;
    border: 1px solid #BABABA;
}
input, .richtext > pre {
    font-family: monaco, courier;
    font-size: 100%;
    width: 400px;
}
.unmatched {
    background: red;
}
.paren_0 { /* 5 */
    background: #00ff00;
}
.paren_1 {
    background: #b6e4b6;
}
.paren_2 {
    background: #c0c000;
}
.paren_3 {
    background: #008000;
}
.paren_4 {
    background: #808000;
}
.selected_paren {
    background: #00ffff !important;
}

</style>

<script>
// https://vuejs.org/v2/guide/components.html#Form-Input-Components-using-Custom-Events
export default {
  props: ['value'],
  data: () => ({
    formatted: 'YO'
  }),
  methods: {
    updateValue: function(newValue) {
      this.formatted = newValue;
//      $(newId + "> pre").html(colorize(text, $(original).getCursorPosition()));
      this.$emit('input', newValue)
    }
  }
}

</script>
