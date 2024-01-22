import { Button, ColorInput, Container, Space } from "@mantine/core";
import { setTemportaryFakeAccentColor } from "src/state/AppTheme";
import { codexStore, modifyPrefs, useSnapshot } from "src/state";

export function SettingsView() {
    const { prefs } = useSnapshot(codexStore);
    return (
        <Container>
            <ColorInput
                label="Accent Color"
                description="Your selected accent color is used throughout the app to color things like the active page in the sidebar, buttons, outlines, etc."
                defaultValue={prefs.general.accentColor}
                onChange={(value) => setTemportaryFakeAccentColor(value)}
                onChangeEnd={(value) => modifyPrefs((p) => (p.general.accentColor = value))}
            />
            <Space h={400} />
            <Button
                onClick={() =>
                    modifyPrefs(
                        (p) =>
                            (p.general.autoSaveOnPageSwitch =
                                !codexStore.prefs.general.autoSaveOnPageSwitch)
                    )
                }
            >
                Switch auto save on page switch
            </Button>
            Auto save on page switch: {prefs.general.autoSaveOnPageSwitch.toString()}
        </Container>
    );
}
