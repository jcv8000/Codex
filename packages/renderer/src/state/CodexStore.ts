import { Prefs } from "common/Prefs";
import { Page, Save, exampleSave } from "common/Save";
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
    modals: ModalStore;
};

declare module "valtio" {
    function useSnapshot<T extends object>(p: T): T;
}

export const codexStore = proxy<CodexStore>({
    view: { value: "home" },
    prefs: new Prefs(),
    save: exampleSave,
    editor: null,
    unsavedChanges: false,
    modals: modalStore
});

export function saveActivePage() {}

export function exportPage(page: Page, type: "pdf" | "md") {}

export function setView(v: View) {
    codexStore.view = v;
}

export function modifyPrefs(callback: (p: Prefs) => void) {
    callback(codexStore.prefs);
}
