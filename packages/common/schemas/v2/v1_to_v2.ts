import { Prefs as Prefs_v1 } from "common/schemas/v1/Prefs";
import { Prefs as Prefs_v2, defaultPrefs as defaultPrefs_v2 } from "common/schemas/v2/Prefs";

// Prefs v2 has "schema_version"
export function is_prefs_v1(prefs: any) {
    return prefs["schema_version"] == undefined;
}

// Save v1 and v2 are exactly the same
export function is_save_v1(save: any): boolean {
    return save.schema_version != undefined && save.schema_version == 1;
}

export function convert_prefs_v1_to_v2(old: Prefs_v1): Prefs_v2 {
    const prefs = structuredClone(defaultPrefs_v2);

    Object.assign(prefs.general, old.general);
    Object.assign(prefs.editor, old.editor);
    Object.assign(prefs.misc, old.misc);

    prefs.schema_version = 2;

    return prefs;
}
