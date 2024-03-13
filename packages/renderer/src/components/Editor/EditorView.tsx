import { Page } from "common/schemas/v2";
import { Editor } from "@tiptap/react";
import { Container, Paper } from "@mantine/core";
import { useSnapshot } from "valtio";
import { codexStore } from "src/state";

type Props = {
    page: Page;
    setEditorRef: (e: Editor | null) => void;
};

export function EditorView() {
    const { prefs } = useSnapshot(codexStore);
    return (
        <>
            <Container size={prefs.editor.width} py="xl">
                <Paper
                    withBorder={prefs.editor.border}
                    shadow={prefs.editor.border ? "sm" : undefined}
                    px="xl"
                    py="md"
                ></Paper>
            </Container>
        </>
    );
}
