import { Grid, Center, Text, Button, Stack, Title } from "@mantine/core";
import { locales } from "common/Locales";
import { Page, NoteItem, Folder } from "common/Save";
import { Icon } from "components/Icon";
import { ModalContext } from "components/Modals";
import { useContext } from "react";
import { AppContext } from "types/AppStore";

export function FavoritesDisplay() {
    const appContext = useContext(AppContext);
    const modalContext = useContext(ModalContext);

    const locale = locales[appContext.prefs.general.locale];

    const favorites: Page[] = [];
    const recurse = (item: NoteItem) => {
        if (item instanceof Folder) item.children.forEach((child) => recurse(child));

        if (item instanceof Page && item.favorited) favorites.push(item);
    };
    appContext.save.items.forEach((item) => recurse(item));

    return favorites.length > 0 ? (
        <>
            <Center>
                <Title order={4}>{locale.home.favorites}</Title>
            </Center>
            <Grid grow gutter="lg" w="500px">
                {favorites.map((page) => (
                    <Grid.Col key={page.id} span={4}>
                        <Button
                            fullWidth
                            variant="default"
                            p="md"
                            style={{ height: "fit-content" }}
                            onClick={() => appContext.setView("editor", page)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                modalContext.openContextMenu({
                                    item: page,
                                    x: e.clientX,
                                    y: e.clientY
                                });
                            }}
                        >
                            <Stack w="100%">
                                <Center>
                                    <Icon icon={page.icon} color={page.color} size={32} />
                                </Center>
                                <Text truncate>{page.name}</Text>
                            </Stack>
                        </Button>
                    </Grid.Col>
                ))}
            </Grid>
        </>
    ) : (
        <></>
    );
}
