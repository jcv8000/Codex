import { getItemFromID, getParent, isFolder } from "common/schemas/v2";
import { codexStore } from ".";

export function dragDropItem(
    draggedId: string,
    targetId: string,
    where: "above" | "below" | "child"
) {
    const dragged = getItemFromID(codexStore.save, draggedId);
    const target = getItemFromID(codexStore.save, targetId);

    if (dragged == undefined || target == undefined) return;

    const isDraggedTopLevel = codexStore.save.items.includes(dragged);
    const isTargetTopLevel = codexStore.save.items.includes(target);

    // Remove dragged item from parent's children[]
    if (isDraggedTopLevel) {
        codexStore.save.items.splice(codexStore.save.items.indexOf(dragged), 1);
    } else {
        const draggedParent = getParent(codexStore.save, draggedId);
        if (draggedParent == undefined) return;
        draggedParent.children.splice(draggedParent.children.indexOf(dragged), 1);
    }

    // Insert dragged item into target's children[], or the Save's items[]
    if (isTargetTopLevel) {
        if (where == "above") {
            codexStore.save.items.splice(codexStore.save.items.indexOf(target), 0, dragged);
        } else if (where == "below") {
            codexStore.save.items.splice(codexStore.save.items.indexOf(target) + 1, 0, dragged);
        } else if (where == "child" && isFolder(target)) {
            target.children.push(dragged);
        }
    } else {
        const targetParent = getParent(codexStore.save, targetId);
        if (targetParent == undefined) return;

        if (where == "above") {
            targetParent.children.splice(targetParent.children.indexOf(target), 0, dragged);
        } else if (where == "below") {
            targetParent.children.splice(targetParent.children.indexOf(target) + 1, 0, dragged);
        } else if (where == "child" && isFolder(target)) {
            target.children.push(dragged);
            target.opened = true;
        }
    }
}
