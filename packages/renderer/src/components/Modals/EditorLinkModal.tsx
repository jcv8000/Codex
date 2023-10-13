import { Button, Group, Modal, TextInput, Title } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { Editor } from "@tiptap/core";
import { AppContext } from "types/AppStore";
import { locales } from "common/Locales";

export type EditorLinkModalState = {
    opened: boolean;
    editor: Editor | null;
    initialUrl: string;
};

export function EditorLinkModal(props: { state: EditorLinkModalState; onClose: () => void }) {
    const { opened, editor, initialUrl } = props.state;

    const [url, setUrl] = useState(initialUrl);

    const { prefs } = useContext(AppContext);
    const texts = locales[prefs.general.locale].editor.linkModal;

    useEffect(() => {
        setUrl(props.state.initialUrl);
    }, [props.state]);

    const onClose = () => {
        props.onClose();
        setUrl("");
    };

    if (editor == null) {
        return <></>;
    } else {
        return (
            <Modal
                size="lg"
                opened={opened}
                onClose={onClose}
                title={<Title order={3}>{texts.create_link}</Title>}
            >
                <TextInput
                    label="URL"
                    placeholder="https://www.example.com/"
                    value={url}
                    onChange={(e) => setUrl(e.currentTarget.value)}
                />

                <Group position="right" mt="md">
                    <Button variant="default" onClick={onClose}>
                        {texts.cancel}
                    </Button>
                    <Button
                        disabled={url == ""}
                        onClick={() => {
                            editor.chain().focus().setLink({ href: url }).run();
                            onClose();
                        }}
                    >
                        {texts.create_link}
                    </Button>
                </Group>
            </Modal>
        );
    }
}
