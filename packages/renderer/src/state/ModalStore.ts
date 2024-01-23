import { proxy } from "valtio";
import { ContextMenuState, defaultContextMenuState } from "components/ContextMenu";
import {
    EditModalState,
    EditorImageModalState,
    EditorLinkModalState,
    EditorMathModalState,
    NewModalState,
    WhatsNewModalState,
    defaultEditModalState,
    defaultEditorImageModalState,
    defaultEditorLinkModalState,
    defaultEditorMathModalState,
    defaultNewModalState,
    defaultWhatsNewModalState
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
    contextMenuState: defaultContextMenuState,

    newModalState: defaultNewModalState,
    editModalState: defaultEditModalState,
    whatsNewModalState: defaultWhatsNewModalState,

    editorImageModalState: defaultEditorImageModalState,
    editorLinkModalState: defaultEditorLinkModalState,
    editorMathModalState: defaultEditorMathModalState
});
