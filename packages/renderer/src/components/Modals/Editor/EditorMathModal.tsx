import { Editor } from "@tiptap/core";

export type EditorMathModalState = {
    opened: boolean;
    editor: Editor | null;
    startLatex: string;
};

export function EditorMathModal(props: { state: EditorMathModalState }) {
    return <></>;
}
