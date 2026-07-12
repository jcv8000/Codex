import { Menu, Text, Title, Checkbox, Stack } from "@mantine/core";
import { useClickOutside, useElementSize } from "@mantine/hooks";
import { openConfirmModal } from "@mantine/modals";
import { Icon } from "components/Icon";
import { useContext } from "react";
import { Folder, NoteItem, Page } from "common/Save";
import { AppContext } from "types/AppStore";
import { truncate } from "common/Utils";
import { locales } from "common/Locales";
import { ModalContext } from "./ModalProvider";

export type ContextMenuState = {
    opened: boolean;
    item: NoteItem;
    x: number;
    y: number;
};

export function ContextMenu(props: { state: ContextMenuState; onClose: () => void }) {
    const { item, opened, x } = props.state;

    const appContext = useContext(AppContext);
    const modalContext = useContext(ModalContext);

    const ref = useClickOutside(() => {
        if (props.state.opened) props.onClose();
    });

    const locale = locales[appContext.prefs.general.locale];

    const size = useElementSize();
    const isOffScreen = props.state.y + size.height >= document.documentElement.clientHeight;
    const y = isOffScreen ? props.state.y - size.height : props.state.y;

    return (
        <div ref={ref}>
            <Menu
                shadow="md"
                position="bottom"
                transitionProps={{ transition: "pop-top-left" }}
                opened={opened}
                keepMounted
                closeOnEscape
                onClose={props.onClose}
                styles={{
                    dropdown: {
                        position: "fixed",
                        top: `${y}px !important`,
                        left: `${x}px !important`
                    }
                }}
            >
                <Menu.Dropdown maw={220}>
                    <div ref={size.ref}>
                        <Menu.Label>
                            <Text truncate>{item.name}</Text>
                        </Menu.Label>

                        {item instanceof Folder && (
                            <>
                                <Menu.Item
                                    icon={<Icon icon="file-plus" />}
                                    onClick={() => {
                                        modalContext.openNewModal({ parent: item, type: "page" });
                                    }}
                                >
                                    {locale.contextMenu.new_page}
                                </Menu.Item>
                                <Menu.Item
                                    icon={<Icon icon="folder-plus" />}
                                    onClick={() => {
                                        modalContext.openNewModal({ parent: item, type: "folder" });
                                    }}
                                >
                                    {locale.contextMenu.new_folder}
                                </Menu.Item>
                            </>
                        )}

                        <Menu.Item
                            icon={<Icon icon="pencil" />}
                            onClick={() => {
                                modalContext.openEditModal({ item: item });
                            }}
                        >
                            {locale.contextMenu.edit_item}
                        </Menu.Item>

                        {item instanceof Page && appContext.selectedPages.length > 1 && appContext.selectedPages.includes(item) && (
                            <>
                                <Menu.Divider />

                                <Menu.Item
                                    icon={<Icon icon="file-typography" />}
                                    onClick={() => {
                                        appContext.exportMultiplePages(appContext.selectedPages, "pdf");
                                    }}
                                >
                                    Export {appContext.selectedPages.length} selected to PDF
                                </Menu.Item>

                                <Menu.Item
                                    icon={<Icon icon="markdown" />}
                                    onClick={() => {
                                        appContext.exportMultiplePages(appContext.selectedPages, "md");
                                    }}
                                >
                                    Export {appContext.selectedPages.length} selected to MD
                                </Menu.Item>

                                <Menu.Divider />
                            </>
                        )}

                        {item instanceof Page && (!appContext.selectedPages.includes(item) || appContext.selectedPages.length <= 1) && (
                            <>
                                <Menu.Item
                                    icon={<Icon icon="star" />}
                                    onClick={() => {
                                        appContext.modifySave(
                                            () => (item.favorited = !item.favorited)
                                        );
                                    }}
                                >
                                    {locale.contextMenu.favorite_page(item.favorited)}
                                </Menu.Item>

                                <Menu.Divider />

                                <Menu.Item
                                    icon={<Icon icon="file-typography" />}
                                    onClick={() => {
                                        appContext.exportPage(item, "pdf");
                                    }}
                                >
                                    {locale.contextMenu.export_page_pdf}
                                </Menu.Item>

                                <Menu.Item
                                    icon={<Icon icon="markdown" />}
                                    onClick={() => {
                                        appContext.exportPage(item, "md");
                                    }}
                                >
                                    {locale.contextMenu.export_page_md}
                                </Menu.Item>

                                <Menu.Divider />
                            </>
                        )}
                        {item instanceof Folder && (
                            <>
                                <Menu.Divider />

                                <Menu.Item
                                    icon={<Icon icon="file-typography" />}
                                    onClick={() => {
                                        //appContext.openExportModal({ item: item, type: "pdf" });
                                        appContext.exportAllPagesIn(item, "pdf");
                                    }}
                                >
                                    {locale.contextMenu.export_all_pages_pdf}
                                </Menu.Item>

                                <Menu.Item
                                    icon={<Icon icon="markdown" />}
                                    onClick={() => {
                                        //appContext.openExportModal({ item: item, type: "md" });
                                        appContext.exportAllPagesIn(item, "md");
                                    }}
                                >
                                    {locale.contextMenu.export_all_pages_md}
                                </Menu.Item>

                                <Menu.Divider />
                            </>
                        )}

                        <Menu.Item
                            color="red"
                            icon={<Icon icon="trash" />}
                            onClick={() => {
                                const isMultiSelect = appContext.selectedPages.includes(item as Page) && appContext.selectedPages.length > 1;
                                const itemsToDelete: NoteItem[] = isMultiSelect ? appContext.selectedPages : [item];

                                let deleteFromDisk = false;

                                const deleteFromDiskRecursive = async (itemToDelete: NoteItem) => {
                                    if (itemToDelete instanceof Page) {
                                        await window.api.deletePage(itemToDelete.fileName);
                                    } else if (itemToDelete instanceof Folder) {
                                        for (const child of itemToDelete.children) {
                                            await deleteFromDiskRecursive(child);
                                        }
                                    }
                                };

                                openConfirmModal({
                                    title: (
                                        <Title order={3}>
                                            {locale.mutateModals.delete_item_title}
                                        </Title>
                                    ),
                                    children: (
                                        <Stack spacing="md">
                                            <Text>
                                                {isMultiSelect
                                                    ? locale.mutateModals.delete_multiple_text(itemsToDelete.length)
                                                    : item instanceof Folder
                                                    ? locale.mutateModals.delete_folder_text(
                                                          truncate(item.name, 25)
                                                      )
                                                    : locale.mutateModals.delete_page_text(
                                                          truncate(item.name, 25)
                                                      )}
                                            </Text>
                                            <Checkbox
                                                label={locale.mutateModals.delete_from_disk_checkbox}
                                                onChange={(e) => deleteFromDisk = e.currentTarget.checked}
                                                color="red"
                                            />
                                        </Stack>
                                    ),
                                    labels: {
                                        confirm: locale.mutateModals.delete,
                                        cancel: locale.mutateModals.cancel
                                    },
                                    confirmProps: { color: "red" },
                                    onConfirm: async () => {
                                        if (deleteFromDisk) {
                                            for (const target of itemsToDelete) {
                                                await deleteFromDiskRecursive(target);
                                            }
                                        }

                                        if (appContext.activePage && itemsToDelete.includes(appContext.activePage)) {
                                            appContext.setView("home");
                                        }

                                        appContext.modifySave((s) => {
                                            for (const target of itemsToDelete) {
                                                if (target.parent == null) {
                                                    const idx = s.items.indexOf(target);
                                                    if (idx !== -1) s.items.splice(idx, 1);
                                                } else {
                                                    const parent = target.parent as Folder;
                                                    const idx = parent.children.indexOf(target);
                                                    if (idx !== -1) parent.children.splice(idx, 1);
                                                }
                                            }
                                        });

                                        if (isMultiSelect) {
                                            appContext.selectedPages = [];
                                        }
                                    }
                                });
                            }}
                        >
                            {appContext.selectedPages.includes(item as Page) && appContext.selectedPages.length > 1
                                ? locale.contextMenu.delete_multiple_items(appContext.selectedPages.length)
                                : locale.contextMenu.delete_item}
                        </Menu.Item>
                    </div>
                </Menu.Dropdown>
            </Menu>
        </div>
    );
}
