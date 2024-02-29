import { supportedLocales } from "common/Locales";
import { is_prefs_v0, convert_prefs_v0_to_v1 } from "common/schemas/v1/v0_to_v1";
import { Prefs, defaultPrefs } from "common/schemas/v2";
import { convert_prefs_v1_to_v2, is_prefs_v1 } from "common/schemas/v2/v1_to_v2";
import { app } from "electron";
import { existsSync, readFileSync, writeFileSync, lstatSync } from "fs";
import { join } from "path";
import { logError } from "../logger";

export function loadPrefs(): Prefs | null {
    const prefsPath = join(app.getPath("userData"), "/prefs.json");

    if (existsSync(prefsPath)) {
        try {
            const readPrefs = JSON.parse(readFileSync(prefsPath, "utf-8").toString());
            const prefs = convertOldPrefs(readPrefs);

            fixPrefs(prefs);

            writeFileSync(prefsPath, JSON.stringify(prefs, null, 4), "utf-8");
            return prefs;
        } catch (error) {
            logError(
                "Couldn't parse prefs.json",
                "Try deleting the file so Codex can generate a new one.\n\n" + (<Error>error).stack
            );
            return null;
        }
    } else {
        const prefs = defaultPrefs;
        prefs.general.saveFolder = app.getPath("userData");
        if (process.platform === "darwin") {
            prefs.general.titlebarStyle = "native";
        }

        writeFileSync(prefsPath, JSON.stringify(prefs, null, 4), "utf-8");
        return prefs;
    }
}

function fixPrefs(old: Prefs) {
    const prefs = structuredClone(defaultPrefs);

    Object.assign(prefs.general, old.general);
    Object.assign(prefs.editor, old.editor);
    Object.assign(prefs.misc, old.misc);

    if (prefs.general.saveFolder == "") {
        prefs.general.saveFolder = app.getPath("userData");
        logError(
            "Error",
            'Save folder location was set to "", reverting to default:\n\n' +
                app.getPath("userData")
        );
    }

    try {
        if (
            existsSync(prefs.general.saveFolder) == false ||
            lstatSync(prefs.general.saveFolder).isDirectory() == false
        ) {
            logError(
                "Error",
                `Save folder location (${prefs.general.saveFolder}) does not exist, or is not a directory. Reverting to default:\n\n` +
                    app.getPath("userData")
            );
            prefs.general.saveFolder = app.getPath("userData");
        }
    } catch (err) {
        logError(
            "Error",
            `Save folder location (${prefs.general.saveFolder}) does not exist, or is not a directory. Reverting to default:\n\n` +
                app.getPath("userData")
        );
        prefs.general.saveFolder = app.getPath("userData");
    }

    if (process.platform === "darwin") {
        prefs.general.titlebarStyle = "native";
    }

    if (!supportedLocales.includes(prefs.general.locale)) {
        prefs.general.locale = "en_US";
    }

    if (prefs.general.theme != "light" && prefs.general.theme != "dark") {
        prefs.general.theme = "light";
    }

    if (prefs.general.titlebarStyle != "custom" && prefs.general.titlebarStyle != "native") {
        prefs.general.titlebarStyle = process.platform === "darwin" ? "native" : "custom";
    }
}

function convertOldPrefs(old: any): Prefs {
    if (is_prefs_v0(old)) {
        const v1 = convert_prefs_v0_to_v1(old);
        const v2 = convert_prefs_v1_to_v2(v1);
        return v2;
    } else if (is_prefs_v1(old)) {
        const v2 = convert_prefs_v1_to_v2(old);
        return v2;
    } else if (old.schema_version == 2) {
        return old as Prefs;
    } else {
        throw new Error("Failed to convert Prefs to a known format");
    }
}
