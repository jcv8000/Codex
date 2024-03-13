import { Prefs } from "common/schemas/v2";
import { codexStore, deproxy } from ".";

export async function writePrefs() {
    const deproxied = deproxy<Prefs>(codexStore.prefs);
    const saved = await window.ipc.invoke("write-prefs", deproxied);
    // TODO show error notification if save isnt saved
}
