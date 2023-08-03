import { Button, Center, Image, Space, Stack, useMantineTheme } from "@mantine/core";
import { useContext } from "react";
import { ModalContext } from "components/Modals";
import { TipDisplay } from "./TipDisplay";
import { FavoritesDisplay } from "./FavoritesDisplay";
import { AppContext } from "types/AppStore";
import { locales } from "common/Locales";

export function HomeView() {
    const theme = useMantineTheme();
    const modalContext = useContext(ModalContext);

    const { prefs } = useContext(AppContext);
    const locale = locales[prefs.general.locale];

    return (
        <div style={{ height: "100%", display: "flex", flexFlow: "column" }}>
            <div style={{ flex: "1 1 auto" }}>
                <Center h="100%" pt="100px">
                    <Stack>
                        <Center>
                            <Image
                                src={theme.colorScheme == "dark" ? "logo-light.png" : "logo.png"}
                                width={350}
                            ></Image>
                        </Center>

                        <Center>
                            <code className="version" style={{ color: theme.fn.primaryColor() }}>
                                {locale.home.version} {import.meta.env.VITE_APP_VERSION}
                            </code>
                        </Center>

                        <Center>
                            <Button onClick={() => modalContext.openWhatsNewModal()}>
                                {locale.home.whats_new}
                            </Button>
                        </Center>

                        <Space h="xl" />

                        <FavoritesDisplay />
                    </Stack>
                </Center>
            </div>

            <div style={{ flex: "0 1 100px" }}>
                <Center h="100px" my="md">
                    <TipDisplay />
                </Center>
            </div>
        </div>
    );
}
