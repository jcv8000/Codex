'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var prosemirrorKeymap = require('prosemirror-keymap');
var prosemirrorHistory = require('prosemirror-history');
var prosemirrorCommands = require('prosemirror-commands');
var prosemirrorState = require('prosemirror-state');
var prosemirrorDropcursor = require('prosemirror-dropcursor');
var prosemirrorGapcursor = require('prosemirror-gapcursor');
//var prosemirrorMenu = require('prosemirror-menu');
var prosemirrorMenu = require('./menu')
var prosemirrorSchemaList = require('prosemirror-schema-list');
var prosemirrorInputrules = require('prosemirror-inputrules');
const { highlightPlugin } = require('prosemirror-highlightjs');
const hljs = require('highlight.js');
var { tableEditing, columnResizing, isInTable } = require('prosemirror-tables');
var { arrow, addColumnAfter, addColumnBefore, deleteColumn, addRowAfter, addRowBefore, deleteRow,
    mergeCells, splitCell, setCellAttr, toggleHeaderRow, toggleHeaderColumn, toggleHeaderCell,
    goToNextCell, deleteTable } = require('prosemirror-tables');
var { Fragment } = require('prosemirror-model');
//const { schema } = require('./schema');
const { chainCommands } = require('prosemirror-commands');
const { mathPlugin, mathBackspaceCmd, insertMathCmd, mathSerializer, makeInlineMathInputRule, makeBlockMathInputRule, REGEX_BLOCK_MATH_DOLLARS, REGEX_INLINE_MATH_DOLLARS, mathSelectPlugin } = require('@benrbray/prosemirror-math');


// Defining my custom icons
var myIcons = {
    underline: {
        width: 875, height: 875,
        path: "M 166.25,746.00 C 161.50,750.75 160.00,757.00 160.00,771.62 160.00,785.62 161.88,791.50 167.38,794.38 169.88,795.62 181.12,796.12 215.62,796.62 240.38,797.00 274.12,797.88 290.62,798.62 308.38,799.38 398.12,799.88 511.25,799.88 724.00,799.88 705.25,800.62 711.75,790.75 715.00,785.88 715.12,785.00 714.75,771.75 714.38,758.88 714.13,757.50 710.88,752.88 708.88,750.00 705.75,747.12 704.00,746.38 701.63,745.50 635.50,745.00 483.75,745.12 340.25,745.12 263.75,744.75 257.50,743.88 252.38,743.12 230.50,742.50 209.00,742.50 209.00,742.50 169.75,742.50 169.75,742.50 169.75,742.50 166.25,746.00 166.25,746.00 Z M 133.38,64.75 C 128.12,65.37 125.00,71.37 125.00,80.62 125.13,92.37 126.88,93.62 147.88,96.75 155.38,97.87 162.50,99.75 166.00,101.62 169.25,103.25 176.00,106.12 181.00,108.00 186.00,110.00 190.62,112.50 191.25,113.75 192.00,115.13 194.75,118.62 197.50,121.88 200.13,125.00 203.12,129.62 203.88,132.25 205.13,135.75 205.50,180.13 205.88,325.62 206.12,451.12 206.62,518.62 207.63,526.88 208.50,535.38 210.00,542.00 212.50,547.50 214.38,552.00 216.88,560.00 218.12,565.38 219.63,572.50 221.25,576.38 224.38,580.38 226.75,583.25 230.13,588.38 232.00,591.88 236.62,600.62 242.25,607.25 258.25,623.12 267.38,632.25 274.62,638.25 279.75,641.00 283.88,643.25 289.62,647.00 292.38,649.38 295.25,651.62 300.75,654.75 304.75,656.12 308.62,657.50 314.12,659.88 316.88,661.38 329.00,668.00 331.38,668.88 342.00,670.75 348.12,671.75 358.25,674.25 364.38,676.25 381.13,681.75 392.00,682.88 430.62,683.00 468.63,683.12 480.12,681.88 493.25,676.75 497.38,675.00 507.38,672.00 515.50,670.00 523.62,668.00 532.62,665.12 535.50,663.62 538.25,662.12 544.62,658.88 549.38,656.50 554.25,654.12 560.62,650.38 563.75,648.12 566.88,645.88 571.62,642.88 574.38,641.50 580.38,638.38 609.25,610.38 614.75,602.38 616.88,599.12 621.12,593.62 624.12,590.12 627.12,586.62 630.38,581.38 631.12,578.50 632.00,575.62 634.38,570.50 636.25,567.00 639.88,560.50 643.50,547.25 646.25,530.00 647.12,524.88 648.88,515.88 650.25,510.00 652.75,499.88 652.88,494.50 653.25,394.38 653.88,246.50 654.75,178.88 656.12,164.00 657.75,146.25 660.62,138.12 671.63,120.87 675.75,114.25 680.12,111.50 691.88,108.12 696.00,107.00 702.00,104.50 705.12,102.50 712.88,97.75 718.75,96.25 729.38,96.25 740.25,96.12 747.62,94.50 749.62,91.75 750.62,90.50 751.25,85.87 751.25,81.00 751.25,71.00 749.25,67.00 743.38,65.12 740.88,64.38 697.12,64.00 626.00,64.25 626.00,64.25 512.62,64.50 512.62,64.50 512.62,64.50 509.38,67.50 509.38,67.50 504.38,72.25 502.25,82.87 505.12,89.12 507.13,93.50 511.13,94.87 526.00,96.37 535.25,97.25 541.50,98.62 546.75,100.87 551.00,102.62 559.38,105.75 565.62,107.87 575.12,111.00 577.75,112.63 583.12,118.00 596.62,131.50 599.50,137.87 603.12,162.75 604.25,170.13 606.25,181.12 607.75,187.12 610.38,198.00 610.38,200.25 610.88,339.50 610.88,339.50 611.38,480.88 611.38,480.88 611.38,480.88 608.25,496.37 608.25,496.37 606.50,504.88 604.12,518.00 603.12,525.62 600.62,542.88 599.38,546.75 594.25,553.75 592.00,557.00 589.12,562.12 587.88,565.38 585.00,572.75 578.38,581.38 566.75,593.00 556.25,603.38 547.62,609.88 537.12,615.12 533.00,617.25 527.50,620.38 525.12,621.88 519.00,625.88 509.88,628.00 476.62,633.25 476.62,633.25 448.12,637.75 448.12,637.75 448.12,637.75 428.75,635.00 428.75,635.00 402.00,631.25 380.50,626.38 375.38,622.88 373.00,621.25 367.00,618.00 362.12,615.62 355.25,612.50 350.25,608.62 341.13,599.75 327.75,586.75 319.00,574.38 314.25,561.75 312.50,557.12 309.50,549.88 307.50,545.62 299.38,528.88 298.75,511.50 298.75,314.38 298.75,139.12 299.00,131.62 304.12,121.75 307.62,115.00 315.38,109.00 327.00,103.87 340.25,98.00 346.25,96.50 362.75,95.50 377.00,94.62 380.62,92.75 381.88,85.25 382.88,79.00 380.88,70.25 377.50,67.00 377.50,67.00 374.88,64.38 374.88,64.38 374.88,64.38 255.88,64.38 255.88,64.38 190.38,64.38 135.25,64.50 133.38,64.75 Z"
    },
    leftAlign: {
        width: 24, height: 24,
        path: "M 17.00,18.00 C 17.00,18.00 3.00,18.00 3.00,18.00M 21.00,14.00 C 21.00,14.00 3.00,14.00 3.00,14.00M 21.00,6.00 C 21.00,6.00 3.00,6.00 3.00,6.00M 17.00,10.00 C 17.00,10.00 3.00,10.00 3.00,10.00",
        stroke: "currentColor",
        scale: 1.5,
        strokeWidth: 1.5
    },
    centerAlign: {
        width: 24, height: 24,
        path: "M 18.00,18.00 C 18.00,18.00 6.00,18.00 6.00,18.00M 21.00,14.00 C 21.00,14.00 3.00,14.00 3.00,14.00M 21.00,6.00 C 21.00,6.00 3.00,6.00 3.00,6.00M 18.00,10.00 C 18.00,10.00 6.00,10.00 6.00,10.00",
        stroke: "currentColor",
        scale: 1.5,
        strokeWidth: 1.5
    },
    rightAlign: {
        width: 24, height: 24,
        path: "M 21.00,18.00 C 21.00,18.00 7.00,18.00 7.00,18.00M 21.00,14.00 C 21.00,14.00 3.00,14.00 3.00,14.00M 21.00,6.00 C 21.00,6.00 3.00,6.00 3.00,6.00M 21.00,10.00 C 21.00,10.00 7.00,10.00 7.00,10.00",
        stroke: "currentColor",
        scale: 1.5,
        strokeWidth: 1.5
    }
};



