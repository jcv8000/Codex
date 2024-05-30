import { Editor } from "@tiptap/core";
import { TypedIpcRenderer } from "common/ipc";
import { NoteItem } from "common/schemas/v2";

declare global {
    interface Window {
        ipc: TypedIpcRenderer;
        platform: NodeJS.Platform;
        defaultSaveLocation: string;

        editor: Editor | null;
        unsavedChanges: boolean;

        draggedItem: NoteItem | null;
    }
}
