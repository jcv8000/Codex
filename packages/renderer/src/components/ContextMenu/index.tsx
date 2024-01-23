import { NoteItem } from "common/Save";

export type ContextMenuState = {
    opened: boolean;
    item: NoteItem | null;
    x: number;
    y: number;
};

export const defaultContextMenuState: ContextMenuState = { opened: false, item: null, x: 0, y: 0 };

export function ContextMenu(props: { state: ContextMenuState; onClose: () => void }) {
    return <></>;
}