var prefix = "ProseMirror-prompt";

function openPrompt(options) {
    var wrapper = document.body.appendChild(document.createElement("div"));
    wrapper.className = prefix;

    var mouseOutside = function (e) { if (!wrapper.contains(e.target)) { close(); } };
    setTimeout(function () { return window.addEventListener("mousedown", mouseOutside); }, 50);
    var close = function () {
        window.removeEventListener("mousedown", mouseOutside);
        if (wrapper.parentNode) { wrapper.parentNode.removeChild(wrapper); }
    };

    var domFields = [];
    for (var name in options.fields) { domFields.push(options.fields[name].render()); }

    var submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = prefix + "-submit";
    submitButton.textContent = "OK";
    var cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = prefix + "-cancel";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", close);

    var form = wrapper.appendChild(document.createElement("form"));
    if (options.title) { form.appendChild(document.createElement("h5")).textContent = options.title; }
    domFields.forEach(function (field) {
        form.appendChild(document.createElement("div")).appendChild(field);
    });
    var buttons = form.appendChild(document.createElement("div"));
    buttons.className = prefix + "-buttons";
    buttons.appendChild(submitButton);
    buttons.appendChild(document.createTextNode(" "));
    buttons.appendChild(cancelButton);

    var box = wrapper.getBoundingClientRect();
    wrapper.style.top = ((window.innerHeight - box.height) / 2) + "px";
    wrapper.style.left = ((window.innerWidth - box.width) / 2) + "px";

    var submit = function () {
        var params = getValues(options.fields, domFields);
        if (params) {
            close();
            options.callback(params);
        }
    };

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        submit();
    });

    form.addEventListener("keydown", function (e) {
        if (e.keyCode == 27) {
            e.preventDefault();
            close();
        } else if (e.keyCode == 13 && !(e.ctrlKey || e.metaKey || e.shiftKey)) {
            e.preventDefault();
            submit();
        } else if (e.keyCode == 9) {
            window.setTimeout(function () {
                if (!wrapper.contains(document.activeElement)) { close(); }
            }, 500);
        }
    });

    var input = form.elements[0];
    if (input) { input.focus(); }
}

function getValues(fields, domFields) {
    var result = Object.create(null), i = 0;
    for (var name in fields) {
        var field = fields[name], dom = domFields[i++];
        var value = field.read(dom), bad = field.validate(value);
        if (bad) {
            reportInvalid(dom, bad);
            return null
        }
        result[name] = field.clean(value);
    }
    return result
}

function reportInvalid(dom, message) {
    // FIXME this is awful and needs a lot more work
    var parent = dom.parentNode;
    var msg = parent.appendChild(document.createElement("div"));
    msg.style.left = (dom.offsetLeft + dom.offsetWidth + 2) + "px";
    msg.style.top = (dom.offsetTop - 5) + "px";
    msg.className = "ProseMirror-invalid";
    msg.textContent = message;
    setTimeout(function () { return parent.removeChild(msg); }, 1500);
}

// ::- The type of field that `FieldPrompt` expects to be passed to it.
var Field = function Field(options) { this.options = options; };

// render:: (state: EditorState, props: Object) → dom.Node
// Render the field to the DOM. Should be implemented by all subclasses.

// :: (dom.Node) → any
// Read the field's value from its DOM node.
Field.prototype.read = function read(dom) { return dom.value };

// :: (any) → ?string
// A field-type-specific validation function.
Field.prototype.validateType = function validateType(_value) { };

Field.prototype.validate = function validate(value) {
    if (!value && this.options.required) { return "Required field" }
    return this.validateType(value) || (this.options.validate && this.options.validate(value))
};

Field.prototype.clean = function clean(value) {
    return this.options.clean ? this.options.clean(value) : value
};

// ::- A field class for single-line text fields.
var TextField = /*@__PURE__*/(function (Field) {
    function TextField() {
        Field.apply(this, arguments);
    }

    if (Field) TextField.__proto__ = Field;
    TextField.prototype = Object.create(Field && Field.prototype);
    TextField.prototype.constructor = TextField;

    TextField.prototype.render = function render() {
        var input = document.createElement("input");
        input.type = "text";
        input.placeholder = this.options.label;
        input.value = this.options.value || "";
        input.autocomplete = "off";
        return input
    };

    return TextField;
}(Field));

// Helpers to create specific types of items

function canInsert(state, nodeType) {
    var $from = state.selection.$from;
    for (var d = $from.depth; d >= 0; d--) {
        var index = $from.index(d);
        if ($from.node(d).canReplaceWith(index, index, nodeType)) { return true }
    }
    return false
}

function insertImageItem(nodeType) {
    return new prosemirrorMenu.MenuItem({
        title: "Insert image",
        label: "Image",
        enable: function enable(state) { return canInsert(state, nodeType) },
        run: function run(state, _, view) {
            var ref = state.selection;
            var from = ref.from;
            var to = ref.to;
            var attrs = null;
            if (state.selection instanceof prosemirrorState.NodeSelection && state.selection.node.type == nodeType) { attrs = state.selection.node.attrs; }
            openPrompt({
                title: "Insert image",
                fields: {
                    src: new TextField({ label: "Location", required: true, value: attrs && attrs.src }),
                    title: new TextField({ label: "Title", value: attrs && attrs.title }),
                    alt: new TextField({
                        label: "Description",
                        value: attrs ? attrs.alt : state.doc.textBetween(from, to, " ")
                    })
                },
                callback: function callback(attrs) {
                    view.dispatch(view.state.tr.replaceSelectionWith(nodeType.createAndFill(attrs)));
                    view.focus();
                }
            });
        }
    })
}

