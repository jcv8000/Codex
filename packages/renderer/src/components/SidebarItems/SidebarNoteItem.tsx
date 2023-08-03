import { Box, Collapse, Flex, Text, useMantineTheme } from "@mantine/core";
import { Icon } from "components/Icon";
import React, { useContext, useRef, useState } from "react";
import { Folder, NoteItem, Page, Save } from "common/Save";
import { AppContext } from "types/AppStore";
import { sidebarItemStyles } from "./styles";
import { ModalContext } from "components/Modals";
import { locales } from "common/Locales";

type DragStatus = "none" | "above" | "below" | "child" | "beingDragged";

type Props = {
    item: NoteItem;
    depth?: number;
};

export function SidebarNoteItem({ item, depth = 0 }: Props) {
    const theme = useMantineTheme();
    const appContext = useContext(AppContext);
    const modalContext = useContext(ModalContext);

    const [dragStatus, setDragStatus] = useState<DragStatus>("none");
    const dragImageRef = useRef<HTMLDivElement>(null);

    const onDragStart: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.dataTransfer.setDragImage(dragImageRef.current!, 0, -24);
        appContext.draggedItem = item;
        setDragStatus("beingDragged");
    };

    const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
        // THIS is the item receiving the drop

        if (appContext.draggedItem == null) return;

        // Don't let the user try to parent an ancestor to it's descendant, or to itself
        if (!Save.isDescendantOf(item, appContext.draggedItem) && item != appContext.draggedItem) {
            e.preventDefault();

            const rect = e.currentTarget.getBoundingClientRect();
            const yPercent = ((e.clientY - rect.y) / rect.height) * 100;
            const xPercent = (e.clientX / rect.width) * 100;

            if (xPercent > 75 && item instanceof Folder) setDragStatus("child");
            else if (yPercent < 50) setDragStatus("above");
            else setDragStatus("below");
        }
    };

    const onDragLeave: React.DragEventHandler<HTMLDivElement> = () => {
        setDragStatus("none");
    };

    const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
        // THIS is the item receiving the drop
        e.preventDefault();

        let where: "above" | "below" | "child" = "below";
        if (dragStatus == "above") where = "above";
        else if (dragStatus == "below") where = "below";
        else if (dragStatus == "child") where = "child";

        appContext.modifySave((s) => {
            if (appContext.draggedItem != null) {
                s.dragDropItem(appContext.draggedItem, item, where);
            }
        });

        setDragStatus("none");
    };

    const onClick: React.MouseEventHandler = (e) => {
        if (item instanceof Folder) {
            appContext.modifySave(() => {
                if (item.opened == true && e.altKey) {
                    // Recursively close folder and all children
                    const recurseClose = (f: Folder) => {
                        f.opened = false;

                        f.children.forEach((child) => {
                            if (child instanceof Folder) {
                                recurseClose(child);
                            }
                        });
                    };

                    recurseClose(item);
                } else {
                    item.opened = !item.opened;
                }
            });
        } else if (item instanceof Page) {
            appContext.setView("editor", item);
        }
    };

    const onContextMenu: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        modalContext.openContextMenu({ item: item, x: e.clientX, y: e.clientY });
    };

    const children = new Array<JSX.Element>();

    if (item instanceof Folder) {
        item.children.forEach((child) => {
            children.push(<SidebarNoteItem item={child} key={child.id} depth={depth + 1} />);
        });

        if (item.children.length == 0) {
            children.push(
                <Text
                    key="nothingHere"
                    fz="xs"
                    fs="italic"
                    c="dimmed"
                    py={4}
                    style={{ paddingLeft: (depth + 2) * 15 + "px" }}
                >
                    {locales[appContext.prefs.general.locale].sidebar.nothing_here}
                </Text>
            );
        }
    }

    const active = appContext.view == "editor" && appContext.activePage == item ? true : false;

    let borderTopColor = "transparent";
    let borderBottomColor = "transparent";
    if (dragStatus == "above") borderTopColor = "blue";
    else if (dragStatus == "below") borderBottomColor = "red";
    else if (dragStatus == "child") borderBottomColor = borderTopColor = "green";

    const { classes } = sidebarItemStyles({
        active: active,
        depth: depth,
        open: item instanceof Folder ? item.opened : false
    });

    return (
        <>
            <Box
                title={item.name}
                className={classes.root}
                onClick={onClick}
                onContextMenu={onContextMenu}
                draggable={true}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                style={{
                    borderTop: `1px solid ${borderTopColor}`,
                    borderBottom: `1px solid ${borderBottomColor}`
                }}
            >
                <Flex h={34} align="center" gap="sm" pr="sm">
                    <Icon
                        icon={item.icon}
                        color={active ? theme.colors["accentText"][0] : item.color}
                        vAlign="-3px"
                    />

                    <Text truncate ref={dragImageRef}>
                        {item.name}
                    </Text>

                    {item instanceof Folder && <span className={classes.caret}></span>}

                    {item instanceof Page && item.favorited && (
                        <span style={{ marginLeft: "auto" }}>
                            <Icon
                                icon="star-filled"
                                color={active ? theme.colors["accentText"][0] : "orange"}
                                vAlign="-1px"
                                size={14}
                            />
                        </span>
                    )}
                </Flex>
            </Box>

            {item instanceof Folder && (
                <Collapse in={item.opened}>
                    <div>{children}</div>
                </Collapse>
            )}
        </>
    );
}
