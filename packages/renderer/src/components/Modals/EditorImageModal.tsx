import { Alert, Button, Group, Modal, Space, Text, Title } from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Icon } from "components/Icon";
import { useContext, useState } from "react";
import { Editor } from "@tiptap/core";
import { AppContext } from "types/AppStore";
import { locales } from "common/Locales";

export type EditorImageModalState = {
    opened: boolean;
    editor: Editor | null;
};

export function EditorImageModal(props: { state: EditorImageModalState; onClose: () => void }) {
    const { opened, editor } = props.state;
    const [image, setImage] = useState<FileWithPath>();

    const { prefs } = useContext(AppContext);
    const texts = locales[prefs.general.locale].editor.imageModal;

    const onClose = () => {
        props.onClose();
        setImage(undefined);
    };

    if (editor == null) {
        return <></>;
    } else {
        return (
            <Modal
                size="lg"
                opened={opened}
                onClose={onClose}
                title={
                    <Title order={3}>
                        {editor.isActive("image") ? texts.replace_image : texts.add_image}
                    </Title>
                }
            >
                <Dropzone
                    onDrop={(files) => {
                        setImage(files[0]);
                    }}
                    onReject={(files) => console.log("rejected files", files)}
                    maxSize={3 * 1024 ** 2} // TODO necessary??
                    maxFiles={1}
                    accept={IMAGE_MIME_TYPE}
                >
                    <Group
                        position="left"
                        pl="lg"
                        spacing="xl"
                        style={{ minHeight: 120, pointerEvents: "none" }}
                    >
                        <Dropzone.Accept>
                            <Icon size={50} icon="upload" />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <Icon size={50} icon="x" />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <Icon size={50} icon="photo" />
                        </Dropzone.Idle>

                        {image != undefined ? (
                            <Text
                                size="xl"
                                maw={400}
                                style={{
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden"
                                }}
                            >
                                {image.name}
                            </Text>
                        ) : (
                            <div>
                                <Text size="xl" inline>
                                    {texts.dropzone_title}
                                </Text>
                                <Text size="sm" color="dimmed" inline mt={7}>
                                    {texts.dropzone_desc}
                                </Text>
                            </div>
                        )}
                    </Group>
                </Dropzone>

                <Space h="xl" />

                <Alert title={texts.tip_title} icon={<Icon icon="info-circle" />}>
                    {texts.tip_text}
                </Alert>

                <Group position="right" mt="md">
                    <Button variant="default" onClick={onClose}>
                        {texts.cancel}
                    </Button>
                    <Button
                        disabled={image == undefined}
                        onClick={() => {
                            if (image != undefined) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    if (reader.result != null) {
                                        const b64 = reader.result.toString();
                                        onClose();

                                        // TODO remove the 100ms delay
                                        setTimeout(() => {
                                            editor
                                                .chain()
                                                .focus()
                                                .setImage({ src: b64 })
                                                .exitCode()
                                                .run();
                                        }, 100);
                                    }
                                };
                                reader.onerror = () => {
                                    alert("Error loading file");
                                };

                                reader.readAsDataURL(image);
                            }
                        }}
                    >
                        {editor.isActive("image") ? texts.replace_image : texts.add_image}
                    </Button>
                </Group>
            </Modal>
        );
    }
}
