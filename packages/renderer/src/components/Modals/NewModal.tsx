import { Folder, NoteItem, Page } from "common/schemas/v2/Save";
import { codexStore, modalStore, modifyItem, useLocale } from "src/state";
import { v4 as uuid } from "@lukeed/uuid";
import { pageNameToFileName } from "common/Utils";
import { MutateModal, FormValues } from "./_MutateModal";

export type NewModalState = {
    opened: boolean;
    parent: Folder | null;
    type: "page" | "folder";
};

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
    return (
        <>
            <MutateModal
                opened={opened}
                title={
                    type == "folder"
                        ? texts.new_folder_modal_title(parent != null ? parent.name : undefined)
                        : texts.new_page_modal_title(parent != null ? parent.name : "")
                }
                initialFormValues={initialFormValues(type)}
                submit={(name, icon, color) => {
                    const id = uuid();

                    const push = (item: NoteItem) => {
                        if (parent == null) {
                            codexStore.save.items.push(item);
                        } else {
                            modifyItem(parent.id, { children: [...parent.children, item] });
                        }
                    };

                    if (type == "folder") {
                        const folder: Folder = {
                            name: name,
                            id: uuid(),
                            icon: icon,
                            color: color,
                            opened: true,
                            children: []
                        };
                        push(folder);
                    } else if (type == "page") {
                        const page: Page = {
                            name: name,
                            id: uuid(),
                            icon: icon,
                            color: color,
                            favorited: false,
                            textContent: "",
                            fileName: pageNameToFileName(name + "_" + id + ".json")
                        };
                        push(page);
                    }
                }}
                close={() => (modalStore.newModalState.opened = false)}
            />
        </>
    );
}
