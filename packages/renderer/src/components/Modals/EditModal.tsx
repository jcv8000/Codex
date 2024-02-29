import { NoteItem } from "common/schemas/v2/Save";

export type EditModalState = {
    opened: boolean;
    item: NoteItem | null;
};

export function EditModal(props: { state: EditModalState }) {
    return <></>;
}
