import { codexStore, useSnapshot } from "src/state";
import { ContextMenu, defaultContextMenuState } from "components/ContextMenu";
import {
    EditModal,
    EditorImageModal,
    EditorLinkModal,
    EditorMathModal,
    NewModal,
    WhatsNewModal,
    defaultEditModalState,
    defaultEditorImageModalState,
    defaultEditorLinkModalState,
    defaultEditorMathModalState,
    defaultNewModalState,
    defaultWhatsNewModalState
} from ".";

export function ModalsWrapper(props: { children?: React.ReactNode }) {
    const { modals } = useSnapshot(codexStore);

    return (
        <>
            <ContextMenu
                state={modals.contextMenuState}
                onClose={() => (codexStore.modals.contextMenuState = defaultContextMenuState)}
            />

            <NewModal
                state={modals.newModalState}
                onClose={() => (codexStore.modals.newModalState = defaultNewModalState)}
            />
            <EditModal
                state={modals.editModalState}
                onClose={() => (codexStore.modals.editModalState = defaultEditModalState)}
            />
            <WhatsNewModal
                state={modals.whatsNewModalState}
                onClose={() => (codexStore.modals.whatsNewModalState = defaultWhatsNewModalState)}
            />

            <EditorImageModal
                state={modals.editorImageModalState}
                onClose={() =>
                    (codexStore.modals.editorImageModalState = defaultEditorImageModalState)
                }
            />
            <EditorLinkModal
                state={modals.editorLinkModalState}
                onClose={() =>
                    (codexStore.modals.editorLinkModalState = defaultEditorLinkModalState)
                }
            />
            <EditorMathModal
                state={modals.editorMathModalState}
                onClose={() =>
                    (codexStore.modals.editorMathModalState = defaultEditorMathModalState)
                }
            />

            {props.children}
        </>
    );
}
