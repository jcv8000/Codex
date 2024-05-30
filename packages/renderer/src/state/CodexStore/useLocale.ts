import { useSnapshot } from "valtio";
import { codexStore } from ".";
import { locales } from "common/locales";

export function useLocale() {
    const { prefs } = useSnapshot(codexStore);
    return locales[prefs.general.locale];
}
