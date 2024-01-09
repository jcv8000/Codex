import { AppShell, Box } from "@mantine/core";
import { Sidebar } from "components/Sidebar";
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
            <AppShell.Navbar>
                <div className="relativeBox">
                    <Box py="md">
                        <Sidebar />
                    </Box>
                </div>
            </AppShell.Navbar>
            <AppShell.Main display="grid">
                <div className="relativeBox">{props.children}</div>
            </AppShell.Main>
        </AppShell>
    );
}
