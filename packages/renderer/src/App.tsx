import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";

import "./styles/positioning.css";
import "./styles/titlebar.css";

import { MantineProvider } from "@mantine/core";
import { Prefs } from "common/Prefs";
import { NoteItem, Save } from "common/Save";
import { useRef, useState } from "react";
import { useForceUpdate } from "@mantine/hooks";
import { useSetView, useModifyPrefs, useModifySave } from "./state/hooks";
import { CodexContext, View } from "./state/CodexStore";
import { Shell } from "components/Shell";
import { AppTheme } from "./state/AppTheme";
import { HomeView } from "components/Views/HomeView";

const startPrefs = JSON.parse(window.api.getPrefs()) as Prefs;
const startSave = Save.parse(window.api.getSave());

export function App() {
    const forceUpdate = useForceUpdate();

    // State
    const [view, _setView] = useState<View>({ value: "home" });
    const [prefs, _setPrefs] = useState(startPrefs);
    const [save, _setSave] = useState(startSave);

    // References
    const unsavedChanges = useRef(false);
    const draggedNoteItem = useRef<NoteItem | null>(null);

    // State mutator callbacks
    const setView = useSetView(_setView);
    const modifyPrefs = useModifyPrefs(prefs, forceUpdate);
    const modifySave = useModifySave(save, forceUpdate);

    // Render view
    let renderedView: JSX.Element = <></>;
    switch (view.value) {
        case "home":
            renderedView = <HomeView />;
            break;
        case "settings":
            renderedView = <></>;
            break;
        case "editor":
            renderedView = <></>;
            break;
    }

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
            <MantineProvider theme={AppTheme(prefs)}>
                <Shell>{renderedView}</Shell>
            </MantineProvider>
        </CodexContext.Provider>
    );
}
