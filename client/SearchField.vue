<template>
  <div>
    <div>
      [{{curIndex}}] [{{curWord}}] [{{start}}]-[{{end}}]
    </div>
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

// require('codemirror/addon/selection/active-line.js')
require('codemirror/addon/hint/show-hint.js')
require('codemirror/addon/hint/show-hint.css')
require('codemirror/addon/hint/sql-hint.js')
require('codemirror/addon/edit/matchbrackets.js')
// require('codemirror/addon/edit/closebrackets.js')
// require('codemirror/mode/sql/sql.js')
require('codemirror/addon/mode/simple.js')

import { codemirror, CodeMirror } from 'vue-codemirror'

const indices = [
  '_exists_',
  'realfagstermer', 'humord', 'sub', 'ddc',
  'holdings.note', 'title', 'pub_year',
]


/* Example definition of a simple mode that understands a subset of
 * JavaScript:
 */

CodeMirror.defineSimpleMode("es-okapi", {
  // The start state contains the rules that are intially used
  start: [
    // The regex matches the token, the token property contains the type
    // You can match multiple tokens at once. Note that the captured
    // groups must span the whole string in this case
    // {regex: /(function)(\s+)([a-z$][\w$]*)/,
    //  token: ["keyword", null, "variable-2"]},
    // Rules are matched in the order in which they appear, so there is
    // no ambiguity between this one and the one above

    {regex: /(?:_exists_)\b/,
     token: "keyword"},

    // {regex: /"(?:[^\\]|\\.)*?"/, token: "string"},
    {regex: new RegExp('\\b((?:' + indices.join('|') + '):)("(?:[^\\\\]|\\\\.)*?(?:"|$)|[^"\\s()]+)'),
     token: ["field", "field-value"]},
    // {regex: /\b(noubomn|humord|sub)(:[^\s]+)/,
    //  token: ["def", null]},

    {regex: /\b(?:AND|OR|NOT)\b/,
     token: "keyword"},

    {regex: /true|false|null|undefined/, token: "atom"},
    {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
     token: "number"},

    // {regex: /\/\/.*/, token: "comment"},
    {regex: /\/(?:[^\\]|\\.)*?\//, token: "variable-3"},
    // A next property will cause the mode to move to a different state
    // {regex: /\/\*/, token: "comment", next: "comment"},
    {regex: /[-+\/*=<>!()]+/, token: "operator"},
    // indent and dedent properties guide autoindentation
    //{regex: /[\{\[\(]/, indent: true},
    //{regex: /[\}\]\)]/, dedent: true},
    {regex: /[a-z$][\w$]*/, token: "variable"},
    // You can embed other modes with the mode property. This rule
    // causes all code between << and >> to be highlighted with the XML
    // mode.
    // {regex: /<</, token: "meta", mode: {spec: "xml", end: />>/}}
  ],
  // The multi-line comment state.
  comment: [
    // {regex: /.*?\*\//, token: "comment", next: "start"},
    // {regex: /.*/, token: "comment"}
  ],
  // The meta property contains global information about the mode. It
  // can contain properties like lineComment, which are supported by
  // all modes, and also directives like dontIndentStates, which are
  // specific to simple modes.
  meta: {
    // dontIndentStates: ["comment"],
    // lineComment: "//"
  }
});

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
      curIndex: '',
      curWord: '',
      start: 0,
      end: 0,
      code: '',
      editorOptions: {
        // mode: "text/x-sql",
        mode: "es-okapi",
        theme: "es-okapi",
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: false,
        //line: true,
        // foldGutter: true,
        // styleSelectedText: true,
        matchBrackets: true,
        hintOptions: {
          completeSingle: false,
          hint: this.hint,
          showCursorWhenSelecting: true,
        },
        autoCloseBrackets: true,
        extraKeys: {
          'Enter': this.onPressEnter,
          'Tab': false,
          'Shift-Tab': false,
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

      const autocompleteIndices = ['realfagstermer', 'humord']

      function hintIndexName(value, line, start, end) {

        var lst = indices.map((ind) => ind + ':');

        if (start > 0) {
           lst = ['AND', 'OR', 'NOT'].concat(lst);
        }

        lst = lst.filter((indexName) => indexName.toLowerCase().indexOf(value.toLowerCase()) == 0);

        cb({
          list: lst,
          from: CodeMirror.Pos(line, start),
          to: CodeMirror.Pos(line, end)
        });
      }
      // See https://codemirror.net/demo/anywordhint.html#
      var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
      var trail = ['0'];
      var c = '';
      var start = 0, end = cur.ch;
      var curWord = '';
      for (var i = 0; i < curLine.length; i++) {
        c = curLine.charAt(i);
        // if (c == '(') trail.push('(');
        // if (c == ')' && trail[trail.length-1] == '(') trail.pop();
        if (c == '"') {
          if (trail[trail.length-1] == '"') trail.pop()
          else trail.push('"');
        }
        if (c.match(/[\s()]/) && trail.length == 1) {
          if (i >= cur.ch) {
            break;
          }
          curWord = '';
          start = i + 1;
        } else {
          curWord += c;
        }
        end = i + 1;
      }
      this.start = curLine.charAt(start);
      this.end = curLine.charAt(end);

      var spl = curWord.indexOf(':');
      if (!~spl) {
        this.curIndex = curWord;
        this.curWord = '';
        return hintIndexName(curWord, cur.line, start, end);
      }

      this.curIndex = curWord.substr(0, spl);
      this.curWord = curWord.substr(spl + 1);

      if (!~autocompleteIndices.indexOf(this.curIndex)) {
        return;
      }

      if (!this.curWord || this.curWord.length < 3) {
        return;
      }

      if (curWord.match(/^(AND|OR|NOT)/)) {
        return;
      }

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

      //cb()
    },
    onPressEnter(cm) {
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
      console.log('{{}}onEditorCodeChange:', newCode)
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
      var keysToIgnore = [
        9,      // Tab key
        38, 40, // Up, Down
        // 37,39  // Left, Right
        // 8,  // Backspace
        27,    // Escape
        13,    // Enter
      ];
      if (keysToIgnore.indexOf(e.keyCode) < 0) {
        //  this.editor.execCommand("autocomplete")
        this.editor.showHint();
      }
      if (e.keyCode == 13) {
        var val = this.editor.getValue();
        if (!val.match(/(:|AND|OR|NOT)\s*$/)) {
          // if the line ends with :, AND/OR/NOT, don't submit
          this.$emit('submit')
        }
        // note: we could emit this from onPressEnter instead
        // if we don't want submit on autocomplete selection
      }

    })

    if (this.value) {
      console.log('VALUE:', this.value)
      this.code = this.value
    }

    // this.editor.on('endCompletion', (x,y) => {
    //   console.log('end completion')
    //   // this.$emit('submit')
    // });

  }
}

