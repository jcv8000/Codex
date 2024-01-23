import { Editor } from "@tiptap/core";

export type EditorImageModalState = {
    opened: boolean;
    editor: Editor | null;
};

export const defaultEditorImageModalState: EditorImageModalState = { opened: false, editor: null };

export function EditorImageModal(props: { state: EditorImageModalState; onClose: () => void }) {
    return <></>;
}
