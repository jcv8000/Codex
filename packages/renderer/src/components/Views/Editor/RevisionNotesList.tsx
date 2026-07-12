import {
    ActionIcon,
    createStyles,
    Paper,
    rem,
    ScrollArea,
    Space,
    Text,
    Tooltip,
    Transition
} from "@mantine/core";
import { Editor } from "@tiptap/react";
import { Icon } from "components/Icon";
import { useCallback, useContext, useEffect, useState, memo } from "react";
import { truncate } from "common/Utils";
import { AppContext } from "types/AppStore";
import { locales } from "common/Locales";

const useStyles = createStyles((theme) => ({
    icon: {
        color: theme.colors.gray[6],
        position: "absolute",
        top: "64px" // Positioned below TOC
    },
    body: {
        padding: theme.spacing.md,
        position: "absolute",
        top: "118px", // Positioned below TOC body
        zIndex: 3000,
        width: "250px",
        height: "300px",
        maxWidth: "600px",
        minWidth: "150px",
        minHeight: "150px",
        resize: "both",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
    },
    item: {
        display: "block",
        padding: "8px",
        marginBottom: "8px",
        border: `${rem(1)} solid ${
            theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,
        borderRadius: theme.radius.sm,
        cursor: "pointer",
        textDecoration: "none",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
        }
    },
    emptyState: {
        color: theme.colors.gray[5],
        textAlign: "center",
        marginTop: theme.spacing.xl
    }
}));

type NoteItem = {
    id: string;
    text: string;
    pos: number;
};

function RevisionNotesListComponent(props: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<NoteItem[]>([]);

    const { classes } = useStyles();
    const appContext = useContext(AppContext);
    const texts = locales[appContext.prefs.general.locale].editor;
    const revisionNoteStyle = appContext.prefs.editor.revisionNoteStyle;

    const handleUpdate = useCallback(() => {
        setTimeout(() => {
            const notes: NoteItem[] = [];
            
            props.editor.state.doc.descendants((node, pos) => {
                const mark = node.marks.find(m => m.type.name === "revisionNote");
                if (mark) {
                    const id = mark.attrs.id;
                    // If we already have a note with this id, we can skip or append text
                    if (!notes.find(n => n.id === id)) {
                        notes.push({
                            id,
                            text: truncate(node.textContent, 50),
                            pos
                        });
                    }
                }
            });

            setItems(notes);
        }, 1);
    }, [props.editor]);

    useEffect(handleUpdate, [props.editor.state.doc, handleUpdate]);

    useEffect(() => {
        props.editor.on("update", handleUpdate);
        return () => {
            props.editor.off("update", handleUpdate);
        };
    }, [props.editor, handleUpdate]);

    useEffect(() => {
        const handleClose = () => setOpen(false);
        window.addEventListener("close-notes-list", handleClose);
        return () => window.removeEventListener("close-notes-list", handleClose);
    }, []);

    const toggleOpen = () => {
        if (!open) window.dispatchEvent(new Event("close-toc"));
        setOpen(!open);
    };

    const scrollToNote = (pos: number) => {
        props.editor.commands.focus();
        props.editor.commands.setTextSelection(pos);
        
        // Scroll into view manually
        const domNode = props.editor.view.domAtPos(pos).node;
        if (domNode instanceof Element) {
            domNode.scrollIntoView({ behavior: "smooth", block: "center" });
        } else if (domNode.parentElement) {
            domNode.parentElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return (
        <>
            <style>{`
                .revision-note {
                    ${Object.entries(revisionNoteStyle).map(([key, value]) => `${key}: ${value};`).join('\n')}
                }
            `}</style>

            <Tooltip withArrow label={texts.revision_notes} position="right">
                <ActionIcon className={classes.icon} onClick={toggleOpen}>
                    <Icon icon="notes" />
                </ActionIcon>
            </Tooltip>

            <Transition mounted={open} transition="pop-top-left" duration={200} exitDuration={200}>
                {(styles) => (
                    <Paper className={classes.body} withBorder style={styles}>
                        <Text fz="xs" fw="bold">{texts.revision_notes}</Text>
                        <Space h="sm" />

                        <ScrollArea style={{ flexGrow: 1, paddingRight: "10px" }} type="auto" offsetScrollbars>
                            {items.length === 0 ? (
                                <Text size="sm" className={classes.emptyState}>
                                    {texts.no_revision_notes}
                                </Text>
                            ) : (
                                items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={classes.item}
                                        onClick={() => scrollToNote(item.pos)}
                                    >
                                        <Text size="sm" truncate="end">
                                            {item.text}
                                        </Text>
                                    </div>
                                ))
                            )}
                        </ScrollArea>
                    </Paper>
                )}
            </Transition>
        </>
    );
}

export const RevisionNotesList = memo(RevisionNotesListComponent);
