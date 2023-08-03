import { Button, Group, Modal, Text, TextInput, Title } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "types/AppStore";
import { IconSelector } from "./IconSelector";
import { NoteItem } from "common/Save";
import { locales } from "common/Locales";

export type EditModalState = {
    opened: boolean;
    item: NoteItem;
};

export function EditModal(props: { state: EditModalState; onClose: () => void }) {
    const { opened, item } = props.state;

    const appContext = useContext(AppContext);
    const texts = locales[appContext.prefs.general.locale].mutateModals;

    useEffect(() => {
        setName(item.name);
        setIcon(item.icon);
        setColor(item.color);
    }, [item]);

    const [name, setName] = useState(item.name);
    const [icon, setIcon] = useState(item.icon);
    const [color, setColor] = useState(item.color);

    const submit = () => {
        if (name != "") {
            appContext.modifySave(() => {
                item.name = name;
                item.icon = icon;
                item.color = color;
            });
            props.onClose();
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={props.onClose}
            title={<Title order={3}>{texts.edit_modal_title(item.name)}</Title>}
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
                    {texts.save}
                </Button>
            </Group>
        </Modal>
    );
}
