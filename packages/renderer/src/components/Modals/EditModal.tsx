import { NoteItem, getItemFromID } from "common/schemas/v2/Save";
import { codexStore, modalStore, useLocale } from "src/state";
import { MutateModal } from "./_MutateModal";

export type EditModalState = {
    opened: boolean;
    item: NoteItem | null;
};

export function EditModal(props: { state: EditModalState }) {
    const { opened, item } = props.state;
    const texts = useLocale().mutateModals;
    return (
        <>
            <MutateModal
                opened={opened}
                title={texts.edit_modal_title(item != null ? item.name : "")}
                initialFormValues={
                    item != null
                        ? { name: item.name, icon: item.icon, color: item.color }
                        : { name: "", icon: "", color: "" }
                }
                submit={(name, icon, color) => {
                    if (item == null) return;

                    const realItem = getItemFromID(codexStore.save, item.id);
                    if (realItem == undefined) return;

                    realItem.name = name;
                    realItem.icon = icon;
                    realItem.color = color;
                }}
                close={() => (modalStore.editModalState.opened = false)}
            />
        </>
    );
}
