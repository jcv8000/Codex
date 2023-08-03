import {
    ActionIcon,
    Anchor,
    createStyles,
    Paper,
    rem,
    Space,
    Text,
    Tooltip,
    Transition
} from "@mantine/core";
import { Editor } from "@tiptap/react";
import { Icon } from "components/Icon";
import { useCallback, useContext, useEffect, useState } from "react";
import { truncate } from "common/Utils";
import { AppContext } from "types/AppStore";
import { locales } from "common/Locales";

const useStyles = createStyles((theme) => ({
    icon: {
        color: theme.colors.gray[6],
        position: "absolute",
        top: "24px"
    },
    body: {
        padding: theme.spacing.md,
        position: "absolute",
        top: "78px",
        zIndex: 3000,
        maxWidth: "300px"
    },
    link: {
        display: "block",
        padding: "6px 3px",
        borderLeft: `${rem(1)} solid ${
            theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,
        textDecoration: "none",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
        }
    }
}));

export function TableOfContents(props: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<any>([]);

    const { classes } = useStyles();
    const appContext = useContext(AppContext);
    const texts = locales[appContext.prefs.general.locale].editor;

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
            <Tooltip withArrow label={texts.table_of_contents} position="right">
                <ActionIcon className={classes.icon} onClick={() => setOpen(!open)}>
                    <Icon icon="list-search" />
                </ActionIcon>
            </Tooltip>

            <Transition mounted={open} transition="pop-top-left" duration={200} exitDuration={200}>
                {(styles) => (
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
                )}
            </Transition>
        </>
    );
}
