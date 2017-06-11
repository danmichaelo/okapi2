<template>
  <div>
    <codemirror style="height:auto;"
        ref="myEditor"
        :code="code"
        :options="editorOptions"
        @ready="onEditorReady"
        @focus="onEditorFocus"
        @change="onEditorCodeChange"></codemirror>
  </div>
</template>

<script>

//require('codemirror/addon/selection/active-line.js')
require('codemirror/addon/hint/show-hint.js')
require('codemirror/addon/hint/show-hint.css')
require('codemirror/addon/hint/sql-hint.js')
require('codemirror/mode/sql/sql.js')

import { codemirror, CodeMirror } from 'vue-codemirror'

// https://vuejs.org/v2/guide/components.html#Form-Input-Components-using-Custom-Events
export default {
  components: {
    codemirror
  },
  props: {
    value: String
  },
  data () {
    var o = {
      code: '',
      editorOptions: {
        mode: "text/x-sql",
        tabSize: 4,
        styleActiveLine: true,
        //lineNumbers: false,
        //line: true,
        // foldGutter: true,
        // styleSelectedText: true,
        matchBrackets: true,
        hintOptions: {
          completeSingle: false,
          hint: this.hint,
          showCursorWhenSelecting: true,
        },
        extraKeys: {
          "Enter": this.onNewLine
        },
       // hint: CodeMirror.hint.sql,

      }
    }
    o.editorOptions.hintOptions.hint.async = true;
    return o
  },
  watch: {
    value: function (val) {
      this.code = val;
    },
  },
  methods: {
    hint: function(editor, cb, options) {


      // console.log('HINTING')
      // console.log(editor)
      // editor.on(this, 'select', function() {
      //   console.log('YOO')
      // });
      // See https://codemirror.net/demo/anywordhint.html#
      const WORD = /[\w$:"]+/iu, RANGE = 500;
      const word = options && options.word || WORD;
      var range = options && options.range || RANGE;
      var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
      var start = cur.ch, end = start;

      while (end < curLine.length && word.test(curLine.charAt(end))) {
        ++end;
      };

      while (start && word.test(curLine.charAt(start - 1))) {
        --start;
      };

      var curWord = start != end && curLine.slice(start, end);
      console.log('Word: ', curWord, start, end)

      if (curWord.length >= 3) {

        let documents = this.$resource('/api/authorities/complete')

        return documents.query({q: curWord}).then((response) => {

          var result = {
              list: [],
              from: CodeMirror.Pos(cur.line, start),
              to: CodeMirror.Pos(cur.line, end)
            }
          console.log('Got ' + response.body.length + ' results')
          response.body.forEach(function(doc) {
            result.list.push(doc.vocabulary + ':"' + doc.prefLabel[0] + '"');
           // doc.term = doc.prefLabel[0] + ' (' + doc.vocabulary + ')';
          });

          cb(result)
        })
      }

      //cb()
    },
    onNewLine(s) {
      console.log('ignore new line')
      // note: this is not called upon autocomplete select,
      // so we could submit from here instead of listening
      // to onkeyup
    },
    onEditorReady(editor) {
      console.log('the editor is readied!', editor)
    },
    onEditorFocus(editor) {
      console.log('the editor is focus!', editor)
    },
    onEditorCodeChange(newCode) {
      // console.log('this is new code', newCode)
      this.code = newCode
      this.$emit('input', newCode)
    },
    onSelect() {
      console.log('ONSELECT')
    }
  },
  computed: {
    editor() {
      return this.$refs.myEditor.editor
    }
  },
  mounted() {
    console.log('this is current editor object', this.editor)

    this.editor.on("keyup", (cm, e) => {
        console.log('check', e.keyCode)
      var keysToIgnore = [
        37,38,39,40,  // arrow keys
        8,  // backspace
        27, // escape
        13, // enter
      ];
      if (keysToIgnore.indexOf(e.keyCode) < 0) {
        //  this.editor.execCommand("autocomplete")
        this.editor.showHint();
      }
      if (e.keyCode == 13) {
        this.$emit('custom')
        // note: we could emit this from onNewLine instead
        // if we don't want submit on autocomplete selection
      }

    })

    if (this.value) {
      this.code = this.value
    }

    // this.editor.on('endCompletion', (x,y) => {
    //   console.log('end completion')
    //   // this.$emit('custom')
    // });

  }
}

</script>

<style>
.CodeMirror {
  height: auto !important;
}
</style>
