import { Prefs } from "common/schemas/v2";
import { app } from "electron";
import { writeFileSync } from "fs";
import { join } from "path";
import { logError } from "../logger";
import isDev from "electron-is-dev";

export function writePrefs(prefs: Prefs) {
    const prefsPath = join(app.getPath("userData"), "/prefs.json");

    try {
        writeFileSync(prefsPath, JSON.stringify(prefs, null, 4), "utf-8");

        if (isDev) console.log(`Wrote prefs successfully`);
    } catch (error) {
        logError("Error: Couldn't write prefs.json to the disk", "" + (<Error>error).stack);
    }
}
