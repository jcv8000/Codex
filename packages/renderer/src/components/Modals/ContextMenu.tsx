import { Menu, Text, Title } from "@mantine/core";
import { useClickOutside, useElementSize, useMergedRef } from "@mantine/hooks";
import { locales } from "common/Locales";
import { Folder, NoteItem, Page } from "common/Save";
import { Icon } from "components/Icon";
import { codexStore, modifySave, setView } from "src/state";
import { modalStore } from "src/state";
import { openConfirmModal } from "@mantine/modals";
import { truncate } from "common/Utils";

export type ContextMenuState = {
    opened: boolean;
    item: NoteItem | null;
    x: number;
    y: number;
};

function close() {
    modalStore.contextMenuState.opened = false;
}

export function ContextMenu(props: { state: ContextMenuState }) {
    const { item, opened, x } = props.state;
    const locale = locales[codexStore.prefs.general.locale];

    const clickOutsideRef = useClickOutside(() => {
        if (props.state.opened) close();
    });

    const size = useElementSize();
    const isOffScreen = props.state.y + size.height >= document.documentElement.clientHeight;
    const y = isOffScreen ? props.state.y - size.height : props.state.y;

    const mergedRef = useMergedRef(clickOutsideRef, size.ref);

    return (
        <Menu
            opened={opened}
            onClose={close}
            trapFocus
            closeOnEscape
            position="bottom"
            shadow="md"
            transitionProps={{ transition: "pop-top-left" }}
            styles={{
                dropdown: {
                    position: "fixed",
                    top: `${y}px`,
                    left: `${x}px`
                }
            }}
        >
            <Menu.Dropdown maw={220} ref={mergedRef}>
                {item != null && (
                    <>
                        <Menu.Label>
                            <Text fz="sm" truncate>
                                {item.name}
                            </Text>
                        </Menu.Label>

                        {item instanceof Folder && folderNewItems(item)}

                        <Menu.Item
                            leftSection={<Icon icon="pencil" />}
                            onClick={() => {
                                modalStore.editModalState = { opened: true, item: item };
                            }}
                        >
                            {locale.contextMenu.edit_item}
                        </Menu.Item>

                        {item instanceof Page && pageItems(item)}

                        {item instanceof Folder && folderExports(item)}

                        {deleteItem(item)}
                    </>
                )}
            </Menu.Dropdown>
        </Menu>
    );
}

function folderNewItems(item: Folder) {
    const locale = locales[codexStore.prefs.general.locale];
    return (
        <>
            <Menu.Item
                leftSection={<Icon icon="file-plus" />}
                onClick={() => {
                    modalStore.newModalState = {
                        opened: true,
                        parent: item,
                        type: "page"
                    };
                }}
            >
                {locale.contextMenu.new_page}
            </Menu.Item>
            <Menu.Item
                leftSection={<Icon icon="folder-plus" />}
                onClick={() => {
                    modalStore.newModalState = {
                        opened: true,
                        parent: item,
                        type: "folder"
                    };
                }}
            >
                {locale.contextMenu.new_folder}
            </Menu.Item>
        </>
    );
}

function pageItems(item: Page) {
    const locale = locales[codexStore.prefs.general.locale];
    return (
        <>
            <Menu.Item
                leftSection={<Icon icon="star" />}
                onClick={() => {
                    modifySave(() => {
                        item.favorited = !item.favorited;
                    });
                }}
            >
                {locale.contextMenu.favorite_page(item.favorited)}
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item
                leftSection={<Icon icon="file-typography" />}
                onClick={() => {
                    // TODO export page
                }}
            >
                {locale.contextMenu.export_page_pdf}
            </Menu.Item>

            <Menu.Item
                leftSection={<Icon icon="markdown" />}
                onClick={() => {
                    // TODO export page
                }}
            >
                {locale.contextMenu.export_page_md}
            </Menu.Item>

            <Menu.Divider />
        </>
    );
}

function folderExports(item: Folder) {
    const locale = locales[codexStore.prefs.general.locale];
    return (
        <>
            <Menu.Divider />

            <Menu.Item
                leftSection={<Icon icon="file-typography" />}
                onClick={() => {
                    // TODO export pages
                }}
            >
                {locale.contextMenu.export_all_pages_pdf}
            </Menu.Item>

            <Menu.Item
                leftSection={<Icon icon="markdown" />}
                onClick={() => {
                    // TODO export pages
                }}
            >
                {locale.contextMenu.export_all_pages_md}
            </Menu.Item>

            <Menu.Divider />
        </>
    );
}

function deleteItem(item: NoteItem) {
    const locale = locales[codexStore.prefs.general.locale];
    return (
        <Menu.Item
            color="red"
            leftSection={<Icon icon="trash" />}
            onClick={() => {
                openConfirmModal({
                    title: <Title order={3}>{locale.mutateModals.delete_item_title}</Title>,
                    children: (
                        <Text>
                            {item instanceof Folder
                                ? locale.mutateModals.delete_folder_text(truncate(item.name, 25))
                                : locale.mutateModals.delete_page_text(truncate(item.name, 25))}
                        </Text>
                    ),
                    labels: {
                        confirm: locale.mutateModals.delete,
                        cancel: locale.mutateModals.cancel
                    },
                    confirmProps: { color: "red" },
                    onConfirm: () => {
                        if (codexStore.view.value == "editor" && codexStore.view.activePage == item)
                            setView({ value: "home" });

                        modifySave((s) => {
                            if (item.parent == null) {
                                s.items.splice(s.items.indexOf(item), 1);
                            } else {
                                const parent = item.parent as Folder;
                                parent.children.splice(parent.children.indexOf(item), 1);
                            }
                        });
                    }
                });
            }}
        >
            {locale.contextMenu.delete_item}
        </Menu.Item>
    );
}
