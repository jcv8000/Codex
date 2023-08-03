import { mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react";
import { CanvasWrapper } from "./Wrapper";

interface ICanvasOptions {
    HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        canvas: {
            setCanvas: (arg?: ICanvasOptions) => ReturnType;
        };
    }
}

export const Canvas = Node.create({
    name: "canvas",

    group: "block",

    atom: true,

    addAttributes() {
        return {
            lines: {
                default: []
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="canvas"]'
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes, { "data-type": "canvas" })];
    },

    addCommands() {
        return {
            setCanvas:
                (options) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: options
                    });
                }
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(CanvasWrapper);
    },

    addStorage() {
        return {
            markdown: {
                serialize(state: any) {
                    // TODO Canvas markdown serialization: serialize(state: any, node: ProsemirrorNode) { }
                    // TODO typed State
                    state.write("\n\n");
                }
            }
        };
    }
});
