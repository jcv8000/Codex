import { Editor } from "@tiptap/core";

export type EditorLinkModalState = {
    opened: boolean;
    editor: Editor | null;
    initialUrl: string;
};
export const defaultEditorLinkModalState: EditorLinkModalState = {
    opened: false,
    editor: null,
    initialUrl: ""
};

export function EditorLinkModal(props: { state: EditorLinkModalState; onClose: () => void }) {
    return <></>;
}