function cmdItem(cmd, options) {
    var passedOptions = {
        label: options.title,
        run: cmd
    };
    for (var prop in options) { passedOptions[prop] = options[prop]; }
    if ((!options.enable || options.enable === true) && !options.select) { passedOptions[options.enable ? "enable" : "select"] = function (state) { return cmd(state); }; }

    passedOptions.enable = passedOptions.select;
    passedOptions.select = function select(state) { return true; }

    return new prosemirrorMenu.MenuItem(passedOptions)
}

function markActive(state, type) {
    var ref = state.selection;
    var from = ref.from;
    var $from = ref.$from;
    var to = ref.to;
    var empty = ref.empty;
    if (empty) { return type.isInSet(state.storedMarks || $from.marks()) }
    else { return state.doc.rangeHasMark(from, to, type) }
}

function markItem(markType, options) {
    var passedOptions = {
        active: function active(state) { return markActive(state, markType) },
        select: function select(state) {
            return !isCursorInCodeBlock(state);
        }
    };
    for (var prop in options) { passedOptions[prop] = options[prop]; }
    return cmdItem(prosemirrorCommands.toggleMark(markType), passedOptions)
}

function linkItem(markType) {
    return new prosemirrorMenu.MenuItem({
        title: "Add or remove link",
        icon: prosemirrorMenu.icons.link,
        active: function active(state) { return markActive(state, markType) },
        enable: function enable(state) {
            if (isCursorInCodeBlock(state)) {
                return false;
            }
            return !state.selection.empty 
        },
        run: function run(state, dispatch, view) {
            if (markActive(state, markType)) {
                prosemirrorCommands.toggleMark(markType)(state, dispatch);
                return true
            }
            openPrompt({
                title: "Create a link",
                fields: {
                    href: new TextField({
                        label: "Link target",
                        required: true
                    }),
                    title: new TextField({ label: "Title" })
                },
                callback: function callback(attrs) {
                    if (attrs.href.startsWith("http://") == false && attrs.href.startsWith("https://") == false) {
                        attrs.href = "http://" + attrs.href;
                    }
                    if (!attrs.title) {
                        attrs.title = attrs.href;
                    }
                    prosemirrorCommands.toggleMark(markType, attrs)(view.state, view.dispatch);
                    view.focus();
                }
            });
        }
    })
}

function wrapListItem(nodeType, options) {
    return cmdItem(prosemirrorSchemaList.wrapInList(nodeType, options.attrs), options)
}


