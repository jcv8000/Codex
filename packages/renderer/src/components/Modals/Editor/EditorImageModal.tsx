import { Editor } from "@tiptap/core";

export type EditorImageModalState = {
    opened: boolean;
    editor: Editor | null;
};

export function EditorImageModal(props: { state: EditorImageModalState }) {
    return <></>;
}
