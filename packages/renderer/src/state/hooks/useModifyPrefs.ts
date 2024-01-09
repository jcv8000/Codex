import { Prefs } from "common/Prefs";

export function useModifyPrefs(prefs: Prefs, forceUpdate: () => void) {
    return (callback: (p: Prefs) => void) => {
        callback(prefs);
        forceUpdate();
    };
}
