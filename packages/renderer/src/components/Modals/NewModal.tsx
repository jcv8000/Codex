import { Button, Group, Modal, Text, TextInput, Title } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "types/AppStore";
import { Folder, Page } from "common/Save";
import { IconSelector } from "./IconSelector";
import { locales } from "common/Locales";

export type NewModalState = {
    opened: boolean;
    parent: Folder | null;
    type: "page" | "folder";
};

export function NewModal(props: { state: NewModalState; onClose: () => void }) {
    const { opened, parent, type } = props.state;

    const appContext = useContext(AppContext);
    const texts = locales[appContext.prefs.general.locale].mutateModals;

    const [name, setName] = useState("");
    const [icon, setIcon] = useState(type == "folder" ? "book-2" : "file-text");
    const [color, setColor] = useState(type == "folder" ? "#000000" : "#999999");

    useEffect(() => {
        setName("");
        setIcon(props.state.type == "folder" ? "book-2" : "file-text");
        setColor(props.state.type == "folder" ? "#000000" : "#999999");
    }, [props.state]);

    const submit = () => {
        if (name != "") {
            appContext.modifySave((s) => {
                if (type == "folder") {
                    const folder = new Folder(name, parent);

                    folder.icon = icon;
                    folder.color = color;

                    if (parent == null) s.items.push(folder);
                } else if (type == "page") {
                    const page = new Page(name, parent);

                    page.icon = icon;
                    page.color = color;
                }
            });
            props.onClose();
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={props.onClose}
            title={
                <Title order={3}>
                    {type == "folder"
                        ? texts.new_folder_modal_title(parent != null ? parent.name : undefined)
                        : texts.new_page_modal_title(parent != undefined ? parent.name : "")}
                </Title>
            }
        >
            <Text size={14} mb={4}>
                {texts.item_icon}
            </Text>

            <IconSelector
                icon={icon}
                onChangeIcon={setIcon}
                color={color}
                onChangeColor={setColor}
            />

            <TextInput
                data-autofocus
                label={texts.item_name}
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                error={name.length < 1 ? texts.enter_a_name : null}
                onKeyUp={(e) => {
                    if (e.key == "Enter") submit();
                }}
            />

            <Group position="right" mt="md">
                <Button variant="default" onClick={props.onClose}>
                    {texts.cancel}
                </Button>
                <Button onClick={submit} disabled={name.length < 1}>
                    {texts.create}
                </Button>
            </Group>
        </Modal>
    );
}
