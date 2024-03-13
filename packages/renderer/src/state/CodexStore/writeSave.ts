import { Save } from "common/schemas/v2";
import { codexStore, deproxy } from ".";

export async function writeSave() {
    const deproxied = deproxy<Save>(codexStore.save);
    const saved = await window.ipc.invoke("write-save", deproxied);
    // TODO show error notification if save isnt saved
}
