import { Folder, Page, getItemFromID } from "common/schemas/v2";
import { codexStore, writeSave } from ".";

export function modifyItem(id: string, changes: Partial<Folder> | Partial<Page>) {
    const item = getItemFromID(codexStore.save, id);
    if (item != undefined) Object.assign(item, changes);

    writeSave();
}
