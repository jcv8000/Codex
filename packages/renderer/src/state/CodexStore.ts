import { create } from "zustand";
import { createSelectors } from "./createSelectors";

import { Prefs, defaultPrefs } from "./NewPrefs";
import { Save, Page, defaultSave } from "./newSave";
import { produce } from "immer";

type View = { value: "home" } | { value: "settings" } | { value: "editor"; activePage: Page };

type CodexStore = {
    view: View;
    setView: (v: View) => void;

    prefs: Prefs;
    modifyPrefs: (callback: (p: Prefs) => void) => void;

    save: Save;

    unsavedChanges: boolean;
    setUnsavedChanges: (v: boolean) => void;

    modifySave: (callback: (s: Save) => void) => void;
    saveActivePage: () => Promise<void>;
    exportPage: (page: Page, type: "pdf" | "md") => Promise<void>;
};

// TODO split into multiple smaller stores
export const useCodexStore = createSelectors(
    create<CodexStore>((set) => ({
        view: { value: "home" },
        setView: (v) => set({ view: v }),

        prefs: defaultPrefs,
        modifyPrefs: (callback) => {
            set(
                produce<CodexStore>((state) => {
                    callback(state.prefs);
                })
            );
        },

        save: defaultSave,

        unsavedChanges: false,
        setUnsavedChanges: (v) => set({ unsavedChanges: v }),

        modifySave: (callback) => {
            set(
                produce<CodexStore>((state) => {
                    callback(state.save);
                })
            );
        },

        saveActivePage: () => Promise.resolve(),
        exportPage: () => Promise.resolve()
    }))
);
