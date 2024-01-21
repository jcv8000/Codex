import { Image, Center } from "@mantine/core";
import { useCodexStore } from "src/state/CodexStore";

export function HomeView() {
    const prefs = useCodexStore.use.prefs();
    return (
        <>
            <Center h="100%">
                <Image
                    src={prefs.general.theme == "dark" ? "logo-light.png" : "logo.png"}
                    h={160}
                ></Image>
            </Center>
        </>
    );
}
