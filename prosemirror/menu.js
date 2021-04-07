'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var crel = _interopDefault(require('crelt'));
var prosemirrorCommands = require('prosemirror-commands');
var prosemirrorHistory = require('prosemirror-history');
var prosemirrorState = require('prosemirror-state');

var SVG = "http://www.w3.org/2000/svg";
var XLINK = "http://www.w3.org/1999/xlink";

var prefix = "ProseMirror-icon";

function hashPath(path) {
  var hash = 0;
  for (var i = 0; i < path.length; i++)
    { hash = (((hash << 5) - hash) + path.charCodeAt(i)) | 0; }
  return hash
}

function getIcon(icon) {
  var node = document.createElement("div");
  node.className = prefix;
  if (icon.path) {
    var name = "pm-icon-" + hashPath(icon.path).toString(16);
    if (!document.getElementById(name)) { buildSVG(name, icon); }
    var svg = node.appendChild(document.createElementNS(SVG, "svg"));
    svg.style.width = (icon.width / icon.height) + "em";

    if (icon.scale) {
      svg.style.transform = `scale(${icon.scale})`;
    }

    var use = svg.appendChild(document.createElementNS(SVG, "use"));
    use.setAttributeNS(XLINK, "href", /([^#]*)/.exec(document.location)[1] + "#" + name);
  } else if (icon.dom) {
    node.appendChild(icon.dom.cloneNode(true));
  } else {
    node.appendChild(document.createElement("span")).textContent = icon.text || '';
    if (icon.css) { node.firstChild.style.cssText = icon.css; }
  }
  return node
}

function buildSVG(name, data) {
  var collection = document.getElementById(prefix + "-collection");
  if (!collection) {
    collection = document.createElementNS(SVG, "svg");
    collection.id = prefix + "-collection";
    collection.style.display = "none";
    document.body.insertBefore(collection, document.body.firstChild);
  }
  var sym = document.createElementNS(SVG, "symbol");
  sym.id = name;
  sym.setAttribute("viewBox", "0 0 " + data.width + " " + data.height);
  var path = sym.appendChild(document.createElementNS(SVG, "path"));
  path.setAttribute("d", data.path);
  if (data.stroke) {
    path.setAttribute("stroke", data.stroke);
  }
  if (data.strokeWidth) {
    path.setAttribute("stroke-width", data.strokeWidth);
  }
  collection.appendChild(sym);
}

var prefix$1 = "ProseMirror-menu";

// ::- An icon or label that, when clicked, executes a command.
var MenuItem = function MenuItem(spec) {
  // :: MenuItemSpec
  // The spec used to create the menu item.
  this.spec = spec;
};

// :: (EditorView) → {dom: dom.Node, update: (EditorState) → bool}
// Renders the icon according to its [display
// spec](#menu.MenuItemSpec.display), and adds an event handler which
// executes the command when the representation is clicked.
MenuItem.prototype.render = function render (view) {
  var spec = this.spec;
  var dom = spec.render ? spec.render(view)
      : spec.icon ? getIcon(spec.icon)
      : spec.label ? crel("div", null, translate(view, spec.label))
      : null;
  if (!dom) { throw new RangeError("MenuItem without icon or label property") }
  if (spec.title) {
    var title = (typeof spec.title === "function" ? spec.title(view.state) : spec.title);
    dom.setAttribute("title", translate(view, title));
  }
  if (spec.class) { dom.classList.add(spec.class); }
  if (spec.css) { dom.style.cssText += spec.css; }

  dom.addEventListener("mousedown", function (e) {
    e.preventDefault();
    if (!dom.classList.contains(prefix$1 + "-disabled"))
      { spec.run(view.state, view.dispatch, view, e); }
  });

  function update(state) {
    if (spec.select) {
      var selected = spec.select(state);
      dom.style.display = selected ? "" : "none";
      if (!selected) { return false }
    }
    var enabled = true;
    if (spec.enable) {
      enabled = spec.enable(state) || false;
      setClass(dom, prefix$1 + "-disabled", !enabled);
    }
    if (spec.active) {
      var active = enabled && spec.active(state) || false;
      setClass(dom, prefix$1 + "-active", active);
    }
    return true
  }

  return {dom: dom, update: update}
};

function translate(view, text) {
  return view._props.translate ? view._props.translate(text) : text
}

// MenuItemSpec:: interface
// The configuration object passed to the `MenuItem` constructor.
//
//   run:: (EditorState, (Transaction), EditorView, dom.Event)
//   The function to execute when the menu item is activated.
//
//   select:: ?(EditorState) → bool
//   Optional function that is used to determine whether the item is
//   appropriate at the moment. Deselected items will be hidden.
//
//   enable:: ?(EditorState) → bool
//   Function that is used to determine if the item is enabled. If
//   given and returning false, the item will be given a disabled
//   styling.
//
//   active:: ?(EditorState) → bool
//   A predicate function to determine whether the item is 'active' (for
//   example, the item for toggling the strong mark might be active then
//   the cursor is in strong text).
//
//   render:: ?(EditorView) → dom.Node
//   A function that renders the item. You must provide either this,
//   [`icon`](#menu.MenuItemSpec.icon), or [`label`](#MenuItemSpec.label).
//
//   icon:: ?Object
//   Describes an icon to show for this item. The object may specify
//   an SVG icon, in which case its `path` property should be an [SVG
//   path
//   spec](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d),
//   and `width` and `height` should provide the viewbox in which that
//   path exists. Alternatively, it may have a `text` property
//   specifying a string of text that makes up the icon, with an
//   optional `css` property giving additional CSS styling for the
//   text. _Or_ it may contain `dom` property containing a DOM node.
//
//   label:: ?string
//   Makes the item show up as a text label. Mostly useful for items
//   wrapped in a [drop-down](#menu.Dropdown) or similar menu. The object
//   should have a `label` property providing the text to display.
//
//   title:: ?union<string, (EditorState) → string>
//   Defines DOM title (mouseover) text for the item.
//
//   class:: ?string
//   Optionally adds a CSS class to the item's DOM representation.
//
//   css:: ?string
//   Optionally adds a string of inline CSS to the item's DOM
//   representation.

var lastMenuEvent = {time: 0, node: null};
function markMenuEvent(e) {
  lastMenuEvent.time = Date.now();
  lastMenuEvent.node = e.target;
}
function isMenuEvent(wrapper) {
  return Date.now() - 100 < lastMenuEvent.time &&
    lastMenuEvent.node && wrapper.contains(lastMenuEvent.node)
}

// ::- A drop-down menu, displayed as a label with a downwards-pointing
// triangle to the right of it.
var Dropdown = function Dropdown(content, options) {
  this.options = options || {};
  this.content = Array.isArray(content) ? content : [content];
};

// :: (EditorView) → {dom: dom.Node, update: (EditorState)}
// Render the dropdown menu and sub-items.
Dropdown.prototype.render = function render (view) {
    var this$1 = this;

  var content = renderDropdownItems(this.content, view);

  var label = crel("div", {class: prefix$1 + "-dropdown " + (this.options.class || ""),
                           style: this.options.css},
                   translate(view, this.options.label));
  if (this.options.title) { label.setAttribute("title", translate(view, this.options.title)); }
  var wrap = crel("div", {class: prefix$1 + "-dropdown-wrap"}, label);
  var open = null, listeningOnClose = null;
  var close = function () {
    if (open && open.close()) {
      open = null;
      window.removeEventListener("mousedown", listeningOnClose);
    }
  };
  label.addEventListener("mousedown", function (e) {
    e.preventDefault();
    markMenuEvent(e);
    if (open) {
      close();
    } else {
      open = this$1.expand(wrap, content.dom);
      window.addEventListener("mousedown", listeningOnClose = function () {
        if (!isMenuEvent(wrap)) { close(); }
      });
    }
  });

  function update(state) {
    var inner = content.update(state);
    wrap.style.display = inner ? "" : "none";
    return inner
  }

  return {dom: wrap, update: update}
};

Dropdown.prototype.expand = function expand (dom, items) {
  var menuDOM = crel("div", {class: prefix$1 + "-dropdown-menu " + (this.options.class || "")}, items);

  var done = false;
  function close() {
    if (done) { return }
    done = true;
    dom.removeChild(menuDOM);
    return true
  }
  dom.appendChild(menuDOM);
  return {close: close, node: menuDOM}
};

function renderDropdownItems(items, view) {
  var rendered = [], updates = [];
  for (var i = 0; i < items.length; i++) {
    var ref = items[i].render(view);
    var dom = ref.dom;
    var update = ref.update;
    rendered.push(crel("div", {class: prefix$1 + "-dropdown-item"}, dom));
    updates.push(update);
  }
  return {dom: rendered, update: combineUpdates(updates, rendered)}
}

function combineUpdates(updates, nodes) {
  return function (state) {
    var something = false;
    for (var i = 0; i < updates.length; i++) {
      var up = updates[i](state);
      nodes[i].style.display = up ? "" : "none";
      if (up) { something = true; }
    }
    return something
  }
}

// ::- Represents a submenu wrapping a group of elements that start
// hidden and expand to the right when hovered over or tapped.
var DropdownSubmenu = function DropdownSubmenu(content, options) {
  this.options = options || {};
  this.content = Array.isArray(content) ? content : [content];
};

// :: (EditorView) → {dom: dom.Node, update: (EditorState) → bool}
// Renders the submenu.
DropdownSubmenu.prototype.render = function render (view) {
  var items = renderDropdownItems(this.content, view);

  var label = crel("div", {class: prefix$1 + "-submenu-label"}, translate(view, this.options.label));
  var wrap = crel("div", {class: prefix$1 + "-submenu-wrap"}, label,
                 crel("div", {class: prefix$1 + "-submenu"}, items.dom));
  var listeningOnClose = null;
  label.addEventListener("mousedown", function (e) {
    e.preventDefault();
    markMenuEvent(e);
    setClass(wrap, prefix$1 + "-submenu-wrap-active");
    if (!listeningOnClose)
      { window.addEventListener("mousedown", listeningOnClose = function () {
        if (!isMenuEvent(wrap)) {
          wrap.classList.remove(prefix$1 + "-submenu-wrap-active");
          window.removeEventListener("mousedown", listeningOnClose);
          listeningOnClose = null;
        }
      }); }
  });

  function update(state) {
    var inner = items.update(state);
    wrap.style.display = inner ? "" : "none";
    return inner
  }
  return {dom: wrap, update: update}
};

// :: (EditorView, [union<MenuElement, [MenuElement]>]) → {dom: ?dom.DocumentFragment, update: (EditorState) → bool}
// Render the given, possibly nested, array of menu elements into a
// document fragment, placing separators between them (and ensuring no
// superfluous separators appear when some of the groups turn out to
// be empty).
function renderGrouped(view, content) {
  var result = document.createDocumentFragment();
  var updates = [], separators = [];
  for (var i = 0; i < content.length; i++) {
    var items = content[i], localUpdates = [], localNodes = [];
    for (var j = 0; j < items.length; j++) {
      var ref = items[j].render(view);
      var dom = ref.dom;
      var update$1 = ref.update;
      var span = crel("span", {class: prefix$1 + "item"}, dom);
      result.appendChild(span);
      localNodes.push(span);
      localUpdates.push(update$1);
    }
    if (localUpdates.length) {
      updates.push(combineUpdates(localUpdates, localNodes));
      if (i < content.length - 1)
        { separators.push(result.appendChild(separator())); }
    }
  }

  function update(state) {
    var something = false, needSep = false;
    for (var i = 0; i < updates.length; i++) {
      var hasContent = updates[i](state);
      if (i) { separators[i - 1].style.display = needSep && hasContent ? "" : "none"; }
      needSep = hasContent;
      if (hasContent) { something = true; }
    }
    return something
  }
  return {dom: result, update: update}
}

function separator() {
  return crel("span", {class: prefix$1 + "separator"})
}

// :: Object
// A set of basic editor-related icons. Contains the properties
// `join`, `lift`, `selectParentNode`, `undo`, `redo`, `strong`, `em`,
// `code`, `link`, `bulletList`, `orderedList`, and `blockquote`, each
// holding an object that can be used as the `icon` option to
// `MenuItem`.
var icons = {
  join: {
    width: 800, height: 900,
    path: "M0 75h800v125h-800z M0 825h800v-125h-800z M250 400h100v-100h100v100h100v100h-100v100h-100v-100h-100z"
  },
  lift: {
    width: 1024, height: 1024,
    path: "M219 310v329q0 7-5 12t-12 5q-8 0-13-5l-164-164q-5-5-5-13t5-13l164-164q5-5 13-5 7 0 12 5t5 12zM1024 749v109q0 7-5 12t-12 5h-987q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h987q7 0 12 5t5 12zM1024 530v109q0 7-5 12t-12 5h-621q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h621q7 0 12 5t5 12zM1024 310v109q0 7-5 12t-12 5h-621q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h621q7 0 12 5t5 12zM1024 91v109q0 7-5 12t-12 5h-987q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h987q7 0 12 5t5 12z"
  },
  selectParentNode: {text: "\u2b1a", css: "font-weight: bold"},
  undo: {
    width: 1024, height: 1024,
    path: "M761 1024c113-206 132-520-313-509v253l-384-384 384-384v248c534-13 594 472 313 775z"
  },
  redo: {
    width: 1024, height: 1024,
    path: "M576 248v-248l384 384-384 384v-253c-446-10-427 303-313 509-280-303-221-789 313-775z"
  },
  strong: {
    width: 805, height: 1024,
    path: "M317 869q42 18 80 18 214 0 214-191 0-65-23-102-15-25-35-42t-38-26-46-14-48-6-54-1q-41 0-57 5 0 30-0 90t-0 90q0 4-0 38t-0 55 2 47 6 38zM309 442q24 4 62 4 46 0 81-7t62-25 42-51 14-81q0-40-16-70t-45-46-61-24-70-8q-28 0-74 7 0 28 2 86t2 86q0 15-0 45t-0 45q0 26 0 39zM0 950l1-53q8-2 48-9t60-15q4-6 7-15t4-19 3-18 1-21 0-19v-37q0-561-12-585-2-4-12-8t-25-6-28-4-27-2-17-1l-2-47q56-1 194-6t213-5q13 0 39 0t38 0q40 0 78 7t73 24 61 40 42 59 16 78q0 29-9 54t-22 41-36 32-41 25-48 22q88 20 146 76t58 141q0 57-20 102t-53 74-78 48-93 27-100 8q-25 0-75-1t-75-1q-60 0-175 6t-132 6z"
  },
  em: {
    width: 585, height: 1024,
    path: "M0 949l9-48q3-1 46-12t63-21q16-20 23-57 0-4 35-165t65-310 29-169v-14q-13-7-31-10t-39-4-33-3l10-58q18 1 68 3t85 4 68 1q27 0 56-1t69-4 56-3q-2 22-10 50-17 5-58 16t-62 19q-4 10-8 24t-5 22-4 26-3 24q-15 84-50 239t-44 203q-1 5-7 33t-11 51-9 47-3 32l0 10q9 2 105 17-1 25-9 56-6 0-18 0t-18 0q-16 0-49-5t-49-5q-78-1-117-1-29 0-81 5t-69 6z"
  },
  underline: {
    width: 875, height: 875,
    path: "M 166.25,746.00 C 161.50,750.75 160.00,757.00 160.00,771.62 160.00,785.62 161.88,791.50 167.38,794.38 169.88,795.62 181.12,796.12 215.62,796.62 240.38,797.00 274.12,797.88 290.62,798.62 308.38,799.38 398.12,799.88 511.25,799.88 724.00,799.88 705.25,800.62 711.75,790.75 715.00,785.88 715.12,785.00 714.75,771.75 714.38,758.88 714.13,757.50 710.88,752.88 708.88,750.00 705.75,747.12 704.00,746.38 701.63,745.50 635.50,745.00 483.75,745.12 340.25,745.12 263.75,744.75 257.50,743.88 252.38,743.12 230.50,742.50 209.00,742.50 209.00,742.50 169.75,742.50 169.75,742.50 169.75,742.50 166.25,746.00 166.25,746.00 Z M 133.38,64.75 C 128.12,65.37 125.00,71.37 125.00,80.62 125.13,92.37 126.88,93.62 147.88,96.75 155.38,97.87 162.50,99.75 166.00,101.62 169.25,103.25 176.00,106.12 181.00,108.00 186.00,110.00 190.62,112.50 191.25,113.75 192.00,115.13 194.75,118.62 197.50,121.88 200.13,125.00 203.12,129.62 203.88,132.25 205.13,135.75 205.50,180.13 205.88,325.62 206.12,451.12 206.62,518.62 207.63,526.88 208.50,535.38 210.00,542.00 212.50,547.50 214.38,552.00 216.88,560.00 218.12,565.38 219.63,572.50 221.25,576.38 224.38,580.38 226.75,583.25 230.13,588.38 232.00,591.88 236.62,600.62 242.25,607.25 258.25,623.12 267.38,632.25 274.62,638.25 279.75,641.00 283.88,643.25 289.62,647.00 292.38,649.38 295.25,651.62 300.75,654.75 304.75,656.12 308.62,657.50 314.12,659.88 316.88,661.38 329.00,668.00 331.38,668.88 342.00,670.75 348.12,671.75 358.25,674.25 364.38,676.25 381.13,681.75 392.00,682.88 430.62,683.00 468.63,683.12 480.12,681.88 493.25,676.75 497.38,675.00 507.38,672.00 515.50,670.00 523.62,668.00 532.62,665.12 535.50,663.62 538.25,662.12 544.62,658.88 549.38,656.50 554.25,654.12 560.62,650.38 563.75,648.12 566.88,645.88 571.62,642.88 574.38,641.50 580.38,638.38 609.25,610.38 614.75,602.38 616.88,599.12 621.12,593.62 624.12,590.12 627.12,586.62 630.38,581.38 631.12,578.50 632.00,575.62 634.38,570.50 636.25,567.00 639.88,560.50 643.50,547.25 646.25,530.00 647.12,524.88 648.88,515.88 650.25,510.00 652.75,499.88 652.88,494.50 653.25,394.38 653.88,246.50 654.75,178.88 656.12,164.00 657.75,146.25 660.62,138.12 671.63,120.87 675.75,114.25 680.12,111.50 691.88,108.12 696.00,107.00 702.00,104.50 705.12,102.50 712.88,97.75 718.75,96.25 729.38,96.25 740.25,96.12 747.62,94.50 749.62,91.75 750.62,90.50 751.25,85.87 751.25,81.00 751.25,71.00 749.25,67.00 743.38,65.12 740.88,64.38 697.12,64.00 626.00,64.25 626.00,64.25 512.62,64.50 512.62,64.50 512.62,64.50 509.38,67.50 509.38,67.50 504.38,72.25 502.25,82.87 505.12,89.12 507.13,93.50 511.13,94.87 526.00,96.37 535.25,97.25 541.50,98.62 546.75,100.87 551.00,102.62 559.38,105.75 565.62,107.87 575.12,111.00 577.75,112.63 583.12,118.00 596.62,131.50 599.50,137.87 603.12,162.75 604.25,170.13 606.25,181.12 607.75,187.12 610.38,198.00 610.38,200.25 610.88,339.50 610.88,339.50 611.38,480.88 611.38,480.88 611.38,480.88 608.25,496.37 608.25,496.37 606.50,504.88 604.12,518.00 603.12,525.62 600.62,542.88 599.38,546.75 594.25,553.75 592.00,557.00 589.12,562.12 587.88,565.38 585.00,572.75 578.38,581.38 566.75,593.00 556.25,603.38 547.62,609.88 537.12,615.12 533.00,617.25 527.50,620.38 525.12,621.88 519.00,625.88 509.88,628.00 476.62,633.25 476.62,633.25 448.12,637.75 448.12,637.75 448.12,637.75 428.75,635.00 428.75,635.00 402.00,631.25 380.50,626.38 375.38,622.88 373.00,621.25 367.00,618.00 362.12,615.62 355.25,612.50 350.25,608.62 341.13,599.75 327.75,586.75 319.00,574.38 314.25,561.75 312.50,557.12 309.50,549.88 307.50,545.62 299.38,528.88 298.75,511.50 298.75,314.38 298.75,139.12 299.00,131.62 304.12,121.75 307.62,115.00 315.38,109.00 327.00,103.87 340.25,98.00 346.25,96.50 362.75,95.50 377.00,94.62 380.62,92.75 381.88,85.25 382.88,79.00 380.88,70.25 377.50,67.00 377.50,67.00 374.88,64.38 374.88,64.38 374.88,64.38 255.88,64.38 255.88,64.38 190.38,64.38 135.25,64.50 133.38,64.75 Z"
  },
  code: {
    width: 896, height: 1024,
    path: "M608 192l-96 96 224 224-224 224 96 96 288-320-288-320zM288 192l-288 320 288 320 96-96-224-224 224-224-96-96z"
  },
  link: {
    width: 951, height: 1024,
    path: "M832 694q0-22-16-38l-118-118q-16-16-38-16-24 0-41 18 1 1 10 10t12 12 8 10 7 14 2 15q0 22-16 38t-38 16q-8 0-15-2t-14-7-10-8-12-12-10-10q-18 17-18 41 0 22 16 38l117 118q15 15 38 15 22 0 38-14l84-83q16-16 16-38zM430 292q0-22-16-38l-117-118q-16-16-38-16-22 0-38 15l-84 83q-16 16-16 38 0 22 16 38l118 118q15 15 38 15 24 0 41-17-1-1-10-10t-12-12-8-10-7-14-2-15q0-22 16-38t38-16q8 0 15 2t14 7 10 8 12 12 10 10q18-17 18-41zM941 694q0 68-48 116l-84 83q-47 47-116 47-69 0-116-48l-117-118q-47-47-47-116 0-70 50-119l-50-50q-49 50-118 50-68 0-116-48l-118-118q-48-48-48-116t48-116l84-83q47-47 116-47 69 0 116 48l117 118q47 47 47 116 0 70-50 119l50 50q49-50 118-50 68 0 116 48l118 118q48 48 48 116z"
  },
  bulletList: {
    width: 768, height: 896,
    path: "M0 512h128v-128h-128v128zM0 256h128v-128h-128v128zM0 768h128v-128h-128v128zM256 512h512v-128h-512v128zM256 256h512v-128h-512v128zM256 768h512v-128h-512v128z"
  },
  orderedList: {
    width: 768, height: 896,
    path: "M320 512h448v-128h-448v128zM320 768h448v-128h-448v128zM320 128v128h448v-128h-448zM79 384h78v-256h-36l-85 23v50l43-2v185zM189 590c0-36-12-78-96-78-33 0-64 6-83 16l1 66c21-10 42-15 67-15s32 11 32 28c0 26-30 58-110 112v50h192v-67l-91 2c49-30 87-66 87-113l1-1z"
  },
  blockquote: {
    width: 640, height: 896,
    path: "M0 448v256h256v-256h-128c0 0 0-128 128-128v-128c0 0-256 0-256 256zM640 320v-128c0 0-256 0-256 256v256h256v-256h-128c0 0 0-128 128-128z"
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

// :: MenuItem
// Menu item for the `joinUp` command.
var joinUpItem = new MenuItem({
  title: "Join with above block",
  run: prosemirrorCommands.joinUp,
  select: function (state) { return prosemirrorCommands.joinUp(state); },
  icon: icons.join
});

// :: MenuItem
// Menu item for the `lift` command.
var liftItem = new MenuItem({
  title: "Lift out of enclosing block",
  run: prosemirrorCommands.lift,
  select: function (state) { return prosemirrorCommands.lift(state); },
  icon: icons.lift
});

// :: MenuItem
// Menu item for the `selectParentNode` command.
var selectParentNodeItem = new MenuItem({
  title: "Select parent node",
  run: prosemirrorCommands.selectParentNode,
  select: function (state) { return prosemirrorCommands.selectParentNode(state); },
  icon: icons.selectParentNode
});

// :: MenuItem
// Menu item for the `undo` command.
var undoItem = new MenuItem({
  title: "Undo last change",
  run: prosemirrorHistory.undo,
  enable: function (state) { return prosemirrorHistory.undo(state); },
  icon: icons.undo
});

// :: MenuItem
// Menu item for the `redo` command.
var redoItem = new MenuItem({
  title: "Redo last undone change",
  run: prosemirrorHistory.redo,
  enable: function (state) { return prosemirrorHistory.redo(state); },
  icon: icons.redo
});

// :: (NodeType, Object) → MenuItem
// Build a menu item for wrapping the selection in a given node type.
// Adds `run` and `select` properties to the ones present in
// `options`. `options.attrs` may be an object or a function.
function wrapItem(nodeType, options) {
  var passedOptions = {
    run: function run(state, dispatch) {
      // FIXME if (options.attrs instanceof Function) options.attrs(state, attrs => wrapIn(nodeType, attrs)(state))
      return prosemirrorCommands.wrapIn(nodeType, options.attrs)(state, dispatch)
    },
    enable: function enable(state) {
      return prosemirrorCommands.wrapIn(nodeType, options.attrs instanceof Function ? null : options.attrs)(state)
    }
  };
  for (var prop in options) { passedOptions[prop] = options[prop]; }
  return new MenuItem(passedOptions)
}

// :: (NodeType, Object) → MenuItem
// Build a menu item for changing the type of the textblock around the
// selection to the given type. Provides `run`, `active`, and `select`
// properties. Others must be given in `options`. `options.attrs` may
// be an object to provide the attributes for the textblock node.
function blockTypeItem(nodeType, options) {
  var command = prosemirrorCommands.setBlockType(nodeType, options.attrs);
  var passedOptions = {
    run: command,
    enable: function enable(state) { return command(state) },
    active: function active(state) {
      var ref = state.selection;
      var $from = ref.$from;
      var to = ref.to;
      var node = ref.node;
      if (node) { return node.hasMarkup(nodeType, options.attrs) }
      return to <= $from.end() && $from.parent.hasMarkup(nodeType, options.attrs)
    }
  };
  for (var prop in options) { passedOptions[prop] = options[prop]; }
  return new MenuItem(passedOptions)
}

// Work around classList.toggle being broken in IE11
function setClass(dom, cls, on) {
  if (on) { dom.classList.add(cls); }
  else { dom.classList.remove(cls); }
}

var prefix$2 = "ProseMirror-menubar";

function isIOS() {
  if (typeof navigator == "undefined") { return false }
  var agent = navigator.userAgent;
  return !/Edge\/\d/.test(agent) && /AppleWebKit/.test(agent) && /Mobile\/\w+/.test(agent)
}

// :: (Object) → Plugin
// A plugin that will place a menu bar above the editor. Note that
// this involves wrapping the editor in an additional `<div>`.
//
//   options::-
//   Supports the following options:
//
//     content:: [[MenuElement]]
//     Provides the content of the menu, as a nested array to be
//     passed to `renderGrouped`.
//
//     floating:: ?bool
//     Determines whether the menu floats, i.e. whether it sticks to
//     the top of the viewport when the editor is partially scrolled
//     out of view.
function menuBar(options) {
  return new prosemirrorState.Plugin({
    view: function view(editorView) { return new MenuBarView(editorView, options) }
  })
}

var MenuBarView = function MenuBarView(editorView, options) {
  var this$1 = this;

  this.editorView = editorView;
  this.options = options;

  let bruh = document.createElement('span');
  this.wrapper = document.getElementById('editorRibbon').appendChild(bruh); /*crel("div", {class: prefix$2 + "-wrapper"});*/
  this.menu = this.wrapper.appendChild(crel("div", {class: prefix$2}));
  this.menu.className = prefix$2;
  this.spacer = null;

  //editorView.dom.parentNode.replaceChild(this.wrapper, editorView.dom);
  //this.wrapper.appendChild(editorView.dom);

  this.maxHeight = 0;
  this.widthForMaxHeight = 0;
  this.floating = false;

  var ref = renderGrouped(this.editorView, this.options.content);
  var dom = ref.dom;
  var update = ref.update;
  this.contentUpdate = update;
  this.menu.appendChild(dom);
  this.update();

  if (options.floating && !isIOS()) {
    this.updateFloat();
    var potentialScrollers = getAllWrapping(this.wrapper);
    this.scrollFunc = function (e) {
      var root = this$1.editorView.root;
      if (!(root.body || root).contains(this$1.wrapper)) {
          potentialScrollers.forEach(function (el) { return el.removeEventListener("scroll", this$1.scrollFunc); });
      } else {
          this$1.updateFloat(e.target.getBoundingClientRect && e.target);
      }
    };
    potentialScrollers.forEach(function (el) { return el.addEventListener('scroll', this$1.scrollFunc); });
  }
};

MenuBarView.prototype.update = function update () {
  this.contentUpdate(this.editorView.state);

  if (this.floating) {
    this.updateScrollCursor();
  } else {
    if (this.menu.offsetWidth != this.widthForMaxHeight) {
      this.widthForMaxHeight = this.menu.offsetWidth;
      this.maxHeight = 0;
    }
    if (this.menu.offsetHeight > this.maxHeight) {
      this.maxHeight = this.menu.offsetHeight;
      this.menu.style.minHeight = this.maxHeight + "px";
    }
  }
};

MenuBarView.prototype.updateScrollCursor = function updateScrollCursor () {
  var selection = this.editorView.root.getSelection();
  if (!selection.focusNode) { return }
  var rects = selection.getRangeAt(0).getClientRects();
  var selRect = rects[selectionIsInverted(selection) ? 0 : rects.length - 1];
  if (!selRect) { return }
  var menuRect = this.menu.getBoundingClientRect();
  if (selRect.top < menuRect.bottom && selRect.bottom > menuRect.top) {
    var scrollable = findWrappingScrollable(this.wrapper);
    if (scrollable) { scrollable.scrollTop -= (menuRect.bottom - selRect.top); }
  }
};

MenuBarView.prototype.updateFloat = function updateFloat (scrollAncestor) {
  var parent = this.wrapper, editorRect = parent.getBoundingClientRect(),
      top = scrollAncestor ? Math.max(0, scrollAncestor.getBoundingClientRect().top) : 0;

  if (this.floating) {
    if (editorRect.top >= top || editorRect.bottom < this.menu.offsetHeight + 10) {
      this.floating = false;
      this.menu.style.position = this.menu.style.left = this.menu.style.top = this.menu.style.width = "";
      this.menu.style.display = "";
      this.spacer.parentNode.removeChild(this.spacer);
      this.spacer = null;
    } else {
      var border = (parent.offsetWidth - parent.clientWidth) / 2;
      this.menu.style.left = (editorRect.left + border) + "px";
      this.menu.style.display = (editorRect.top > window.innerHeight ? "none" : "");
      if (scrollAncestor) { this.menu.style.top = top + "px"; }
    }
  } else {
    if (editorRect.top < top && editorRect.bottom >= this.menu.offsetHeight + 10) {
      this.floating = true;
      var menuRect = this.menu.getBoundingClientRect();
      this.menu.style.left = menuRect.left + "px";
      this.menu.style.width = menuRect.width + "px";
      if (scrollAncestor) { this.menu.style.top = top + "px"; }
      this.menu.style.position = "fixed";
      this.spacer = crel("div", {class: prefix$2 + "-spacer", style: ("height: " + (menuRect.height) + "px")});
      parent.insertBefore(this.spacer, this.menu);
    }
  }
};

MenuBarView.prototype.destroy = function destroy () {
  if (this.wrapper.parentNode)
    { this.wrapper.parentNode.replaceChild(this.editorView.dom, this.wrapper); }
};

// Not precise, but close enough
function selectionIsInverted(selection) {
  if (selection.anchorNode == selection.focusNode) { return selection.anchorOffset > selection.focusOffset }
  return selection.anchorNode.compareDocumentPosition(selection.focusNode) == Node.DOCUMENT_POSITION_FOLLOWING
}

function findWrappingScrollable(node) {
  for (var cur = node.parentNode; cur; cur = cur.parentNode)
    { if (cur.scrollHeight > cur.clientHeight) { return cur } }
}

function getAllWrapping(node) {
    var res = [window];
    for (var cur = node.parentNode; cur; cur = cur.parentNode)
        { res.push(cur); }
    return res
}

exports.Dropdown = Dropdown;
exports.DropdownSubmenu = DropdownSubmenu;
exports.MenuItem = MenuItem;
exports.blockTypeItem = blockTypeItem;
exports.icons = icons;
exports.joinUpItem = joinUpItem;
exports.liftItem = liftItem;
exports.menuBar = menuBar;
exports.redoItem = redoItem;
exports.renderGrouped = renderGrouped;
exports.selectParentNodeItem = selectParentNodeItem;
exports.undoItem = undoItem;
exports.wrapItem = wrapItem;
//# sourceMappingURL=index.js.map
