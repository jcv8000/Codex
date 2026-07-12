import { Mark, mergeAttributes } from "@tiptap/core";

export interface RevisionNoteOptions {
    HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        revisionNote: {
            setRevisionNote: () => ReturnType;
            toggleRevisionNote: () => ReturnType;
            unsetRevisionNote: () => ReturnType;
        };
    }
}

export const RevisionNote = Mark.create<RevisionNoteOptions>({
    name: "revisionNote",

    addOptions() {
        return {
            HTMLAttributes: {
                class: "revision-note",
            },
        };
    },

    addAttributes() {
        return {
            id: {
                default: null,
                parseHTML: (element) => element.getAttribute("data-revision-note-id"),
                renderHTML: (attributes) => {
                    if (!attributes.id) {
                        return {};
                    }

                    return {
                        "data-revision-note-id": attributes.id,
                    };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "span",
                getAttrs: (node) => (node as HTMLElement).hasAttribute("data-revision-note-id") && null,
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },

    addCommands() {
        return {
            setRevisionNote:
                () =>
                ({ commands }) => {
                    return commands.setMark(this.name, { id: crypto.randomUUID() });
                },
            toggleRevisionNote:
                () =>
                ({ commands }) => {
                    return commands.toggleMark(this.name, { id: crypto.randomUUID() });
                },
            unsetRevisionNote:
                () =>
                ({ commands }) => {
                    return commands.unsetMark(this.name);
                },
        };
    },

    addKeyboardShortcuts() {
        return {
            "Mod-Shift-r": () => this.editor.commands.toggleRevisionNote(),
        };
    },
});
