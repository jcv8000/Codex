import { getItemFromID, isFolder } from "common/schemas/v2";
import { codexStore } from ".";

// Open/close folder without writing to disk every time, it'll get
// saved on close & doesn't really matter that much
export function toggleOpened(id: string) {
    const item = getItemFromID(codexStore.save, id);
    if (item != undefined && isFolder(item)) item.opened = !item.opened;
}
