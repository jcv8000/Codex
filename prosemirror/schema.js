'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var prosemirrorModel = require('prosemirror-model');

var pDOM = ["p", 0], blockquoteDOM = ["blockquote", 0], hrDOM = ["hr"],
      preDOM = ["pre", ["code", 0]], brDOM = ["br"];

// :: Object
// [Specs](#model.NodeSpec) for the nodes defined in this schema.
var nodes = {
  // :: NodeSpec The top level document node.
  doc: {
    content: "block+"
  },

  // :: NodeSpec A plain paragraph textblock. Represented in the DOM
  // as a `<p>` element.
  paragraph: {
    content: "inline*",
    group: "block",
    attrs: {
      class: {
        default: 'pm-align--left'
      }
    },
    //parseDOM: [{tag: "p"}],
    //toDOM: function toDOM() { return pDOM }
    toDOM (node) {
      return ['p', { class: node.attrs.class }, 0]
    },
    parseDOM: [{
      tag: 'p',
      getAttrs: node => {
        return {
          textAlign: node.attributes
            ? node.attributes.class
            : node.attrs.class
        }
      }
    }]
  },

  // :: NodeSpec A blockquote (`<blockquote>`) wrapping one or more blocks.
  blockquote: {
    content: "block+",
    group: "block",
    defining: true,
    parseDOM: [{tag: "blockquote"}],
    toDOM: function toDOM() { return blockquoteDOM }
  },

  // :: NodeSpec A horizontal rule (`<hr>`).
  horizontal_rule: {
    group: "block",
    parseDOM: [{tag: "hr"}],
    toDOM: function toDOM() { return hrDOM }
  },

  // :: NodeSpec A heading textblock, with a `level` attribute that
  // should hold the number 1 to 6. Parsed and serialized as `<h1>` to
  // `<h6>` elements.
  heading: {
    attrs: {
      level: {default: 1},
      class: {
        default: 'pm-align--left'
      }
    },
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [{tag: "h1", getAttrs: node => { return {level: 1, textAlign: node.attributes ? node.attributes.class : node.attrs.class}}},
               {tag: "h2", getAttrs: node => { return {level: 2, textAlign: node.attributes ? node.attributes.class : node.attrs.class}}},
               {tag: "h3", getAttrs: node => { return {level: 3, textAlign: node.attributes ? node.attributes.class : node.attrs.class}}},
               {tag: "h4", getAttrs: node => { return {level: 4, textAlign: node.attributes ? node.attributes.class : node.attrs.class}}},
               {tag: "h5", getAttrs: node => { return {level: 5, textAlign: node.attributes ? node.attributes.class : node.attrs.class}}},
               {tag: "h6", getAttrs: node => { return {level: 6, textAlign: node.attributes ? node.attributes.class : node.attrs.class}}}],
    toDOM: function toDOM(node) { return ["h" + node.attrs.level, { class: node.attrs.class }, 0] }
  },

  // :: NodeSpec A code listing. Disallows marks or non-text inline
  // nodes by default. Represented as a `<pre>` element with a
  // `<code>` element inside of it.
  code_block: {
    content: "text*",
    marks: "",
    group: "block",
    code: true,
    defining: true,
	attrs: {params: {default: ""}, collapsed: {default: false}},
    //parseDOM: [{tag: "pre", preserveWhitespace: "full"}],
    //toDOM: function toDOM() { return preDOM }
	parseDOM: [{tag: "div", preserveWhitespace: "full", getAttrs: function (node) { return (
        {params: node.getAttribute("data-params") || ""}
    ); }}],
    toDOM: function toDOM(node) { return ["div", {"class": "codeSnippet hljs language-" + node.attrs.params + (node.attrs.collapsed ? " collapsed" : ""), "data-params": node.attrs.params, "spellcheck": "false"}, ["span", {"class": "snippetCollapser", "title": "Collapse"}, (node.attrs.collapsed ? "∨" : "∧")], ["div", 0]] }
  },

  // :: NodeSpec The text node.
  text: {
    group: "inline"
  },

  // :: NodeSpec An inline image (`<img>`) node. Supports `src`,
  // `alt`, and `href` attributes. The latter two default to the empty
  // string.
  image: {
    inline: true,
    attrs: {
      src: {},
      alt: {default: null},
      title: {default: null}
    },
    group: "inline",
    draggable: true,
    parseDOM: [{tag: "img[src]", getAttrs: function getAttrs(dom) {
      return {
        src: dom.getAttribute("src"),
        title: dom.getAttribute("title"),
        alt: dom.getAttribute("alt")
      }
    }}],
    toDOM: function toDOM(node) { var ref = node.attrs;
    var src = ref.src;
    var alt = ref.alt;
    var title = ref.title; return ["img", {src: src, alt: alt, title: title}] }
  },

  // :: NodeSpec A hard line break, represented in the DOM as `<br>`.
  hard_break: {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{tag: "br"}],
    toDOM: function toDOM() { return brDOM }
  },

    math_inline: {               // important!
        group: "inline math",
        content: "text*",        // important!
        inline: true,            // important!
        atom: true,              // important!
        toDOM: () => ["math-inline", { class: "math-node" }, 0],
        parseDOM: [{
            tag: "math-inline"   // important!
        }]
    },
    math_display: {              // important!
        group: "block math",
        content: "text*",        // important!
        atom: true,              // important!
        code: true,              // important!
        toDOM: () => ["math-display", { class: "math-node" }, 0],
        parseDOM: [{
            tag: "math-display"  // important!
        }]
    },
};

