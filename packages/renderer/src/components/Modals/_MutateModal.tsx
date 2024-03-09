import { Modal, TextInput, Group, Button } from "@mantine/core";
import { IconSelector } from "components/IconSelector";
import { useEffect, useState } from "react";
import { useLocale } from "src/state";

export type FormValues = { name: string; icon: string; color: string };

export function MutateModal(props: {
    opened: boolean;
    title: string;
    initialFormValues: FormValues;
    submit: (name: string, icon: string, color: string) => void;
    close: () => void;
}) {
    const texts = useLocale().mutateModals;

    const [name, setName] = useState(props.initialFormValues.name);
    const [nameError, setNameError] = useState("");

    const [icon, setIcon] = useState(props.initialFormValues.icon);
    const [color, setColor] = useState(props.initialFormValues.color);

    useEffect(() => {
        setName(props.initialFormValues.name);
        setNameError("");

        setIcon(props.initialFormValues.icon);
        setColor(props.initialFormValues.color);
    }, [props.initialFormValues]);

    return (
        <Modal opened={props.opened} onClose={props.close} title={props.title}>
            <form
                onSubmit={() => {
                    if (name.length < 1) setNameError(texts.enter_a_name);
                    else {
                        props.submit(name, icon, color);
                        props.close();
                    }
                }}
            >
                <IconSelector
                    label={texts.item_icon}
                    icon={icon}
                    onChangeIcon={(value) => setIcon(value)}
                    color={color}
                    onChangeColor={(value) => setColor(value)}
                />

                <TextInput
                    data-autofocus
                    label={texts.item_name}
                    value={name}
                    onChange={(e) => {
                        setName(e.currentTarget.value);
                        setNameError("");
                    }}
                    error={nameError}
                />

                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={props.close}>
                        {texts.cancel}
                    </Button>
                    <Button type="submit">{texts.create}</Button>
                </Group>
            </form>
        </Modal>
    );
}
