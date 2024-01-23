import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@tabler/icons-webfont/tabler-icons.min.css";
import "./styles/layout.css";
import "./styles/titlebar.css";

import { MantineProvider } from "@mantine/core";
import { AppTheme } from "./styles/AppTheme";
import { SidebarContent } from "components/SidebarContent";
import { View } from "components/Views/View";
import { codexStore, useSnapshot } from "./state";
import { ModalsWrapper } from "components/Modals";

export function App() {
    const state = useSnapshot(codexStore);
    console.log("app rerendered");
    return (
        <MantineProvider
            theme={AppTheme(state.prefs.general.accentColor, state.prefs.editor.codeWordWrap)}
        >
            <ModalsWrapper>
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
            </ModalsWrapper>
        </MantineProvider>
    );
}