// :: (Schema) → Object
// Given a schema, look for default mark and node types in it and
// return an object with relevant menu items relating to those marks:
//
// **`toggleStrong`**`: MenuItem`
//   : A menu item to toggle the [strong mark](#schema-basic.StrongMark).
//
// **`toggleEm`**`: MenuItem`
//   : A menu item to toggle the [emphasis mark](#schema-basic.EmMark).
//
// **`toggleCode`**`: MenuItem`
//   : A menu item to toggle the [code font mark](#schema-basic.CodeMark).
//
// **`toggleLink`**`: MenuItem`
//   : A menu item to toggle the [link mark](#schema-basic.LinkMark).
//
// **`insertImage`**`: MenuItem`
//   : A menu item to insert an [image](#schema-basic.Image).
//
// **`wrapBulletList`**`: MenuItem`
//   : A menu item to wrap the selection in a [bullet list](#schema-list.BulletList).
//
// **`wrapOrderedList`**`: MenuItem`
//   : A menu item to wrap the selection in an [ordered list](#schema-list.OrderedList).
//
// **`wrapBlockQuote`**`: MenuItem`
//   : A menu item to wrap the selection in a [block quote](#schema-basic.BlockQuote).
//
// **`makeParagraph`**`: MenuItem`
//   : A menu item to set the current textblock to be a normal
//     [paragraph](#schema-basic.Paragraph).
//
// **`makeCodeBlock`**`: MenuItem`
//   : A menu item to set the current textblock to be a
//     [code block](#schema-basic.CodeBlock).
//
// **`makeHead[N]`**`: MenuItem`
//   : Where _N_ is 1 to 6. Menu items to set the current textblock to
//     be a [heading](#schema-basic.Heading) of level _N_.
//
// **`insertHorizontalRule`**`: MenuItem`
//   : A menu item to insert a horizontal rule.
//
// The return value also contains some prefabricated menu elements and
// menus, that you can use instead of composing your own menu from
// scratch:
//
// **`insertMenu`**`: Dropdown`
//   : A dropdown containing the `insertImage` and
//     `insertHorizontalRule` items.
//
// **`typeMenu`**`: Dropdown`
//   : A dropdown containing the items for making the current
//     textblock a paragraph, code block, or heading.
//
// **`fullMenu`**`: [[MenuElement]]`
//   : An array of arrays of menu elements for use as the full menu
//     for, for example the [menu bar](https://github.com/prosemirror/prosemirror-menu#user-content-menubar).
function buildMenuItems(schema) {
    var r = {}, type;
    if (type = schema.marks.strong) { r.toggleStrong = markItem(type, { title: "Toggle strong style", icon: prosemirrorMenu.icons.strong }); }
    if (type = schema.marks.em) { r.toggleEm = markItem(type, { title: "Toggle emphasis", icon: prosemirrorMenu.icons.em }); }
    if (type = schema.marks.code) { r.toggleCode = markItem(type, { title: "Toggle inline code", icon: prosemirrorMenu.icons.code }); }
    if (type = schema.marks.link) { r.toggleLink = linkItem(type); }
    if (type = schema.marks.underline) { r.toggleUnderline = markItem(type, { title: "Toggle underline", icon: myIcons.underline }); }

    if (type = schema.nodes.image) { r.insertImage = insertImageItem(type); }
    if (type = schema.nodes.bullet_list) {
        r.wrapBulletList = wrapListItem(type, {
            title: "Wrap in bullet list",
            icon: prosemirrorMenu.icons.bulletList
        });
    }
    if (type = schema.nodes.ordered_list) {
        r.wrapOrderedList = wrapListItem(type, {
            title: "Wrap in ordered list",
            icon: prosemirrorMenu.icons.orderedList
        });
    }
    if (type = schema.nodes.blockquote) {
        r.wrapBlockQuote = prosemirrorMenu.wrapItem(type, {
            title: "Wrap in block quote",
            icon: prosemirrorMenu.icons.blockquote
        });
    }
    if (type = schema.nodes.paragraph) {
        r.makeParagraph = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to paragraph",
            label: "Plain Text"
        });
    }
    if (type = schema.nodes.code_block) {
        r.makeCodeBlock = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to code block",
            label: "Code",
            run: makeCodeBlock("")
        });
        r.makeArduino = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Arduino code block",
            label: "Arduino (C++)",
            attrs: { params: "arduino" },
            run: makeCodeBlock("arduino")
        });
        r.makeARM = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to ARM code block",
            label: "ARM Assembly",
            attrs: { params: "arm" },
            run: makeCodeBlock("arm")
        });
        r.makeBAT = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Batch/DOS code block",
            label: "Batch/DOS",
            attrs: { params: "bat" },
            run: makeCodeBlock("bat")
        });
        r.makeCoffee = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to CoffeeScript code block",
            label: "CoffeeScript",
            attrs: { params: "coffeescript" },
            run: makeCodeBlock("coffeescript")
        });
        r.makeCmake = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to CMake code block",
            label: "CMake",
            attrs: { params: "cmake" },
            run: makeCodeBlock("cmake")
        });
        r.makeCS = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to C# code block",
            label: "C#",
            attrs: { params: "cs" },
            run: makeCodeBlock("cs")
        });
        r.makeCPP = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to C++ code block",
            label: "C++",
            attrs: { params: "cpp" },
            run: makeCodeBlock("cpp")
        });
        r.makeC = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to C code block",
            label: "C",
            attrs: { params: "c" },
            run: makeCodeBlock("c")
        });
        r.makeCSS = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to CSS code block",
            label: "CSS",
            attrs: { params: "css" },
            run: makeCodeBlock("css")
        });
        r.makeGo = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Go code block",
            label: "Go",
            attrs: { params: "go" },
            run: makeCodeBlock("go")
        });
        r.makeGradle = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Gradle code block",
            label: "Gradle",
            attrs: { params: "gradle" },
            run: makeCodeBlock("gradle")
        });
        r.makeGroovy = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Groovy code block",
            label: "Groovy",
            attrs: { params: "groovy" },
            run: makeCodeBlock("groovy")
        });
        r.makeHTML = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to HTML code block",
            label: "HTML",
            attrs: { params: "html" },
            run: makeCodeBlock("html")
        });
        r.makeHTTP = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to HTTP code block",
            label: "HTTP",
            attrs: { params: "http" },
            run: makeCodeBlock("http")
        });
        r.makeJava = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Java code block",
            label: "Java",
            attrs: { params: "java" },
            run: makeCodeBlock("java")
        });
        r.makeJS = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to JavaScript code block",
            label: "JavaScript",
            attrs: { params: "js" },
            run: makeCodeBlock("js")
        });
        r.makeJSON = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to JSON code block",
            label: "JSON",
            attrs: { params: "json" },
            run: makeCodeBlock("json")
        });
        r.makeLatex = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to LaTeX code block",
            label: "LaTeX",
            attrs: { params: "tex" },
            run: makeCodeBlock("tex")
        });
        r.makeLess = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Less code block",
            label: "Less",
            attrs: { params: "less" },
            run: makeCodeBlock("less")
        });
        r.makeLisp = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Lisp code block",
            label: "Lisp",
            attrs: { params: "lisp" },
            run: makeCodeBlock("lisp")
        });
        r.makeLua = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Lua code block",
            label: "Lua",
            attrs: { params: "lua" },
            run: makeCodeBlock("lua")
        });
        r.makeMakefile = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Makefile code block",
            label: "Makefile",
            attrs: { params: "makefile" },
            run: makeCodeBlock("makefile")
        });
        r.makeMarkdown = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Markdown code block",
            label: "Markdown",
            attrs: { params: "markdown" },
            run: makeCodeBlock("markdown")
        });
        r.makeMathematica = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Mathematica code block",
            label: "Mathematica",
            attrs: { params: "mathematica" },
            run: makeCodeBlock("mathematica")
        });
        r.makeMatlab = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Matlab code block",
            label: "Matlab",
            attrs: { params: "matlab" },
            run: makeCodeBlock("matlab")
        });
        r.makeNim = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Nim code block",
            label: "Nim",
            attrs: { params: "nim" },
            run: makeCodeBlock("nim")
        });
        r.makeObjectiveC = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Objective C code block",
            label: "Objective C",
            attrs: { params: "objectivec" },
            run: makeCodeBlock("objectivec")
        });
        r.makeOCaml = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to OCaml code block",
            label: "OCaml",
            attrs: { params: "ocaml" },
            run: makeCodeBlock("ocaml")
        });
        r.makeGLSL = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to GLSL code block",
            label: "GLSL",
            attrs: { params: "glsl" },
            run: makeCodeBlock("glsl")
        });
        r.makePerl = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Perl code block",
            label: "Perl",
            attrs: { params: "perl" },
            run: makeCodeBlock("perl")
        });
        r.makePHP = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to PHP code block",
            label: "PHP",
            attrs: { params: "php" },
            run: makeCodeBlock("php")
        });
        r.makePS = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to PowerShell code block",
            label: "PowerShell",
            attrs: { params: "ps" },
            run: makeCodeBlock("ps")
        });
        r.makePY = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Python code block",
            label: "Python",
            attrs: { params: "py" },
            run: makeCodeBlock("py")
        });
        r.makeR = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to R code block",
            label: "R",
            attrs: { params: "r" },
            run: makeCodeBlock("r")
        });
        r.makeRuby = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Ruby code block",
            label: "Ruby",
            attrs: { params: "ruby" },
            run: makeCodeBlock("ruby")
        });
        r.makeRust = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Rust code block",
            label: "Rust",
            attrs: { params: "rust" },
            run: makeCodeBlock("rust")
        });
        r.makeSQL = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to SQL code block",
            label: "SQL",
            attrs: { params: "sql" },
            run: makeCodeBlock("sql")
        });
        r.makeShell = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Shell code block",
            label: "Shell",
            attrs: { params: "shell" },
            run: makeCodeBlock("shell")
        });
        r.makeSwift = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to Swift code block",
            label: "Swift",
            attrs: { params: "swift" },
            run: makeCodeBlock("swift")
        });
        r.makeTS = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to TypeScript code block",
            label: "TypeScript",
            attrs: { params: "ts" },
            run: makeCodeBlock("ts")
        });
        r.makeX86 = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to x86 Assembly code block",
            label: "x86 Assembly",
            attrs: { params: "x86asm" },
            run: makeCodeBlock("x86asm")
        });
        r.makeYAML = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to YAML code block",
            label: "YAML",
            attrs: { params: "yml" },
            run: makeCodeBlock("yml")
        });
        r.makeOther = prosemirrorMenu.blockTypeItem(type, {
            title: "Change to code block",
            label: "Other",
            run: makeCodeBlock("")
        });
    }
    if (type = schema.nodes.heading) {
        for (var i = 1; i <= 10; i++) {
            r["makeHead" + i] = prosemirrorMenu.blockTypeItem(type, {
                title: "Change to heading " + i,
                label: "Level " + i,
                attrs: { level: i }
            });
        }

    }
    if (type = schema.nodes.horizontal_rule) {
        var hr = type;
        r.insertHorizontalRule = new prosemirrorMenu.MenuItem({
            title: "Insert horizontal rule",
            label: "Horizontal rule",
            enable: function enable(state) { return (canInsert(state, hr) && !isInTable(state) && !isCursorInCodeBlock(state)) },
            run: function run(state, dispatch) {
                if (!isInTable(state) && !isCursorInCodeBlock(state))
                    dispatch(state.tr.replaceSelectionWith(hr.create()));
            }
        });
    }

    if (type = schema.nodes.table) {
        r.insertTable = new prosemirrorMenu.MenuItem({
            label: "Table",
            run: insertTable,
            enable: function enable(state) {
                return !isInTable(state) && !isCursorInCodeBlock(state);
            }
        });
    }

    r.alignLeft = new prosemirrorMenu.MenuItem({
        title: "Align text to left",
        icon: myIcons.leftAlign,
        run: alignSelection("left"),
        enable: function enable(state) {
            return !isCursorInCodeBlock(state);
        }
    });
    r.alignCenter = new prosemirrorMenu.MenuItem({
        title: "Align text to center",
        icon: myIcons.centerAlign,
        run: alignSelection("center"),
        enable: function enable(state) {
            return !isCursorInCodeBlock(state);
        }
    });
    r.alignRight = new prosemirrorMenu.MenuItem({
        title: "Align text to right",
        icon: myIcons.rightAlign,
        run: alignSelection("right"),
        enable: function enable(state) {
            return !isCursorInCodeBlock(state);
        }
    });

    r.InsertBlockEquation = new prosemirrorMenu.MenuItem({
        title: "Insert block KaTeX equation",
        label: "Block KaTeX equation",
        run: insertMathCmd(schema.nodes.math_display),
        enable: function enable(state) {
            return !isCursorInCodeBlock(state);
        }
    });

    r.InsertInlineEquation = new prosemirrorMenu.MenuItem({
        title: "Insert inline KaTeX equation",
        label: "Inline KaTeX equation",
        run: insertMathCmd(schema.nodes.math_inline),
        enable: function enable(state) {
            return !isCursorInCodeBlock(state);
        }
    });

    var cut = function (arr) { return arr.filter(function (x) { return x; }); };
    r.insertMenu = new prosemirrorMenu.Dropdown(cut([r.insertImage, r.insertHorizontalRule, r.insertTable/*, r.InsertInlineEquation, r.InsertBlockEquation*/]), { label: "Insert" });
    r.typeMenu = new prosemirrorMenu.Dropdown(cut([r.makeParagraph,
    r.makeCodeBlock && new prosemirrorMenu.DropdownSubmenu(cut([
        r.makeArduino, r.makeARM, r.makeBAT, r.makeCoffee, r.makeCmake, r.makeCS, r.makeCPP, r.makeC, r.makeCSS, r.makeGo, r.makeGLSL, r.makeGradle, r.makeGroovy, r.makeOther
    ]), { label: "Code (A-G)" }),
    r.makeCodeBlock && new prosemirrorMenu.DropdownSubmenu(cut([
        r.makeHTML, r.makeHTTP, r.makeJava, r.makeJS, r.makeJSON, r.makeLatex, r.makeLess, r.makeLisp, r.makeLua, r.makeMakefile, r.makeMarkdown, r.makeMathematica, r.makeMatlab, r.makeOther
    ]), { label: "Code (H-M)" }),
    r.makeCodeBlock && new prosemirrorMenu.DropdownSubmenu(cut([
        r.makeNim, r.makeObjectiveC, r.makeOCaml, r.makePerl, r.makePHP, r.makePS, r.makePY, r.makeR, r.makeRuby, r.makeRust, r.makeSQL, r.makeShell, r.makeSwift, r.makeTS, r.makeX86, r.makeYAML, r.makeOther
    ]), { label: "Code (N-Z)" })
        , r.makeHead1 && new prosemirrorMenu.DropdownSubmenu(cut([
            r.makeHead1, r.makeHead2, r.makeHead3, r.makeHead4, r.makeHead5, r.makeHead6
        ]), { label: "Heading" })]), { label: "Type..." });

    r.inlineMenu = [cut([prosemirrorMenu.undoItem, prosemirrorMenu.redoItem]), cut([r.toggleStrong, r.toggleEm, r.toggleUnderline, r.toggleCode, r.toggleLink])];
    r.blockMenu = [cut([r.alignLeft, r.alignCenter, r.alignRight]), cut([r.wrapBulletList, r.wrapOrderedList, r.wrapBlockQuote,/*, prosemirrorMenu.joinUpItem,
                      prosemirrorMenu.liftItem,*/ prosemirrorMenu.selectParentNodeItem])];
    r.fullMenu = r.inlineMenu.concat([[r.insertMenu, r.typeMenu]], r.blockMenu);

    return r
}

