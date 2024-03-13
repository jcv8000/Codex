import { mergeAttributes, Node, nodeInputRule } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MathBlockWrapper } from "./MathBlockWrapper";
import { Node as ProsemirrorNode } from "@tiptap/pm/model";

type IKatexAttrs = {
    text?: string;
};

interface IKatexOptions {
    HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        mathBlock: {
            setMathBlock: (arg?: IKatexAttrs) => ReturnType;
        };
    }
}

export const MathBlock = Node.create<IKatexOptions>({
    name: "mathBlock",
    group: "block",
    atom: true,

    allowGapCursor: true,

    addOptions() {
        return {
            HTMLAttributes: {
                class: "katex"
            }
        };
    },

    addAttributes() {
        return {
            text: {
                default: "",
                parseHTML(element) {
                    element.getAttribute("text");
                }
            }
        };
    },

    parseHTML() {
        return [{ tag: "span.katex" }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "span",
            mergeAttributes((this.options && this.options.HTMLAttributes) || {}, HTMLAttributes)
        ];
    },

    addCommands() {
        return {
            setMathBlock:
                (options) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: options
                    });
                }
        };
    },

    addInputRules() {
        return [
            nodeInputRule({
                find: /(?:^|\s)((?:\?)((?:[^~]+))(?:\?))$/,
                type: this.type,
                getAttributes: (match) => {
                    return { text: match[2] };
                }
            })
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(MathBlockWrapper);
    },

    addStorage() {
        return {
            markdown: {
                serialize(state: any, node: ProsemirrorNode) {
                    state.write("$$\n" + node.attrs.text + "\n$$");
                }
            }
        };
    }
});
