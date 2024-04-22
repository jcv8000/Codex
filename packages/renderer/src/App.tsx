import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@tabler/icons-webfont/dist/tabler-icons.min.css";
import "katex/dist/katex.min.css";

import "./styles/layout.css";
import "./styles/titlebar.css";
import "./styles/hljs.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { AppTheme } from "./styles/AppTheme";
import { Sidebar } from "components/Sidebar";
import { codexStore, useSnapshot } from "./state";
import { ModalsProvider } from "components/Modals";
import { ModalsProvider as MantineModalsProvider } from "@mantine/modals";
import { HomeView } from "components/HomeView";
import { SettingsView } from "components/SettingsView";
import { EditorView } from "components/Editor";
import { useElementSize } from "@mantine/hooks";
import { px, renderDebug } from "common/Utils";

export function App() {
    renderDebug("App");
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
    renderDebug("MantineWrapper");

    return (
        <>
            <link rel="stylesheet" href={`assets/hljs/${editor.codeBlockTheme}.css`} />
            <ColorSchemeScript forceColorScheme={general.theme} />
            <MantineProvider
                theme={AppTheme({
                    accentColor: general.accentColor,
                    codeWordWrap: editor.codeWordWrap,
                    sidebarWidth: general.sidebarWidth
                })}
                forceColorScheme={general.theme}
            >
                {props.children}
            </MantineProvider>
        </>
    );
}

function MainView() {
    const { view } = useSnapshot(codexStore);
    const { ref, width } = useElementSize();
    renderDebug("MainView");

    let rendered = <></>;

    if (view.value == "home") rendered = <HomeView />;
    else if (view.value == "settings") rendered = <SettingsView />;
    else if (view.value == "editor") {
        rendered = <EditorView initialContentString={view.initialContentString} />;
    }

    return (
        <>
            <div id="main-overlay" style={{ width: px(width) }} />

            <Notifications
                portalProps={{ target: "#main-overlay" }}
                style={{ pointerEvents: "auto" }}
            />

            <div id="main" ref={ref}>
                {rendered}
            </div>
        </>
    );
}
