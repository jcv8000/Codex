import { useSnapshot } from "valtio";
import { codexStore } from ".";
import { locales } from "common/Locales";

export function useLocale() {
    const { prefs } = useSnapshot(codexStore);
    return locales[prefs.general.locale];
}
