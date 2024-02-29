import { Editor } from "@tiptap/core";

export type EditorLinkModalState = {
    opened: boolean;
    editor: Editor | null;
    initialUrl: string;
};

export function EditorLinkModal(props: { state: EditorLinkModalState }) {
    return <></>;
}
