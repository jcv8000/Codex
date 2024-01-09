import { Prefs } from "common/Prefs";
import { Page, Save, NoteItem } from "common/Save";
import { createContext } from "react";
import { useSetView, useModifyPrefs, useModifySave } from "./hooks";

export type View =
    | { value: "home" }
    | { value: "settings" }
    | { value: "editor"; activePage: Page };

class CodexStore {
    readonly prefs: Prefs = new Prefs();
    readonly save: Save = new Save();
    readonly view: View = { value: "home" };

    setView: ReturnType<typeof useSetView> = () => {};
    modifyPrefs: ReturnType<typeof useModifyPrefs> = () => {};
    modifySave: ReturnType<typeof useModifySave> = () => {};

    unsavedChanges: boolean = false;
    draggedNoteItem: NoteItem | null = null;
}

export const CodexContext = createContext<CodexStore>(new CodexStore());