</script>

<style lang="scss">
$border-radius: 5px;

.CodeMirror {
  height: auto !important;
  font-size:13pt;
}


.cm-s-es-okapi span.cm-field {
  color: #666;
  background: rgba(0,100,255,0.1);
  border-radius: $border-radius 0 0 $border-radius;
}
.cm-s-es-okapi span.cm-field-value {
  color: #7F007F;
  background: rgba(0,100,255,0.1);
  border-radius: 0 $border-radius $border-radius 0;
}
.cm-s-es-okapi span.cm-keyword { line-height: 1em; font-weight: bold; color: #5A5CAD; }
.cm-s-es-okapi span.cm-operator { font-weight: bold; color: #5A5CAD; }


.cm-s-es-okapi span.cm-atom { color: #6C8CD5; }
.cm-s-es-okapi span.cm-number { color: #164; }
.cm-s-es-okapi span.cm-variable { color: black; }
.cm-s-es-okapi span.cm-variable-2 { color:black; }
.cm-s-es-okapi span.cm-variable-3 { color: black; }
.cm-s-es-okapi span.cm-property {}
.cm-s-es-okapi span.cm-comment { color: #0080FF; font-style: italic; }
.cm-s-es-okapi span.cm-string { color: red; }
.cm-s-es-okapi span.cm-meta { color: yellow; }
.cm-s-es-okapi span.cm-qualifier { color: grey; }
.cm-s-es-okapi span.cm-builtin { color: #7EA656; }
.cm-s-es-okapi span.cm-bracket { color: #cc7; }
.cm-s-es-okapi span.cm-tag { color: #3F7F7F; }
.cm-s-es-okapi span.cm-attribute { color: #7F007F; }
.cm-s-es-okapi span.cm-error { color: #f00; }

.cm-s-es-okapi .CodeMirror-activeline-background { background: #e8f2ff; }
.cm-s-es-okapi .CodeMirror-matchingbracket { outline:1px solid grey;color:black !important;background:yellow; }


</style>
