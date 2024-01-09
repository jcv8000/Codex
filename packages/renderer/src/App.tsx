import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";

import { AppShell, MantineProvider } from "@mantine/core";

import { Prefs } from "common/Prefs";
import { NoteItem, Save } from "common/Save";
import { useRef, useState } from "react";
import { useForceUpdate } from "@mantine/hooks";
import { useSetView, useModifyPrefs, useModifySave } from "./state/hooks";
import { CodexContext, View } from "./state/CodexStore";

const startPrefs = JSON.parse(window.api.getPrefs()) as Prefs;
const startSave = Save.parse(window.api.getSave());

export function App() {
    const forceUpdate = useForceUpdate();

    const [view, _setView] = useState<View>({ value: "home" });
    const [prefs, _setPrefs] = useState(startPrefs);
    const [save, _setSave] = useState(startSave);

    const unsavedChanges = useRef(false);
    const draggedNoteItem = useRef<NoteItem | null>(null);

    const setView = useSetView(_setView);
    const modifyPrefs = useModifyPrefs(prefs, forceUpdate);
    const modifySave = useModifySave(save, forceUpdate);

    return (
        <CodexContext.Provider
            value={{
                prefs: prefs,
                save: startSave,
                view: view,

                setView: setView,
                modifyPrefs: modifyPrefs,
                modifySave: modifySave,

                unsavedChanges: unsavedChanges.current,
                draggedNoteItem: draggedNoteItem.current
            }}
        >
            <MantineProvider>
                <AppShell></AppShell>
            </MantineProvider>
        </CodexContext.Provider>
    );
}
