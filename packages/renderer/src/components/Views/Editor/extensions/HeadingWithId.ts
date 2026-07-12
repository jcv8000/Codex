import { Heading } from "@tiptap/extension-heading";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { HeadingNodeView } from "./HeadingNodeView";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export const HeadingWithId = Heading.extend({
    addAttributes() {
        return {
            id: {
                default: null
            },
            level: {
                default: 1
            },
            collapsed: {
                default: false,
                parseHTML: (element) => element.hasAttribute("data-collapsed"),
                renderHTML: (attributes) => {
                    if (!attributes.collapsed) return {};
                    return { "data-collapsed": "true" };
                }
            }
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(HeadingNodeView);
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey("heading-fold"),
                props: {
                    decorations(state) {
                        const { doc } = state;
                        const decorations: Decoration[] = [];
                        let currentFoldLevel: number | null = null;

                        doc.forEach((node, offset) => {
                            const isHeading = node.type.name === "heading";

                            if (isHeading) {
                                if (currentFoldLevel !== null && node.attrs.level <= currentFoldLevel) {
                                    // End of fold
                                    currentFoldLevel = null;
                                }
                            }

                            if (currentFoldLevel !== null) {
                                // This node is inside a fold
                                decorations.push(
                                    Decoration.node(offset, offset + node.nodeSize, {
                                        style: "display: none;"
                                    })
                                );
                            }

                            if (isHeading && node.attrs.collapsed && currentFoldLevel === null) {
                                currentFoldLevel = node.attrs.level;
                            }
                        });

                        return DecorationSet.create(doc, decorations);
                    }
                }
            })
        ];
    }
});
