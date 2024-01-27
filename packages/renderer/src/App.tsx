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
    const { prefs } = useSnapshot(codexStore);

    return (
        <MantineProvider theme={AppTheme(prefs.general.accentColor, prefs.editor.codeWordWrap)}>
            <ModalsWrapper>
                <div id="sidebar">
                    <SidebarContent />
                </div>

                <div id="main">
                    <View />
                </div>
            </ModalsWrapper>
        </MantineProvider>
    );
}
