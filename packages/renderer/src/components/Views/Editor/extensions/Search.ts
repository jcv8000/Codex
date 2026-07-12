import { Extension } from "@tiptap/core";
import { Plugin, PluginKey, Transaction, EditorState } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { Node } from "@tiptap/pm/model";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        search: {
            setSearchTerm: (searchTerm: string, currentIndex: number) => ReturnType;
        };
    }
}

const searchPluginKey = new PluginKey("search");

export const Search = Extension.create({
    name: "search",

    addCommands() {
        return {
            setSearchTerm:
                (searchTerm: string, currentIndex: number) =>
                ({ tr }) => {
                    tr.setMeta(searchPluginKey, { searchTerm, currentIndex });
                    return true;
                }
        };
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: searchPluginKey,
                state: {
                    init() {
                        return { searchTerm: "", currentIndex: 0, decorations: DecorationSet.empty };
                    },
                    apply(tr: Transaction, oldState: any) {
                        const meta = tr.getMeta(searchPluginKey);
                        if (!tr.docChanged && !meta) {
                            return {
                                ...oldState,
                                decorations: oldState.decorations.map(tr.mapping, tr.doc)
                            };
                        }

                        const searchTerm = meta ? meta.searchTerm : oldState.searchTerm;
                        const currentIndex = meta ? meta.currentIndex : oldState.currentIndex;

                        if (!searchTerm) {
                            return { searchTerm, currentIndex, decorations: DecorationSet.empty };
                        }

                        const decorations: Decoration[] = [];
                        const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                        const regex = new RegExp(escapedTerm, "gi");
                        let matchIndex = 0;

                        tr.doc.descendants((node: Node, pos: number) => {
                            if (node.isText && node.text) {
                                regex.lastIndex = 0;
                                let match;
                                while ((match = regex.exec(node.text)) !== null) {
                                    const from = pos + match.index;
                                    const to = from + match[0].length;
                                    const isCurrent = matchIndex === currentIndex;

                                    decorations.push(
                                        Decoration.inline(from, to, {
                                            class: isCurrent ? "search-match-current" : "search-match",
                                            style: isCurrent
                                                ? "background-color: #ff9632; color: #000; border-radius: 2px;"
                                                : "background-color: #ffe082; color: #000; border-radius: 2px;"
                                        })
                                    );
                                    matchIndex++;
                                }
                            }
                        });

                        return {
                            searchTerm,
                            currentIndex,
                            decorations: DecorationSet.create(tr.doc, decorations)
                        };
                    }
                },
                props: {
                    decorations(state: EditorState) {
                        return searchPluginKey.getState(state)?.decorations || DecorationSet.empty;
                    }
                }
            })
        ];
    }
});
