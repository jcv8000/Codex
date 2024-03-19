import { Prefs as Prefs_v1, Save as Save_v1 } from "common/schemas/v1";
import {
    Prefs as Prefs_v2,
    defaultPrefs as defaultPrefs_v2,
    Save as Save_v2
} from "common/schemas/v2";
import { v4 as uuid } from "@lukeed/uuid";
import { statSync } from "fs";
import { join } from "path";

// Prefs v2 has "schema_version"
export function is_prefs_v1(prefs: any): prefs is Prefs_v1 {
    return prefs["schema_version"] == undefined;
}

export function is_save_v1(save: any): save is Save_v1 {
    return save.schema_version != undefined && save.schema_version == 1;
}

export function convert_save_v1_to_v2(old: Save_v1, saveFolderPath: string): Save_v2 {
    const save = JSON.parse(JSON.stringify(old));

    save.tags = [{ id: uuid(), name: "Example Tag", color: "#FF0000" }];
    save.schema_version = 2;

    // Add "Last Modified" and "tags" property to all pages
    const pages: any[] = [];

    const recurse = (i: any) => {
        if (i.children) {
            i.children.forEach((c: any) => {
                recurse(c);
            });
        } else {
            pages.push(i);
        }
    };

    save.items.forEach((i: any) => {
        recurse(i);
    });

    pages.forEach((p) => {
        p.tags = [];
        try {
            const stats = statSync(join(saveFolderPath, "/notes/", p.fileName));
            p.lastModified = new Date(stats.mtime).getTime();
        } catch (e) {
            p.lastModified = Date.now();
        }
    });

    return save as Save_v2;
}

export function convert_prefs_v1_to_v2(old: Prefs_v1): Prefs_v2 {
    const prefs = structuredClone(defaultPrefs_v2);

    Object.assign(prefs.general, old.general);
    Object.assign(prefs.editor, old.editor);
    Object.assign(prefs.misc, old.misc);

    prefs.schema_version = 2;

    return prefs;
}
