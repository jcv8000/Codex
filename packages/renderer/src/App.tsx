import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@tabler/icons-webfont/tabler-icons.min.css";
import "./styles/layout.css";
import "./styles/titlebar.css";

import { MantineProvider } from "@mantine/core";
import { AppTheme } from "./styles/AppTheme";
import { Sidebar } from "components/Sidebar";
import { View } from "components/Views/View";
import { codexStore, useSnapshot } from "./state";
import { ModalsProvider } from "components/Modals";
import { ModalsProvider as MantineModalsProvider } from "@mantine/modals";

export function App() {
    return (
        <MantineWrapper>
            <MantineModalsProvider>
                <Sidebar />

                <div id="main">
                    <View />
                </div>

                <ModalsProvider />
            </MantineModalsProvider>
        </MantineWrapper>
    );
}

function MantineWrapper(props: { children?: React.ReactNode }) {
    const { general, editor } = useSnapshot(codexStore).prefs;
    return (
        <MantineProvider
            theme={AppTheme({
                accentColor: general.accentColor,
                codeWordWrap: editor.codeWordWrap,
                sidebarWidth: general.sidebarWidth
            })}
        >
            {props.children}
        </MantineProvider>
    );
}
