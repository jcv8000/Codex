import { Folder } from "common/Save";

export type NewModalState = {
    opened: boolean;
    parent: Folder | null;
    type: "page" | "folder";
};

export const defaultNewModalState: NewModalState = { opened: false, parent: null, type: "folder" };

export function NewModal(props: { state: NewModalState; onClose: () => void }) {
    return <></>;
}
