import { Modal, TextInput, Group, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Folder, Page } from "common/schemas/v2/Save";
import { IconSelector } from "components/IconSelector";
import { useEffect } from "react";
import { codexStore, modalStore, modifyItem, useLocale } from "src/state";
import { v4 as uuid } from "@lukeed/uuid";
import { pageNameToFileName } from "common/Utils";

export type NewModalState = {
    opened: boolean;
    parent: Folder | null;
    type: "page" | "folder";
};

type FormValues = { name: string; icon: string; color: string };

function initialFormValues(type: "page" | "folder"): FormValues {
    return {
        name: "",
        icon: type == "folder" ? "book-2" : "file-text",
        color: type == "folder" ? "#000000" : "#999999"
    };
}

export function NewModal(props: { state: NewModalState }) {
    const { opened, parent, type } = props.state;
    const texts = useLocale().mutateModals;

    const form = useForm<FormValues>({
        initialValues: initialFormValues(props.state.type),
        validate: {
            name: (value) => (value.length > 0 ? null : texts.enter_a_name)
        }
    });

    const close = () => {
        modalStore.newModalState.opened = false;
        //setTimeout(() => form.reset(), 200);
    };

    useEffect(() => {
        form.setInitialValues(initialFormValues(props.state.type));
        form.reset();
    }, [props.state.opened, props.state.type]);

    const submit = (name: string, icon: string, color: string) => {
        const id = uuid();

        const obj =
            type == "folder"
                ? ({
                      name: name,
                      id: uuid(),
                      icon: icon,
                      color: color,
                      opened: false,
                      children: []
                  } as Folder)
                : ({
                      name: name,
                      id: uuid(),
                      icon: icon,
                      color: color,
                      favorited: false,
                      fileName: "",
                      textContent: pageNameToFileName(name + "_" + id + ".json")
                  } as Page);

        if (parent == null) {
            codexStore.save.items.push(obj);
        } else {
            modifyItem(parent.id, { children: [...parent.children, obj] });
        }

        close();
    };

    return (
        <Modal
            opened={opened}
            onClose={close}
            title={
                type == "folder"
                    ? texts.new_folder_modal_title(parent != null ? parent.name : undefined)
                    : texts.new_page_modal_title(parent != null ? parent.name : "")
            }
        >
            <form onSubmit={form.onSubmit(({ name, icon, color }) => submit(name, icon, color))}>
                <IconSelector
                    label={texts.item_icon}
                    icon={form.values.icon}
                    onChangeIcon={(value) => form.setValues({ icon: value })}
                    color={form.values.color}
                    onChangeColor={(value) => form.setValues({ color: value })}
                />

                <TextInput data-autofocus label={texts.item_name} {...form.getInputProps("name")} />

                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={close}>
                        {texts.cancel}
                    </Button>
                    <Button type="submit">{texts.create}</Button>
                </Group>
            </form>
        </Modal>
    );
}
