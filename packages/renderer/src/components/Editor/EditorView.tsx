import { EditorContent, useEditor } from "@tiptap/react";
import { ActionIcon, Container, Paper, Tooltip } from "@mantine/core";
import { useSnapshot } from "valtio";
import { codexStore, useLocale } from "src/state";
import { TableOfContents } from "components/TableOfContents";
import { MainFloat } from "components/Floats";
import { Icon } from "components/Icon";
import { useMemo, useState } from "react";
import { Toolbar } from "components/EditorToolbar";
import { editorExtensions } from ".";

type Props = {
    initialContentString: string;
};

export function EditorView({ initialContentString }: Props) {
    const { prefs } = useSnapshot(codexStore);
    const [showToolbar, setShowToolbar] = useState(true);
    const texts = useLocale().editor;

    const extensions = useMemo(() => {
        console.log("generated editor extensions");
        return editorExtensions({
            useTypography: codexStore.prefs.editor.useTypographyExtension,
            tabSize: codexStore.prefs.editor.tabSize
        });
    }, []);

    const editor = useEditor({
        autofocus: true,
        content: JSON.parse(initialContentString),
        extensions: extensions
    });
    if (editor == null) return;

    return (
        <>
            <TableOfContents editor={editor} />

            {showToolbar && <Toolbar />}

            <Container size={prefs.editor.width}>
                <Paper
                    withBorder={prefs.editor.border}
                    shadow={prefs.editor.border ? "sm" : undefined}
                    mb="xl"
                    mt={
                        showToolbar
                            ? "calc(var(--mantine-spacing-xl) * 2)"
                            : "var(--mantine-spacing-xl)"
                    }
                    px="xl"
                    py="md"
                >
                    <EditorContent
                        id="tiptap-editor"
                        editor={editor}
                        spellCheck={prefs.editor.spellcheck}
                    />
                </Paper>
            </Container>

            <MainFloat pos={{ top: 16, right: 16 }}>
                <Tooltip withArrow label={texts.toggle_toolbar} position="left">
                    <ActionIcon
                        variant="transparent"
                        color="gray"
                        onClick={() => setShowToolbar((v) => !v)}
                    >
                        <Icon icon="tools" />
                    </ActionIcon>
                </Tooltip>
            </MainFloat>
        </>
    );
}
