import { ActionIcon, Flex, Paper, Text, TextInput } from "@mantine/core";
import { Editor } from "@tiptap/react";
import { Icon } from "components/Icon";
import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "types/AppStore";
import { locales } from "common/Locales";

type Props = {
    editor: Editor;
    onClose: () => void;
};

export function TextFinder({ editor, onClose }: Props) {
    const appContext = useContext(AppContext);
    const texts = locales[appContext.prefs.general.locale].editor.textFinder;

    const [query, setQuery] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    const matches = useMemo(() => {
        if (!query) return [];
        const found: { from: number; to: number }[] = [];
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escapedQuery, "gi");

        editor.state.doc.descendants((node, pos) => {
            if (node.isText && node.text) {
                let match;
                regex.lastIndex = 0;
                while ((match = regex.exec(node.text)) !== null) {
                    found.push({
                        from: pos + match.index,
                        to: pos + match.index + match[0].length
                    });
                }
            }
        });

        return found;
    }, [query, editor.state.doc.content]);

    useEffect(() => {
        if (matches.length > 0) {
            const index = Math.min(currentIndex, matches.length - 1);
            
            if (editor.commands.setSearchTerm) {
                editor.commands.setSearchTerm(query, index);
            }

            // Scroll to the current match via standard DOM to avoid stealing focus
            setTimeout(() => {
                const el = document.querySelector(".search-match-current");
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 50);

            if (index !== currentIndex) {
                setCurrentIndex(index);
            }
        } else {
            if (editor.commands.setSearchTerm) {
                editor.commands.setSearchTerm("", 0);
            }
        }
    }, [matches, currentIndex, editor, query]);

    const handleClose = () => {
        if (editor.commands.setSearchTerm) {
            editor.commands.setSearchTerm("", 0);
        }
        onClose();
    };

    return (
        <Paper
            withBorder
            shadow="sm"
            p="xs"
            style={{
                position: "absolute",
                top: 16,
                right: 32,
                zIndex: 9999,
                width: 350
            }}
        >
            <Flex gap="xs" align="center">
                <TextInput
                    id="textfinder-input"
                    autoFocus
                    placeholder={texts.find}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.currentTarget.value);
                        setCurrentIndex(0);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            if (e.shiftKey) {
                                setCurrentIndex((c) => (c > 0 ? c - 1 : matches.length - 1));
                            } else {
                                setCurrentIndex((c) => (c < matches.length - 1 ? c + 1 : 0));
                            }
                        } else if (e.key === "Escape") {
                            handleClose();
                            editor.commands.focus();
                        }
                    }}
                    style={{ flexGrow: 1 }}
                />
                <Text size="sm" color="dimmed" miw={36} align="center">
                    {matches.length > 0 ? `${currentIndex + 1}/${matches.length}` : "0/0"}
                </Text>
                <ActionIcon
                    disabled={matches.length === 0}
                    onClick={() => setCurrentIndex((c) => (c > 0 ? c - 1 : matches.length - 1))}
                    title={texts.previous}
                >
                    <Icon icon="chevron-up" />
                </ActionIcon>
                <ActionIcon
                    disabled={matches.length === 0}
                    onClick={() => setCurrentIndex((c) => (c < matches.length - 1 ? c + 1 : 0))}
                    title={texts.next}
                >
                    <Icon icon="chevron-down" />
                </ActionIcon>
                <ActionIcon onClick={handleClose} color="red">
                    <Icon icon="x" />
                </ActionIcon>
            </Flex>
        </Paper>
    );
}
