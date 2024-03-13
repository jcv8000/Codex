import { Button, ColorInput, Container, Space } from "@mantine/core";
import { setTemportaryFakeAccentColor } from "src/styles/AppTheme";
import { codexStore, useSnapshot } from "src/state";

export function SettingsView() {
    const { prefs } = useSnapshot(codexStore);
    return (
        <Container>
            <ColorInput
                label="Accent Color"
                description="Your selected accent color is used throughout the app to color things like the active page in the sidebar, buttons, outlines, etc."
                defaultValue={prefs.general.accentColor}
                onChange={(value) => setTemportaryFakeAccentColor(value)}
                onChangeEnd={(value) => {
                    codexStore.prefs.general.accentColor = value;
                }}
            />
            <Space h={400} />
            <Button
                onClick={() => {
                    const v = codexStore.prefs.general.autoSaveOnPageSwitch;
                    codexStore.prefs.general.autoSaveOnPageSwitch = !v;
                }}
            >
                Switch auto save on page switch
            </Button>
            Auto save on page switch: {prefs.general.autoSaveOnPageSwitch.toString()}
        </Container>
    );
}
