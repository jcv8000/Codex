import { proxy } from "valtio";
import {
    ContextMenuState,
    NewModalState,
    EditModalState,
    WhatsNewModalState,
    EditorImageModalState,
    EditorLinkModalState,
    EditorMathModalState,
    defaultNewModalState,
    defaultEditModalState,
    defaultWhatsNewModalState,
    defaultEditorImageModalState,
    defaultEditorLinkModalState,
    defaultEditorMathModalState
} from "components/Modals";

export type ModalStore = {
    contextMenuState: ContextMenuState;

    newModalState: NewModalState;
    editModalState: EditModalState;
    whatsNewModalState: WhatsNewModalState;

    editorImageModalState: EditorImageModalState;
    editorLinkModalState: EditorLinkModalState;
    editorMathModalState: EditorMathModalState;
};

export const modalStore = proxy<ModalStore>({
    contextMenuState: { opened: false, item: null, x: 0, y: 0 },

    newModalState: defaultNewModalState,
    editModalState: defaultEditModalState,
    whatsNewModalState: defaultWhatsNewModalState,

    editorImageModalState: defaultEditorImageModalState,
    editorLinkModalState: defaultEditorLinkModalState,
    editorMathModalState: defaultEditorMathModalState
});
