import { Page, Prefs, Save } from "common/schemas/v2";
import { proxy } from "valtio";

declare module "valtio" {
    function useSnapshot<T extends object>(p: T): T;
}

export type View =
    | { value: "home" }
    | { value: "settings" }
    | { value: "editor"; page: Page; initialContentString: string };

type CodexStore = {
    view: View;
    prefs: Prefs;
    save: Save;
};

const initialPrefs = await window.ipc.invoke("get-prefs");
const initialSave = await window.ipc.invoke("get-save");

export const codexStore = proxy<CodexStore>({
    view: { value: "home" },
    prefs: initialPrefs,
    save: initialSave
});

export function deproxy<T>(proxy: any) {
    return JSON.parse(JSON.stringify(proxy)) as T;
}

export * from "./modifyItem";
export * from "./toggleOpened";
export * from "./deleteItem";
export * from "./dragDropItem";
export * from "./useLocale";
export * from "./writePrefs";
export * from "./writeSave";
export * from "./setView";
