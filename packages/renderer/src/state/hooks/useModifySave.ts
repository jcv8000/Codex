import { Save } from "common/Save";

export function useModifySave(save: Save, forceUpdate: () => void) {
    return (callback: (s: Save) => void) => {
        callback(save);
        forceUpdate();
    };
}
