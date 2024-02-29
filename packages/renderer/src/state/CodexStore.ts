import { Prefs } from "common/schemas/v2/Prefs";
import {
    Folder,
    NoteItem,
    Page,
    Save,
    exampleSave,
    getItemFromID,
    getParent
} from "common/schemas/v2/Save";
import { proxy, useSnapshot } from "valtio";
import { Editor } from "@tiptap/react";
import { locales } from "common/Locales";

declare module "valtio" {
    function useSnapshot<T extends object>(p: T): T;
}

type View = { value: "home" } | { value: "settings" } | { value: "editor"; activePageId: string };

type CodexStore = {
    view: View;
    prefs: Prefs;
    save: Save;
    editor: Editor | null;
    unsavedChanges: boolean;
    draggedItem: NoteItem | null;
};

const startPrefs = JSON.parse(await window.ipc.invoke("get-prefs")) as Prefs;
const startSave = exampleSave;

export const codexStore = proxy<CodexStore>({
    view: { value: "home" },
    prefs: startPrefs,
    save: startSave,
    editor: null,
    unsavedChanges: false,
    draggedItem: null
});

export function saveActivePage() {}

// export function exportPage(page: Page, type: "pdf" | "md") {}

export async function modifyItem(id: string, changes: Partial<Folder> | Partial<Page>) {
    const item = getItemFromID(codexStore.save, id);
    if (item != undefined) Object.assign(item, changes);

    //const saved = await window.ipc.invoke("write-save", Save.stringify(codexStore.save));
    // TODO show error notification if save isnt saved
}

export async function deleteItem(id: string) {
    const parent = getParent(codexStore.save, id);
    if (parent == undefined) {
        // Top-level
        codexStore.save.items.forEach((item, index) => {
            if (item.id == id) codexStore.save.items.splice(index, 1);
        });
    } else {
        parent.children.forEach((c, index) => {
            if (c.id == id) parent.children.splice(index, 1);
        });
    }
}

export function useLocale() {
    const { prefs } = useSnapshot(codexStore);
    return locales[prefs.general.locale];
}
