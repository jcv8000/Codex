import { AppShell } from "@mantine/core";
import { useCodexContext } from "src/state/useCodexContext";

export function Shell(props: { children?: React.ReactNode }) {
    const { prefs } = useCodexContext();
    return (
        <AppShell
            padding="md"
            navbar={{
                collapsed: { desktop: false },
                width: prefs.general.sidebarWidth,
                breakpoint: 0
            }}
        >
            <AppShell.Navbar p="sm">
                <div className="relativeBox">poo</div>
            </AppShell.Navbar>
            <AppShell.Main>
                <div className="relativeBox">{props.children}</div>
            </AppShell.Main>
        </AppShell>
    );
}
