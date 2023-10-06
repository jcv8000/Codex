import {
    ContextMenu,
    ContextMenuState,
    EditModal,
    EditModalState,
    EditorImageModal,
    EditorImageModalState,
    EditorMathModal,
    EditorMathModalState,
    NewModal,
    NewModalState,
    WhatsNewModal
} from "components/Modals";
import React, { createContext, useState } from "react";
import { exampleSave, Folder } from "common/Save";
import { EditorLinkModal, EditorLinkModalState } from "./EditorLinkModal";

class ModalStore {
    openWhatsNewModal: () => void = () => {};

    // Save modals
    openNewModal: (options: Omit<NewModalState, "opened">) => void = () => {};
    openEditModal: (options: Omit<EditModalState, "opened">) => void = () => {};
    openContextMenu: (options: Omit<ContextMenuState, "opened">) => void = () => {};

    // Editor modals
    openEditorImageModal: (options: Omit<EditorImageModalState, "opened">) => void = () => {};
    openEditorMathModal: (options: Omit<EditorMathModalState, "opened">) => void = () => {};
    openEditorLinkModal: (options: Omit<EditorLinkModalState, "opened">) => void = () => {};
}

export const ModalContext = createContext<ModalStore>(new ModalStore());

export function ModalProvider(props: { children?: React.ReactNode }) {
    const [whatsNewModalState, setWhatsNewModalState] = useState<{ opened: boolean }>({
        opened: false
    });

    // Save modals
    const [newModalState, setNewModalState] = useState<NewModalState>({
        opened: false,
        parent: exampleSave.items[0] as Folder,
        type: "page"
    });

    const [editModalState, setEditModalState] = useState<EditModalState>({
        opened: false,
        item: exampleSave.items[0]
    });

    const [contextMenuState, setContextMenuState] = useState<ContextMenuState>({
        opened: false,
        item: exampleSave.items[0],
        x: 0,
        y: 0
    });

    window.onblur = window.onresize = () =>
        setContextMenuState({ ...contextMenuState, opened: false });

    // Editor modals
    const [editorImageModalState, setEditorImageModalState] = useState<EditorImageModalState>({
        opened: false,
        editor: null
    });

    const [editorMathModalState, setEditorMathModalState] = useState<EditorMathModalState>({
        opened: false,
        editor: null,
        startLatex: ""
    });

    const [editorLinkModalState, setEditorLinkModalState] = useState<EditorLinkModalState>({
        opened: false,
        editor: null,
        initialUrl: ""
    });

    return (
        <ModalContext.Provider
            value={{
                openWhatsNewModal: () => {
                    setWhatsNewModalState({ opened: true });
                },
                // Save modals
                openNewModal: (options) => {
                    setNewModalState({ opened: true, parent: options.parent, type: options.type });
                },
                openEditModal: (options) => {
                    setEditModalState({ opened: true, item: options.item });
                },
                openContextMenu: (options) => {
                    setContextMenuState({
                        opened: true,
                        item: options.item,
                        x: options.x,
                        y: options.y
                    });
                },
                // Editor modals
                openEditorImageModal: (options) => {
                    setEditorImageModalState({ opened: true, editor: options.editor });
                },
                openEditorMathModal: (options) => {
                    setEditorMathModalState({
                        opened: true,
                        editor: options.editor,
                        startLatex: options.startLatex
                    });
                },
                openEditorLinkModal: (options) => {
                    setEditorLinkModalState({
                        opened: true,
                        editor: options.editor,
                        initialUrl: options.initialUrl
                    });
                }
            }}
        >
            {props.children}

            <WhatsNewModal
                state={whatsNewModalState}
                onClose={() => setWhatsNewModalState({ opened: false })}
            />

            <NewModal
                state={newModalState}
                onClose={() => setNewModalState({ ...newModalState, opened: false })}
            />
            <EditModal
                state={editModalState}
                onClose={() => setEditModalState({ ...editModalState, opened: false })}
            />
            <ContextMenu
                state={contextMenuState}
                onClose={() => setContextMenuState({ ...contextMenuState, opened: false })}
            />

            <EditorImageModal
                state={editorImageModalState}
                onClose={() =>
                    setEditorImageModalState({ ...editorImageModalState, opened: false })
                }
            />
            <EditorMathModal
                state={editorMathModalState}
                onClose={() => setEditorMathModalState({ ...editorMathModalState, opened: false })}
            />
            <EditorLinkModal
                state={editorLinkModalState}
                onClose={() => setEditorLinkModalState({ ...editorLinkModalState, opened: false })}
            />
        </ModalContext.Provider>
    );
}
