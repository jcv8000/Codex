import Table from "@tiptap/extension-table";
import { Fragment } from "@tiptap/pm/model";
import { getHTMLFromFragment } from "@tiptap/core";
import { Node } from "@tiptap/pm/model";

export const CustomTable = Table.extend({
    addStorage() {
        return {
            markdown: {
                // Turn code blocks into back-tick markdown expressions instead of HTTML inside table cells
                // This lets code blocks display correctly inside tables on GitHub
                serialize(state: any, node: Node, parent: Node) {
                    let html = serializeHTML(node, parent);
                    const regex = /<pre><code class="language-(.*)">([\S\s]*?)<\/code><\/pre>/gm;
                    let m: RegExpExecArray | null;

                    while ((m = regex.exec(html)) !== null) {
                        // This is necessary to avoid infinite loops with zero-width matches
                        if (m.index === regex.lastIndex) {
                            regex.lastIndex++;
                        }

                        const lang = m[1];
                        const code = m[2];

                        // https://stackoverflow.com/a/53038904/6784197
                        html = html.replace(
                            /<pre><code class="language-(.*)">([\S\s]*?)<\/code><\/pre>/gm,
                            `\n\n\`\`\`${lang}\n${code}\n\`\`\`\n`
                        );
                    }

                    state.write(html);
                    if (node.isBlock) {
                        state.closeBlock(node);
                    }
                },
                parse: {
                    // handled by markdown-it
                }
            }
        };
    }
});

/**
 * These functions were copied from
 * https://github.com/aguingand/tiptap-markdown/blob/main/src/extensions/nodes/html.js
 */

function serializeHTML(node: Node, parent: Node) {
    const schema = node.type.schema;
    const html = getHTMLFromFragment(Fragment.from(node), schema);

    if (node.isBlock && parent.type.name === schema.topNodeType.name) {
        return formatBlock(html);
    }

    return html;
}

function formatBlock(html: string) {
    const dom = elementFromString(html);
    const element = dom.firstElementChild;

    element!.innerHTML = element!.innerHTML.trim() ? `\n${element!.innerHTML}\n` : `\n`;

    return element!.outerHTML;
}

function elementFromString(value: string) {
    // add a wrapper to preserve leading and trailing whitespace
    const wrappedValue = `<body>${value}</body>`;

    return new window.DOMParser().parseFromString(wrappedValue, "text/html").body;
}
