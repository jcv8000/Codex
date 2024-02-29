import { modalStore, useSnapshot } from "src/state";
import {
    ContextMenu,
    EditModal,
    EditorImageModal,
    EditorLinkModal,
    EditorMathModal,
    NewModal,
    WhatsNewModal
} from ".";

export function ModalsProvider() {
    const modals = useSnapshot(modalStore);

    return (
        <>
            <ContextMenu state={modals.contextMenuState} />

            <NewModal state={modals.newModalState} />
            <EditModal state={modals.editModalState} />

            <WhatsNewModal state={modals.whatsNewModalState} />

            <EditorImageModal state={modals.editorImageModalState} />
            <EditorLinkModal state={modals.editorLinkModalState} />
            <EditorMathModal state={modals.editorMathModalState} />
        </>
    );
}
