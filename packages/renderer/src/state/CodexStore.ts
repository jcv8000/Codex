import { Prefs } from "common/schemas/v2/Prefs";
import {
    Folder,
    NoteItem,
    Page,
    Save,
    getItemFromID,
    getParent,
    isFolder
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

const startPrefs = await window.ipc.invoke("get-prefs");
const startSave = await window.ipc.invoke("get-save");

window.ipc.on("pre-exit", () => {
    writeSave();
    writePrefs();
    window.ipc.invoke("exit");
});

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

export function saveActivePage() {}

// export function exportPage(page: Page, type: "pdf" | "md") {}

export function modifyItem(id: string, changes: Partial<Folder> | Partial<Page>) {
    const item = getItemFromID(codexStore.save, id);
    if (item != undefined) Object.assign(item, changes);

    writeSave();
}

// Open/close folder without writing to disk every time, it'll get
// saved on close & doesn't really matter that much
export function toggleOpened(id: string) {
    const item = getItemFromID(codexStore.save, id);
    if (item != undefined && isFolder(item)) item.opened = !item.opened;
}

export function deleteItem(id: string) {
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

    writeSave();
}

export function dragDropItem(
    draggedId: string,
    targetId: string,
    where: "above" | "below" | "child"
) {
    const dragged = getItemFromID(codexStore.save, draggedId);
    const target = getItemFromID(codexStore.save, targetId);

    if (dragged == undefined || target == undefined) return;

    const isDraggedTopLevel = codexStore.save.items.includes(dragged);
    const isTargetTopLevel = codexStore.save.items.includes(target);

    // Remove dragged item from parent's children[]
    if (isDraggedTopLevel) {
        codexStore.save.items.splice(codexStore.save.items.indexOf(dragged), 1);
    } else {
        const draggedParent = getParent(codexStore.save, draggedId);
        if (draggedParent == undefined) return;
        draggedParent.children.splice(draggedParent.children.indexOf(dragged), 1);
    }

    // Insert dragged item into target's children[], or the Save's items[]
    if (isTargetTopLevel) {
        if (where == "above") {
            codexStore.save.items.splice(codexStore.save.items.indexOf(target), 0, dragged);
        } else if (where == "below") {
            codexStore.save.items.splice(codexStore.save.items.indexOf(target) + 1, 0, dragged);
        } else if (where == "child" && isFolder(target)) {
            target.children.push(dragged);
        }
    } else {
        const targetParent = getParent(codexStore.save, targetId);
        if (targetParent == undefined) return;

        if (where == "above") {
            targetParent.children.splice(targetParent.children.indexOf(target), 0, dragged);
        } else if (where == "below") {
            targetParent.children.splice(targetParent.children.indexOf(target) + 1, 0, dragged);
        } else if (where == "child" && isFolder(target)) {
            target.children.push(dragged);
            target.opened = true;
        }
    }
}

export function useLocale() {
    const { prefs } = useSnapshot(codexStore);
    return locales[prefs.general.locale];
}

export async function writeSave() {
    const deproxied = deproxy<Save>(codexStore.save);
    const saved = await window.ipc.invoke("write-save", deproxied);
    // TODO show error notification if save isnt saved
}

export async function writePrefs() {
    const deproxied = deproxy<Prefs>(codexStore.prefs);
    const saved = await window.ipc.invoke("write-prefs", deproxied);
    // TODO show error notification if save isnt saved
}
