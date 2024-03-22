import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@tabler/icons-webfont/tabler-icons.min.css";
import "katex/dist/katex.min.css";
import "./styles/layout.css";
import "./styles/titlebar.css";

import { MantineProvider } from "@mantine/core";
import { AppTheme } from "./styles/AppTheme";
import { Sidebar } from "components/Sidebar";
import { codexStore, useSnapshot } from "./state";
import { ModalsProvider } from "components/Modals";
import { ModalsProvider as MantineModalsProvider } from "@mantine/modals";
import { HomeView } from "components/HomeView";
import { SettingsView } from "components/SettingsView";
import { EditorView } from "components/Editor";
import { useElementSize } from "@mantine/hooks";
import { px } from "common/Utils";

export function App() {
    return (
        <MantineWrapper>
            <MantineModalsProvider>
                <Sidebar />

                <MainView />

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

function MainView() {
    const { view } = useSnapshot(codexStore);
    const { ref, width } = useElementSize();

    let rendered = <></>;

    if (view.value == "home") rendered = <HomeView />;
    else if (view.value == "settings") rendered = <SettingsView />;
    else if (view.value == "editor") {
        rendered = <EditorView initialContentString={view.initialContentString} />;
    }

    return (
        <>
            <div id="main-overlay" style={{ width: px(width) }} />
            <div id="main" ref={ref}>
                {rendered}
            </div>
        </>
    );
}
