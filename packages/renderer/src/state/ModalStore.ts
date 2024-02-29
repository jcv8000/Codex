import { proxy } from "valtio";
import {
    ContextMenuState,
    NewModalState,
    EditModalState,
    WhatsNewModalState,
    EditorImageModalState,
    EditorLinkModalState,
    EditorMathModalState
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

    newModalState: { opened: false, parent: null, type: "folder" },
    editModalState: { opened: false, item: null },
    whatsNewModalState: { opened: false },

    editorImageModalState: { opened: false, editor: null },
    editorLinkModalState: { opened: false, editor: null, initialUrl: "" },
    editorMathModalState: { opened: false, editor: null, startLatex: "" }
});
