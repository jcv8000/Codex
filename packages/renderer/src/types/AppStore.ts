import { createContext } from "react";
import { Prefs } from "common/Prefs";
import { Folder, NoteItem, Page, Save, exampleSave } from "common/Save";
import { View } from "types/View";

export class AppStore {
    readonly prefs: Prefs = new Prefs();
    modifyPrefs: (callback: (prefs: Prefs) => void) => void = () => {};

    readonly view: View = "home";
    setView: (v: View, activePage?: Page) => void = () => {};

    activePage: Page | null = null;

    save: Save = exampleSave;
    modifySave: (callback: (save: Save) => void) => void = () => {};

    draggedItem: NoteItem | null = null;

    exportPage: (page: Page, type: "pdf" | "md") => void = () => {};
    exportAllPagesIn: (folder: Folder, type: "pdf" | "md") => void = () => {};
}

export const AppContext = createContext<AppStore>(new AppStore());
