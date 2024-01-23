import { NoteItem } from "common/Save";

export type EditModalState = {
    opened: boolean;
    item: NoteItem | null;
};

export const defaultEditModalState: EditModalState = { opened: false, item: null };

export function EditModal(props: { state: EditModalState; onClose: () => void }) {
    return <></>;
}
