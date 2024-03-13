import Code from "@tiptap/extension-code";

export const CustomCode = Code.extend({
    addKeyboardShortcuts() {
        return {
            "Mod-/": () => this.editor.commands.toggleCode()
        };
    }
});
