import { Prefs } from "common/Prefs";
import { NoteItem, Page, Save } from "common/Save";
import { proxy } from "valtio";
import { Editor } from "@tiptap/react";
import { ModalStore, modalStore } from "./ModalStore";

type View = { value: "home" } | { value: "settings" } | { value: "editor"; activePage: Page };

type CodexStore = {
    view: View;
    prefs: Prefs;
    save: Save;
    editor: Editor | null;
    unsavedChanges: boolean;
    draggedItem: NoteItem | null;
    modals: ModalStore;
};

declare module "valtio" {
    function useSnapshot<T extends object>(p: T): T;
}

const startPrefs = JSON.parse(await window.ipc.invoke("get-prefs")) as Prefs;
const startSave = Save.parse(await window.ipc.invoke("get-save"));

export const codexStore = proxy<CodexStore>({
    view: { value: "home" },
    prefs: startPrefs,
    save: startSave,
    editor: null,
    unsavedChanges: false,
    draggedItem: null,
    modals: modalStore
});

export function saveActivePage() {}

export function exportPage(page: Page, type: "pdf" | "md") {}

export function setView(v: View) {
    codexStore.view = v;
}

export async function modifyPrefs(callback: (p: Prefs) => void) {
    callback(codexStore.prefs);
    const saved = await window.ipc.invoke("write-prefs", JSON.stringify(codexStore.prefs));
    // TODO show error notification if prefs isnt saved
}

export async function modifySave(callback: (s: Save) => void) {
    callback(codexStore.save);
    const saved = await window.ipc.invoke("write-save", Save.stringify(codexStore.save));
    // TODO show error notification if save isnt saved
}
