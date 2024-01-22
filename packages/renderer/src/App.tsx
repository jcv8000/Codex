import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@tabler/icons-webfont/tabler-icons.min.css";
import "./styles/layout.css";
import "./styles/titlebar.css";

// TODO optimize styling more with package "classnames"

import { MantineProvider } from "@mantine/core";
import { AppTheme } from "./state/AppTheme";
import { SidebarContent } from "components/SidebarContent";
import { View } from "components/Views/View";
import { codexStore, useSnapshot } from "./state";

export function App() {
    const state = useSnapshot(codexStore);
    console.log("app rerendered");
    return (
        <MantineProvider
            theme={AppTheme(state.prefs.general.accentColor, state.prefs.editor.codeWordWrap)}
        >
            <div id="viewport">
                <div id="sidebar">
                    <SidebarContent />
                </div>

                <div id="main">
                    <div id="main-content">
                        <View />
                    </div>
                </div>
            </div>
        </MantineProvider>
    );
}
