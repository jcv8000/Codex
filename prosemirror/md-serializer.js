const { MarkdownSerializer } = require('prosemirror-markdown')

// :: MarkdownSerializer
// A serializer for the [basic schema](#schema).
const customMarkdownSerializer = new MarkdownSerializer({
    blockquote(state, node) {
        state.wrapBlock("> ", null, node, () => state.renderContent(node))
    },
    code_block(state, node) {
        state.write("```" + (node.attrs.params || "") + "\n")
        state.text(node.textContent, false)
        state.ensureNewLine()
        state.write("```")
        state.closeBlock(node)
    },
    heading(state, node) {
        state.write(state.repeat("#", node.attrs.level) + " ")
        state.renderInline(node)
        state.closeBlock(node)
    },
    horizontal_rule(state, node) {
        state.write(node.attrs.markup || "---")
        state.closeBlock(node)
    },
    bullet_list(state, node) {
        state.renderList(node, "  ", () => (node.attrs.bullet || "*") + " ")
    },
    ordered_list(state, node) {
        let start = node.attrs.order || 1
        let maxW = String(start + node.childCount - 1).length
        let space = state.repeat(" ", maxW + 2)
        state.renderList(node, space, i => {
            let nStr = String(start + i)
            return state.repeat(" ", maxW - nStr.length) + nStr + ". "
        })
    },
    list_item(state, node) {
        state.renderContent(node)
    },
    paragraph(state, node) {
        if (node.attrs.class == "pm-align--left") {
            state.renderInline(node)
            state.closeBlock(node)
        }
        else if (node.attrs.class == "pm-align--center") {
            state.write("<p align='center'>");
            state.renderInline(node)
            state.write("</p>");
            state.closeBlock(node)
        }
        else if (node.attrs.class == "pm-align--right") {
            state.write("<p align='right'>");
            state.renderInline(node)
            state.write("</p>");
            state.closeBlock(node)
        }
    },

    image(state, node) {

        //don't include in the markdown if the image has base64 encoded data
        if (node.attrs.src.toString().substring(0, 4) == "data") {
            state.write("(Could not include image without URL)");
        }
        else {
            state.write("![" + state.esc(node.attrs.alt || "") + "](" + state.esc(node.attrs.src) +
                (node.attrs.title ? " " + state.quote(node.attrs.title) : "") + ")")
        }

    },
    hard_break(state, node, parent, index) {
        for (let i = index + 1; i < parent.childCount; i++)
            if (parent.child(i).type != node.type) {
                state.write("\\\n")
                return
            }
    },
    text(state, node) {
        state.text(node.text)
    },
    table(state, node) {
        
        let rows = node.content.content;

        for (let y = 0; y < rows.length; y++) {

            let row = rows[y];
            let cols = row.content.content;
            let tableWidth = cols.length

            for (let x = 0; x < cols.length; x++) {
                let col = cols[x];

                //check for empty cell
                if (col.content.content[0].content.content.length == 0) {
                    if (x == cols.length - 1)
                        state.write("&nbsp;");
                    else
                        state.write("&nbsp; | ");
                }
                else {
                    if (x == cols.length - 1)
                        state.renderInline(col.content.content[0]);
                    else {
                        state.renderInline(col.content.content[0]);
                        state.write(" | ");
                    }
                }
            }

            state.write("\n");

            if (tableWidth <= 1) {
                state.write("\n")
            }
            else {
                if (y == 0) {
                    for (let x = 0; x < cols.length; x++) {
                        if (x == cols.length - 1)
                            state.write("---");
                        else
                            state.write("--- | ")
                    }
                    state.write("\n");
                }
            }
        }
        
    },
    math_inline(state, node) {
        state.write("$");
        state.renderInline(node.content);
        state.write("$");
    },
    math_display(state, node) {
        state.write("$$");
        state.ensureNewLine();
        state.renderContent(node.content);
        state.ensureNewLine();
        state.write("$$");
        state.closeBlock(node);
    },
}, {
    em: { open: "*", close: "*", mixable: true, expelEnclosingWhitespace: true },
    strong: { open: "**", close: "**", mixable: true, expelEnclosingWhitespace: true },
    link: {
        open(_state, mark, parent, index) {
            return isPlainURL(mark, parent, index, 1) ? "<" : "["
        },
        close(state, mark, parent, index) {
            return isPlainURL(mark, parent, index, -1) ? ">"
                : "](" + state.esc(mark.attrs.href) + (mark.attrs.title ? " " + state.quote(mark.attrs.title) : "") + ")"
        }
    },
    code: {
        open(_state, _mark, parent, index) { return backticksFor(parent.child(index), -1) },
        close(_state, _mark, parent, index) { return backticksFor(parent.child(index - 1), 1) },
        escape: false
    },
    underline: { open: "", close: "", mixable: true, expelEnclosingWhitespace: true }
})

function backticksFor(node, side) {
    let ticks = /`+/g, m, len = 0
    if (node.isText) while (m = ticks.exec(node.text)) len = Math.max(len, m[0].length)
    let result = len > 0 && side > 0 ? " `" : "`"
    for (let i = 0; i < len; i++) result += "`"
    if (len > 0 && side < 0) result += " "
    return result
}

function isPlainURL(link, parent, index, side) {
    if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) return false
    let content = parent.child(index + (side < 0 ? -1 : 0))
    if (!content.isText || content.text != link.attrs.href || content.marks[content.marks.length - 1] != link) return false
    if (index == (side < 0 ? 1 : parent.childCount - 1)) return true
    let next = parent.child(index + (side < 0 ? -2 : 1))
    return !link.isInSet(next.marks)
}

exports.customMarkdownSerializer = customMarkdownSerializer;