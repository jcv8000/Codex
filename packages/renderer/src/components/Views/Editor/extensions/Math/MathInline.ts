import { mergeAttributes, Node, nodeInputRule } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MathInlineWrapper } from "./MathInlineWrapper";
import { Node as ProsemirrorNode } from "@tiptap/pm/model";

type IKatexAttrs = {
    text?: string;
};

interface IKatexOptions {
    HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        mathInline: {
            setMathInline: (arg?: IKatexAttrs) => ReturnType;
        };
    }
}

export const MathInline = Node.create<IKatexOptions>({
    name: "mathInline",
    group: "inline",
    inline: true,
    atom: true,

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
            setMathInline:
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
                find: /(?:^|\s)((?:\$)((?:[^~]+))(?:\$))$/,
                type: this.type,
                getAttributes: (match) => {
                    return { text: match[2] };
                }
            })
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(MathInlineWrapper);
    },

    addStorage() {
        return {
            markdown: {
                serialize(state: any, node: ProsemirrorNode) {
                    state.write("$" + node.attrs.text + "$");
                }
            }
        };
    }
});