var mac = typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false;

// :: (Schema, ?Object) → Object
// Inspect the given schema looking for marks and nodes from the
// basic schema, and if found, add key bindings related to them.
// This will add:
//
// * **Mod-b** for toggling [strong](#schema-basic.StrongMark)
// * **Mod-i** for toggling [emphasis](#schema-basic.EmMark)
// * **Mod-`** for toggling [code font](#schema-basic.CodeMark)
// * **Ctrl-Shift-0** for making the current textblock a paragraph
// * **Ctrl-Shift-1** to **Ctrl-Shift-Digit6** for making the current
//   textblock a heading of the corresponding level
// * **Ctrl-Shift-Backslash** to make the current textblock a code block
// * **Ctrl-Shift-8** to wrap the selection in an ordered list
// * **Ctrl-Shift-9** to wrap the selection in a bullet list
// * **Ctrl->** to wrap the selection in a block quote
// * **Enter** to split a non-empty textblock in a list item while at
//   the same time splitting the list item
// * **Mod-Enter** to insert a hard break
// * **Mod-_** to insert a horizontal rule
// * **Backspace** to undo an input rule
// * **Alt-ArrowUp** to `joinUp`
// * **Alt-ArrowDown** to `joinDown`
// * **Mod-BracketLeft** to `lift`
// * **Escape** to `selectParentNode`
//
// You can suppress or map these bindings by passing a `mapKeys`
// argument, which maps key names (say `"Mod-B"` to either `false`, to
// remove the binding, or a new key name string.
function buildKeymap(schema, mapKeys) {
    var keys = {}, type;
    function bind(key, cmd) {
        if (mapKeys) {
            var mapped = mapKeys[key];
            if (mapped === false) { return }
            if (mapped) { key = mapped; }
        }
        keys[key] = cmd;
    }


    bind("Mod-z", prosemirrorHistory.undo);
    bind("Shift-Mod-z", prosemirrorHistory.redo);
    bind("Backspace", prosemirrorInputrules.undoInputRule);
    if (!mac) { bind("Mod-y", prosemirrorHistory.redo); }

    /*bind("Alt-ArrowUp", prosemirrorCommands.joinUp);
    bind("Alt-ArrowDown", prosemirrorCommands.joinDown);
    bind("Mod-BracketLeft", prosemirrorCommands.lift);
    bind("Escape", prosemirrorCommands.selectParentNode);*/

    if (type = schema.marks.strong) {
        bind("Mod-b", prosemirrorCommands.toggleMark(type));
        bind("Mod-B", prosemirrorCommands.toggleMark(type));
    }
    if (type = schema.marks.em) {
        bind("Mod-i", prosemirrorCommands.toggleMark(type));
        bind("Mod-I", prosemirrorCommands.toggleMark(type));
    }
    if (type = schema.marks.underline) {
        bind("Mod-u", prosemirrorCommands.toggleMark(type));
        bind("Mod-U", prosemirrorCommands.toggleMark(type));
    }
    if (type = schema.marks.code) { bind("Mod-/", prosemirrorCommands.toggleMark(type)); }

    /*if (type = schema.nodes.bullet_list)
      { bind("Shift-Ctrl-8", prosemirrorSchemaList.wrapInList(type)); }
    if (type = schema.nodes.ordered_list)
      { bind("Shift-Ctrl-9", prosemirrorSchemaList.wrapInList(type)); }*/
    if (type = schema.nodes.blockquote) { bind("Ctrl->", prosemirrorCommands.wrapIn(type)); }
    if (type = schema.nodes.hard_break) {
        var br = type, cmd = prosemirrorCommands.chainCommands(prosemirrorCommands.exitCode, function (state, dispatch) {
            dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView());
            return true
        });
        function onshiftenter(state, dispatch) {
            if (isInTable(state)) {
                addRowAfter(state, dispatch);
                state.apply(state.tr);
                arrow("vert", 1)(view.state, dispatch, window.view);
            }
            else {
                prosemirrorCommands.exitCode(state, dispatch);
                //dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView());
            }
        }
        bind("Mod-Enter", onshiftenter);
        bind("Shift-Enter", onshiftenter);
        if (mac) { bind("Ctrl-Enter", onshiftenter); }
    }
    if (type = schema.nodes.list_item) {
        //bind("Enter", prosemirrorSchemaList.splitListItem(type));
        /*bind("Mod-[", prosemirrorSchemaList.liftListItem(type));
        bind("Mod-]", prosemirrorSchemaList.sinkListItem(type));*/
    }

    if (type = schema.nodes.code_block) {
        //chainCommands(newlineInCode, createParagraphNear, liftEmptyBlock, splitBlock)
        //bind("Enter", customEnter);
        bind("Enter", chainCommands(prosemirrorSchemaList.splitListItem(schema.nodes.list_item), codeBlockEnter))
    }

    /*if (type = schema.nodes.paragraph)
      { bind("Shift-Ctrl-0", prosemirrorCommands.setBlockType(type)); }
    if (type = schema.nodes.code_block)
      { bind("Shift-Ctrl-\\", makeCodeBlock("")); }*/
    /*if (type = schema.nodes.heading)
      { for (var i = 1; i <= 6; i++) { bind("Shift-Ctrl-" + i, prosemirrorCommands.setBlockType(type, {level: i})); } }*/
    if (type = schema.nodes.horizontal_rule) {
        var hr = type;
        bind("Mod-_", function (state, dispatch) {
            dispatch(state.tr.replaceSelectionWith(hr.create()).scrollIntoView());
            return true
        });
    }

    if (type = schema.nodes.heading) {
        bind("Mod-1", prosemirrorCommands.setBlockType(type, {level: 1}));
        bind("Mod-2", prosemirrorCommands.setBlockType(type, {level: 2}));
        bind("Mod-3", prosemirrorCommands.setBlockType(type, {level: 3}));
        bind("Mod-4", prosemirrorCommands.setBlockType(type, {level: 4}));
        bind("Mod-5", prosemirrorCommands.setBlockType(type, {level: 5}));
        bind("Mod-6", prosemirrorCommands.setBlockType(type, {level: 6}));
    }

    return keys
}

