import { Image, Center, Button } from "@mantine/core";
import { codexStore, useSnapshot } from "src/state";

export function HomeView() {
    const { prefs } = useSnapshot(codexStore);
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
