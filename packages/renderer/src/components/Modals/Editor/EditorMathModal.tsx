import { Editor } from "@tiptap/core";

export type EditorMathModalState = {
    opened: boolean;
    editor: Editor | null;
    startLatex: string;
};

export const defaultEditorMathModalState: EditorMathModalState = {
    opened: false,
    editor: null,
    startLatex: ""
};

export function EditorMathModal(props: { state: EditorMathModalState; onClose: () => void }) {
    return <></>;
}
