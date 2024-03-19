import { Editor } from "@tiptap/core";
import { Page, Prefs, Save, NoteItem } from "common/schemas/v2";
import { proxy } from "valtio";

declare module "valtio" {
    function useSnapshot<T extends object>(p: T): T;
}

type View =
    | { value: "home" }
    | { value: "settings" }
    | { value: "tags" }
    | { value: "editor"; page: Page; initialContentString: string };

type CodexStore = {
    view: View;
    prefs: Prefs;
    save: Save;
    editor: Editor | null;
    unsavedChanges: boolean;
    draggedItem: NoteItem | null;
};

const startPrefs = await window.ipc.invoke("get-prefs");
const startSave = await window.ipc.invoke("get-save");

export const codexStore = proxy<CodexStore>({
    view: { value: "home" },
    prefs: startPrefs,
    save: startSave,
    editor: null,
    unsavedChanges: false,
    draggedItem: null
});

export function deproxy<T>(proxy: any) {
    return JSON.parse(JSON.stringify(proxy)) as T;
}

export * from "./modifyItem";
export * from "./toggleOpened";
export * from "./deleteItem";
export * from "./dragDropItem";
export * from "./useLocale";
export * from "./writePrefs";
export * from "./writeSave";
