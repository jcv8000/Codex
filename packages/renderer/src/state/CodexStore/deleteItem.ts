import { getParent } from "common/schemas/v2";
import { codexStore, writeSave } from ".";

export function deleteItem(id: string) {
    const parent = getParent(codexStore.save, id);
    if (parent == undefined) {
        // Top-level
        codexStore.save.items.forEach((item, index) => {
            if (item.id == id) codexStore.save.items.splice(index, 1);
        });
    } else {
        parent.children.forEach((c, index) => {
            if (c.id == id) parent.children.splice(index, 1);
        });
    }

    writeSave();
}
