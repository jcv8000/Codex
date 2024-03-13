import { ActionIcon, Anchor, Paper, Space, Text, Tooltip, Transition } from "@mantine/core";
import { Editor } from "@tiptap/react";
import { Icon } from "components/Icon";
import { useCallback, useEffect, useState } from "react";
import { truncate } from "common/Utils";
import { useLocale } from "src/state";
import { MainFloat } from "components/Floats";
import classes from "./TableOfContents.module.css";

export function TableOfContents(props: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<any>([]);

    const texts = useLocale().editor;

    const handleUpdate = useCallback(() => {
        setTimeout(() => {
            const headings: any[] = [];
            const transaction = props.editor.state.tr;

            props.editor.state.doc.descendants((node, pos) => {
                if (node.type.name === "heading") {
                    const id = `heading-${headings.length + 1}`;

                    if (node.attrs.id !== id) {
                        transaction.setNodeMarkup(pos, undefined, {
                            ...node.attrs,
                            id
                        });
                    }

                    headings.push({
                        level: node.attrs.level,
                        text: truncate(node.textContent, 50),
                        id
                    });
                }
            });

            transaction.setMeta("addToHistory", false);
            transaction.setMeta("preventUpdate", true);

            props.editor.view.dispatch(transaction);

            setItems(headings);
        }, 1);
    }, [props.editor]);

    // Reset the item list when swtiching pages
    useEffect(handleUpdate, [props.editor.state.doc, handleUpdate]);

    useEffect(() => {
        props.editor.on("update", handleUpdate);

        return function cleanup() {
            props.editor.off("update", handleUpdate);
        };
    }, [props.editor, handleUpdate]);

    return (
        <>
            <MainFloat pos={{ top: 16, left: 16 }}>
                <Tooltip withArrow label={texts.table_of_contents} position="right">
                    <ActionIcon onClick={() => setOpen(!open)}>
                        <Icon icon="list-search" />
                    </ActionIcon>
                </Tooltip>
            </MainFloat>

            <Transition mounted={open} transition="pop-top-left" duration={200} exitDuration={200}>
                {(styles) => (
                    <MainFloat pos={{ top: 48, left: 16 }}>
                        <Paper className={classes.body} withBorder style={styles}>
                            <Text fz="xs">{texts.table_of_contents}</Text>
                            <Space h="sm" />

                            {items.map((item: any, index: any) => (
                                <Anchor
                                    key={index}
                                    className={classes.link}
                                    href={`#${item.id}`}
                                    pl={item.level * 16}
                                    truncate="end"
                                >
                                    {item.text}
                                </Anchor>
                            ))}
                        </Paper>
                    </MainFloat>
                )}
            </Transition>
        </>
    );
}
