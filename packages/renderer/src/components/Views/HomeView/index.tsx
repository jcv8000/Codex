import { Stack, Image, Center } from "@mantine/core";
import { useCodexContext } from "src/state/useCodexContext";

export function HomeView() {
    const { prefs } = useCodexContext();
    return (
        <Center h="100%">
            <Image
                src={prefs.general.theme == "dark" ? "logo-light.png" : "logo.png"}
                h={160}
            ></Image>
        </Center>
    );
}
