import { ColorInput, Container } from "@mantine/core";
import { useCodexStore } from "src/state/CodexStore";

export function SettingsView() {
    const prefs = useCodexStore.use.prefs();
    const modifyPrefs = useCodexStore.use.modifyPrefs();
    return (
        <Container>
            <ColorInput
                label="Accent Color"
                description="Your selected accent color is used throughout the app to color things like the active page in the sidebar, buttons, outlines, etc."
                defaultValue={prefs.general.accentColor}
                onChange={(value) => modifyPrefs((p) => (p.general.accentColor = value))}
            />
        </Container>
    );
}