var emDOM = ["em", 0], strongDOM = ["strong", 0], codeDOM = ["code", 0], uDOM = ["u", 0];

// :: Object [Specs](#model.MarkSpec) for the marks in the schema.
var marks = {
  // :: MarkSpec A link. Has `href` and `title` attributes. `title`
  // defaults to the empty string. Rendered and parsed as an `<a>`
  // element.
  
  link: {
    attrs: {
      href: {},
      title: {default: null}
    },
    inclusive: false,
    parseDOM: [{tag: "a[href]", getAttrs: function getAttrs(dom) {
      return {href: dom.getAttribute("href"), title: dom.getAttribute("title")}
    }}],
    toDOM: function toDOM(node) { var ref = node.attrs;
    var href = ref.href;
    var title = ref.title; return ["a", {href: href, title: title}, 0] }
  },

  // :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
  // Has parse rules that also match `<i>` and `font-style: italic`.
  em: {
    parseDOM: [{tag: "i"}, {tag: "em"}, {style: "font-style=italic"}],
    toDOM: function toDOM() { return emDOM }
  },

  // :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
  // also match `<b>` and `font-weight: bold`.
  strong: {
    parseDOM: [{tag: "strong"},
               // This works around a Google Docs misbehavior where
               // pasted content will be inexplicably wrapped in `<b>`
               // tags with a font-weight normal.
               {tag: "b", getAttrs: function (node) { return node.style.fontWeight != "normal" && null; }},
               {style: "font-weight", getAttrs: function (value) { return /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null; }}],
    toDOM: function toDOM() { return strongDOM }
  },
  
  underline: {
    parseDOM: [{tag: "u"}],
    toDOM: function toDOM() { return uDOM }
  },

  // :: MarkSpec Code font mark. Represented as a `<code>` element.
  code: {
    parseDOM: [{tag: "span"}],
      toDOM: function toDOM() { return ["span", {"class": "hljs inline-code", "spellcheck": "false"}] }
  }
};

// :: Schema
// This schema roughly corresponds to the document schema used by
// [CommonMark](http://commonmark.org/), minus the list elements,
// which are defined in the [`prosemirror-schema-list`](#schema-list)
// module.
//
// To reuse elements from this schema, extend or read from its
// `spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
var schema = new prosemirrorModel.Schema({nodes: nodes, marks: marks});

exports.marks = marks;
exports.nodes = nodes;
exports.schema = schema;
//# sourceMappingURL=index.js.map