// : (NodeType) → InputRule
// Given a blockquote node type, returns an input rule that turns `"> "`
// at the start of a textblock into a blockquote.
function blockQuoteRule(nodeType) {
    return prosemirrorInputrules.wrappingInputRule(/^\s*>\s$/, nodeType)
}

// : (NodeType) → InputRule
// Given a list node type, returns an input rule that turns a number
// followed by a dot at the start of a textblock into an ordered list.
function orderedListRule(nodeType) {
    return prosemirrorInputrules.wrappingInputRule(/^(\d+)\.\s$/, nodeType, function (match) { return ({ order: +match[1] }); },
        function (match, node) { return node.childCount + node.attrs.order == +match[1]; })
}

// : (NodeType) → InputRule
// Given a list node type, returns an input rule that turns a bullet
// (dash, plush, or asterisk) at the start of a textblock into a
// bullet list.
function bulletListRule(nodeType) {
    return prosemirrorInputrules.wrappingInputRule(/^\s*([-+*])\s$/, nodeType)
}

// : (NodeType) → InputRule
// Given a code block node type, returns an input rule that turns a
// textblock starting with three backticks into a code block.
function codeBlockRule(nodeType) {
    return prosemirrorInputrules.textblockTypeInputRule(/^```$/, nodeType)
}

// : (NodeType, number) → InputRule
// Given a node type and a maximum level, creates an input rule that
// turns up to that number of `#` characters followed by a space at
// the start of a textblock into a heading whose level corresponds to
// the number of `#` signs.
function headingRule(nodeType, maxLevel) {
    return prosemirrorInputrules.textblockTypeInputRule(new RegExp("^(#{1," + maxLevel + "})\\s$"),
        nodeType, function (match) { return ({ level: match[1].length }); })
}

// : (Schema) → Plugin
// A set of input rules for creating the basic block quotes, lists,
// code blocks, and heading.
function buildInputRules(schema) {
    var rules = prosemirrorInputrules.smartQuotes.concat(prosemirrorInputrules.ellipsis, prosemirrorInputrules.emDash), type;
    if (type = schema.nodes.blockquote) { rules.push(blockQuoteRule(type)); }
    if (type = schema.nodes.ordered_list) { rules.push(orderedListRule(type)); }
    if (type = schema.nodes.bullet_list) { rules.push(bulletListRule(type)); }
    if (type = schema.nodes.code_block) {
        rules.push(codeBlockRule(type));
        //MY CUSTOM INPUTS

        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[arduino\]$/, type, function (match) { return ({ params: "arduino" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[arm\]$/, type, function (match) { return ({ params: "arm" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[bat\]$/, type, function (match) { return ({ params: "bat" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[coffee\]$/, type, function (match) { return ({ params: "coffeescript" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[cmake\]$/, type, function (match) { return ({ params: "cmake" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[cs\]$/, type, function (match) { return ({ params: "cs" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[c\]$/, type, function (match) { return ({ params: "c" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[cpp\]$/, type, function (match) { return ({ params: "cpp" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[css\]$/, type, function (match) { return ({ params: "css" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[go\]$/, type, function (match) { return ({ params: "go" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[gradle\]$/, type, function (match) { return ({ params: "gradle" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[groovy\]$/, type, function (match) { return ({ params: "groovy" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[html\]$/, type, function (match) { return ({ params: "html" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[http\]$/, type, function (match) { return ({ params: "http" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[json\]$/, type, function (match) { return ({ params: "json" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[java\]$/, type, function (match) { return ({ params: "java" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[js\]$/, type, function (match) { return ({ params: "js" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[latex\]$/, type, function (match) { return ({ params: "tex" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[less\]$/, type, function (match) { return ({ params: "less" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[lisp\]$/, type, function (match) { return ({ params: "lisp" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[lua\]$/, type, function (match) { return ({ params: "lua" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[mk\]$/, type, function (match) { return ({ params: "makefile" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[mkfile\]$/, type, function (match) { return ({ params: "makefile" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[md\]$/, type, function (match) { return ({ params: "markdown" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[math\]$/, type, function (match) { return ({ params: "mathematica" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[matlab\]$/, type, function (match) { return ({ params: "matlab" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[nim\]$/, type, function (match) { return ({ params: "nim" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[objc\]$/, type, function (match) { return ({ params: "objectivec" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[ocaml\]$/, type, function (match) { return ({ params: "ocaml" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[glsl\]$/, type, function (match) { return ({ params: "glsl" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[perl\]$/, type, function (match) { return ({ params: "perl" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[php\]$/, type, function (match) { return ({ params: "php" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[ps\]$/, type, function (match) { return ({ params: "ps" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[py\]$/, type, function (match) { return ({ params: "py" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[r\]$/, type, function (match) { return ({ params: "r" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[ruby\]$/, type, function (match) { return ({ params: "ruby" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[rust\]$/, type, function (match) { return ({ params: "rust" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[sql\]$/, type, function (match) { return ({ params: "sql" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[shell\]$/, type, function (match) { return ({ params: "shell" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[sh\]$/, type, function (match) { return ({ params: "shell" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[swift\]$/, type, function (match) { return ({ params: "swift" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[ts\]$/, type, function (match) { return ({ params: "ts" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[x86\]$/, type, function (match) { return ({ params: "x86asm" }); }));
        rules.push(prosemirrorInputrules.textblockTypeInputRule(/^\[yml\]$/, type, function (match) { return ({ params: "yml" }); }));
    }
    if (type = schema.nodes.heading) { rules.push(headingRule(type, 6)); }

    rules.push(makeInlineMathInputRule(REGEX_INLINE_MATH_DOLLARS, schema.nodes.math_inline));
    rules.push(makeBlockMathInputRule(REGEX_BLOCK_MATH_DOLLARS, schema.nodes.math_display));

    return prosemirrorInputrules.inputRules({ rules: rules })
}

// !! This module exports helper functions for deriving a set of basic
// menu items, input rules, or key bindings from a schema. These
// values need to know about the schema for two reasons—they need
// access to specific instances of node and mark types, and they need
// to know which of the node and mark types that they know about are
// actually present in the schema.
//
// The `exampleSetup` plugin ties these together into a plugin that
// will automatically enable this basic functionality in an editor.

// :: (Object) → [Plugin]
// A convenience plugin that bundles together a simple menu with basic
// key bindings, input rules, and styling for the example schema.
// Probably only useful for quickly setting up a passable
// editor—you'll need more control over your settings in most
// real-world situations.
//
//   options::- The following options are recognized:
//
//     schema:: Schema
//     The schema to generate key bindings and menu items for.
//
//     mapKeys:: ?Object
//     Can be used to [adjust](#example-setup.buildKeymap) the key bindings created.
//
//     menuBar:: ?bool
//     Set to false to disable the menu bar.
//
//     history:: ?bool
//     Set to false to disable the history plugin.
//
//     floatingMenu:: ?bool
//     Set to false to make the menu bar non-floating.
//
//     menuContent:: [[MenuItem]]
//     Can be used to override the menu content.


function item(label, cmd) { return new prosemirrorMenu.MenuItem({ label, select: cmd, run: cmd }) }
let tableMenu = [
    new prosemirrorMenu.MenuItem({ label: "Insert Table", select: function select(state) { return !isInTable(state) }, run: insertTable }),
    item("Insert column before", addColumnBefore),
    item("Insert column after", addColumnAfter),
    item("Delete column", deleteColumn),
    item("Insert row before", addRowBefore),
    item("Insert row after", addRowAfter),
    item("Delete row", deleteRow),
    item("Delete table", deleteTable),
    item("Merge cells", mergeCells),
    item("Split cell", splitCell),
    item("Toggle header column", toggleHeaderColumn),
    item("Toggle header row", toggleHeaderRow),
    item("Toggle header cells", toggleHeaderCell),
    item("Make cell green", setCellAttr("background", "#dfd")),
    item("Make cell not-green", setCellAttr("background", null))
]

function insertTable(state, dispatch) {

    if (!isCursorInCodeBlock(state)) {

        const tr = state.tr.replaceSelectionWith(
            state.schema.nodes.table.create(
                undefined,
                Fragment.fromArray([
                    state.schema.nodes.table_row.create(undefined, Fragment.fromArray([
                        //state.schema.nodes.table_cell.createAndFill(),
                        //state.schema.nodes.table_cell.createAndFill()
                        state.schema.nodes.table_cell.create(undefined, Fragment.fromArray([
                            state.schema.nodes.paragraph.createAndFill(null, state.schema.text("New"))
                        ])),
                        state.schema.nodes.table_cell.create(undefined, Fragment.fromArray([
                            state.schema.nodes.paragraph.createAndFill(null, state.schema.text("Table"))
                        ]))
                    ])),
                    state.schema.nodes.table_row.create(undefined, Fragment.fromArray([
                        state.schema.nodes.table_cell.createAndFill(),
                        state.schema.nodes.table_cell.createAndFill()
                    ]))
                ])
            )
        );

        if (dispatch) {
            dispatch(tr);
        }

        return true;

    }
}

function makeCodeBlock(language) {
    return function (state, dispatch) {
        if (state.selection.empty) {
            prosemirrorCommands.setBlockType(state.schema.nodes.code_block, { params: language })(state, dispatch);
            return true;
        }
        else {
            let range = state.selection.$from.blockRange(state.selection.$to);
            let content = "";
            state.doc.nodesBetween(state.selection.from, state.selection.to, (node, startPos) => {
                if (node.text) {
                    content += node.text + "\n";
                }
            });

            if (content != "") {
                let node = state.schema.node(state.schema.nodes.code_block, { params: language }, [state.schema.text(content)]);

                let tr = state.tr.replaceRangeWith(range.start, range.end, node);

                if (dispatch) {
                    dispatch(tr);
                    return true;
                }
            }
            return false;
        }
    }
}

function isCursorInCodeBlock(state) {
    let value = false;
    state.doc.nodesBetween(state.selection.from, state.selection.to, (node, startPos) => {
        if (node.type.name == "code_block") {
            value = true;
        }
    });
    return value;
}

function codeBlockEnter(state, dispatch) {

    let nodesInSelection = 0;
    let theNode = null;

    state.doc.nodesBetween(state.selection.from, state.selection.to, (node, startPos) => {
        /*if (node.type == state.schema.nodes.list_item) {
            prosemirrorSchemaList.splitListItem(state.schema.nodes.list_item)(state, dispatch);
            return true;
        }*/
        if (node.type == state.schema.nodes.code_block || node.type != state.schema.nodes.text) {
            nodesInSelection++;
            theNode = node;
        }
    });

    if (nodesInSelection == 1) {

        if (theNode.type == state.schema.nodes.code_block) {


            let raw = theNode.textBetween(0, state.selection.$head.parentOffset);
            let text = raw.substring(raw.lastIndexOf("\n"), raw.length);

            let tabs = 0;
            let spaces = 0;
            let tabChars = 0;
            for (let i = 0; i < text.length; i++) {
                if (text.charAt(i) == ' ') {
                    spaces++;
                }
                else if (text.charAt(i) == "\n") {

                }
                else if (text.charAt(i) == "\t") {
                    tabChars++;
                }
                else
                    break;
            }
            tabs = Math.floor(spaces / 2);

            let tr = state.tr;
            tr.insertText("\n");
            for (let i = 0; i < tabs; i++) {
                tr.insertText("  ");
            }
            for (let i = 0; i < tabChars; i++) {
                tr.insertText("\t");
            }

            dispatch(tr);

            return true;
        }
    }

    return false;
}

function alignSelection(alignment) {
    return function (state, dispatch) {

        let tr = state.tr;

        state.doc.nodesBetween(state.selection.from, state.selection.to, (node, startPos) => {
            if (node.attrs.class) {
                if (node.attrs.level) {
                    tr.setNodeMarkup(startPos, null, { class: "pm-align--" + alignment, level: node.attrs.level }, null);
                }
                else {
                    tr.setNodeMarkup(startPos, null, { class: "pm-align--" + alignment }, null);
                }
            }
        });

        if (dispatch) {
            dispatch(tr);
        }
        return true;
    }
}

let codeCollapsePlugin = new prosemirrorState.Plugin({
    props: {
        handleClick(view, _, event) {
            
            if (event.target.className == "snippetCollapser") {

                let state = view.state;
                state.doc.nodesBetween(state.selection.from, state.selection.to, (node, pos) => {

                    if (node.type.name == "code_block") {

                        let tr = state.tr;

                        let newAttrs = Object.assign({}, node.attrs)
                        newAttrs.collapsed = !node.attrs.collapsed;
                        tr.setNodeMarkup(pos, node.type, newAttrs)

                        tr = tr.setMeta("addToHistory", false);

                        view.dispatch(tr);
                    }
                });

            }
        }
    }
});

function exampleSetup(options) {

    let myMenu = buildMenuItems(options.schema).fullMenu;
    myMenu.splice(2, 0, [new prosemirrorMenu.Dropdown(tableMenu, { label: "Table" })]);

    var plugins = [
        buildInputRules(options.schema),
        prosemirrorKeymap.keymap(buildKeymap(options.schema, options.mapKeys)),
        prosemirrorKeymap.keymap(prosemirrorCommands.baseKeymap),
        prosemirrorGapcursor.gapCursor(),
        highlightPlugin(hljs),
        codeCollapsePlugin,
        tableEditing(),
        prosemirrorKeymap.keymap({
            Tab: (state, dispatch) => {
                let { $head } = state.selection;

                if (prosemirrorSchemaList.sinkListItem(options.schema.nodes.list_item)(state, dispatch)) {
                    return true;
                }
                else if (isInTable(state)) {
                    goToNextCell(1)(state, dispatch);
                    return true;
                }
                else {
                    if (dispatch) {
                        let tr = state.tr;
                        for (let i = 0; i < options.tabSize; i++) {
                            tr.insertText(" ").scrollIntoView();
                        }
                        dispatch(tr);
                        return true;
                    }
                }
            },
            "Shift-Tab": (state, dispatch) => {
                if (prosemirrorSchemaList.liftListItem(options.schema.nodes.list_item)(state, dispatch)) {
                    return true;
                }
                else if (isInTable(state)) {
                    goToNextCell(-1)(state, dispatch);
                    return true;
                }
                else {
                    if (dispatch) {
                        let tr = state.tr;

                        if (state.selection.to - state.selection.from === 0) {

                            let nodesInSelection = 0;
                            let node = null;
                            state.doc.nodesBetween(state.selection.from, state.selection.to, (_node, startPos) => {

                                if (_node.type == state.schema.nodes.code_block) {
                                    nodesInSelection++;
                                    node = _node;
                                }
                            });

                            if (nodesInSelection == 1 && node.type == state.schema.nodes.code_block) {

                                let text = node.textBetween(0, state.selection.$head.parentOffset);

                                let firstIndexOfLine = text.lastIndexOf("\n") || 0;

                                text = node.textBetween(0, state.selection.$head.parentOffset + 1);

                                let distToStart = text.length - firstIndexOfLine - 1;

                                for (let i = 1; i <= options.tabSize; i++) {
                                    if (text.charAt(firstIndexOfLine + 1) == " ") {
                                        tr.delete(state.selection.from - distToStart + 1, state.selection.from - distToStart + 2).scrollIntoView();
                                    }
                                }
                            }
                        }

                        dispatch(tr);
                        return true;
                    }
                }
                return false;
            }
        }),
    ];


    plugins.push(mathPlugin);

    /*plugins.push(prosemirrorMenu.menuBar({
        floating: options.floatingMenu !== false,
        content: myMenu
    }));*/
    plugins.push(prosemirrorMenu.menuBar({
        floating: options.floatingMenu !== false,
        content: myMenu
    }));
    /*if (options.menuBar !== false)
      { plugins.push(prosemirrorMenu.menuBar({floating: options.floatingMenu !== false,
                            content: options.menuContent || buildMenuItems(options.schema).fullMenu.splice(2, 0, [new prosemirrorMenu.Dropdown(tableMenu, {label: "Table"})])})); }*/
    if (options.history !== false) { plugins.push(prosemirrorHistory.history()); }

    return plugins.concat(new prosemirrorState.Plugin({
        props: {
            attributes: { class: "ProseMirror-example-setup-style" }
        }
    }))
}


exports.buildInputRules = buildInputRules;
exports.buildKeymap = buildKeymap;
exports.buildMenuItems = buildMenuItems;
exports.exampleSetup = exampleSetup;
//# sourceMappingURL=index.js.map
