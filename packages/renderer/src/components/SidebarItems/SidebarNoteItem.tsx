import { Box, Collapse, Flex, Text, rem } from "@mantine/core";
import { Icon } from "components/Icon";
import React, { useRef, useState } from "react";
import { NoteItem, isDescendantOf, isFolder, isPage } from "common/schemas/v2/Save";
import { locales } from "common/Locales";
import { codexStore, dragDropItem, modalStore, toggleOpened, useSnapshot } from "src/state";
import clsx from "clsx";

import classes from "./SidebarItem.module.css";
import { flexProps, getLeftPadding, textSize } from "./styles";

type DragStatus = "none" | "above" | "below" | "child" | "beingDragged";

type Props = {
    item: NoteItem;
    depth?: number;
};

export function SidebarNoteItem({ item, depth = 0 }: Props) {
    const { prefs } = useSnapshot(codexStore);
    const locale = locales[prefs.general.locale];

    const [dragStatus, setDragStatus] = useState<DragStatus>("none");
    const dragImageRef = useRef<HTMLDivElement>(null);

    const children = new Array<JSX.Element>();

    if (isFolder(item)) {
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
                    style={{ paddingLeft: rem((depth + 2) * 16) }}
                >
                    {locale.sidebar.nothing_here}
                </Text>
            );
        }
    }

    const active = codexStore.view.value == "editor" && codexStore.view.activePageId == item.id;

    return (
        <>
            <Box
                title={item.name}
                className={clsx(
                    classes.item,
                    active && classes.itemActive,
                    dragStatus == "above" && classes.dragAbove,
                    dragStatus == "below" && classes.dragBelow,
                    dragStatus == "child" && classes.dragChild
                )}
                onClick={onClick(item)}
                onContextMenu={onContextMenu(item)}
                draggable={true}
                onDragStart={onDragStart(setDragStatus, dragImageRef, item)}
                onDragOver={onDragOver(setDragStatus, item)}
                onDragLeave={onDragLeave(setDragStatus)}
                onDrop={onDrop(dragStatus, setDragStatus, dragImageRef, item)}
                style={{
                    paddingLeft: getLeftPadding(depth)
                }}
            >
                <Flex {...flexProps}>
                    <Icon
                        icon={item.icon}
                        color={active ? "var(--accent-text-color)" : item.color}
                    />

                    <Text fz={textSize} truncate ref={dragImageRef}>
                        {item.name}
                    </Text>

                    {isFolder(item) && (
                        <span
                            className={clsx(classes.caret, item.opened && classes.caretOpen)}
                        ></span>
                    )}

                    {isPage(item) && item.favorited && (
                        <span style={{ marginLeft: "auto" }}>
                            <Icon
                                icon="star-filled"
                                color={active ? "var(--accent-text-color)" : "orange"}
                                vAlign="-1px"
                                size={14}
                            />
                        </span>
                    )}
                </Flex>
            </Box>

            {isFolder(item) && (
                <Collapse in={item.opened}>
                    <div>{children}</div>
                </Collapse>
            )}
        </>
    );
}

function onClick(item: NoteItem): React.MouseEventHandler {
    return (e) => {
        // if (item instanceof Folder) {
        //     modifySave(() => {
        //         if (item.opened == true && e.altKey) {
        //             // Recursively close folder and all children
        //             const recurseClose = (f: Folder) => {
        //                 f.opened = false;

        //                 f.children.forEach((child) => {
        //                     if (child instanceof Folder) {
        //                         recurseClose(child);
        //                     }
        //                 });
        //             };

        //             recurseClose(item);
        //         } else {
        //             item.opened = !item.opened;
        //         }
        //     });
        // } else if (item instanceof Page) {
        //     setView({ value: "editor", activePage: item });
        // }

        if (isFolder(item)) toggleOpened(item.id);
    };
}

function onContextMenu(item: NoteItem): React.MouseEventHandler<HTMLDivElement> {
    return (e) => {
        e.preventDefault();
        modalStore.contextMenuState = {
            opened: true,
            item: item,
            x: e.clientX,
            y: e.clientY
        };
    };
}

function onDragStart(
    setDragStatus: React.Dispatch<React.SetStateAction<DragStatus>>,
    dragImageRef: React.RefObject<HTMLDivElement>,
    item: NoteItem
): React.DragEventHandler<HTMLDivElement> {
    return (e) => {
        e.dataTransfer.setDragImage(dragImageRef.current!, 0, -24);
        codexStore.draggedItem = item;
        setDragStatus("beingDragged");
    };
}

function onDragOver(
    setDragStatus: React.Dispatch<React.SetStateAction<DragStatus>>,
    item: NoteItem
): React.DragEventHandler<HTMLDivElement> {
    return (e) => {
        // THIS is the item receiving the drop

        if (codexStore.draggedItem == null) return;

        // Don't let the user try to parent an ancestor to it's descendant, or to itself
        if (!isDescendantOf(item, codexStore.draggedItem) && item.id != codexStore.draggedItem.id) {
            e.preventDefault();

            const rect = e.currentTarget.getBoundingClientRect();
            const yPercent = ((e.clientY - rect.y) / rect.height) * 100;
            const xPercent = (e.clientX / rect.width) * 100;

            if (xPercent > 75 && isFolder(item)) setDragStatus("child");
            else if (yPercent < 50) setDragStatus("above");
            else setDragStatus("below");
        }
    };
}

function onDragLeave(
    setDragStatus: React.Dispatch<React.SetStateAction<DragStatus>>
): React.DragEventHandler<HTMLDivElement> {
    return () => {
        setDragStatus("none");
    };
}

function onDrop(
    dragStatus: DragStatus,
    setDragStatus: React.Dispatch<React.SetStateAction<DragStatus>>,
    dragImageRef: React.RefObject<HTMLDivElement>,
    item: NoteItem
): React.DragEventHandler<HTMLDivElement> {
    return (e) => {
        // THIS is the item receiving the drop
        e.preventDefault();

        let where: "above" | "below" | "child" = "below";
        if (dragStatus == "above") where = "above";
        else if (dragStatus == "below") where = "below";
        else if (dragStatus == "child") where = "child";

        if (codexStore.draggedItem != null) {
            dragDropItem(codexStore.draggedItem.id, item.id, where);
        }

        setDragStatus("none");
    };
}
