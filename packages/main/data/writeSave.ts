import { Save } from "common/schemas/v2";
import { writeFileSync } from "fs";
import { join } from "path";
import { logError } from "../logger";

export function writeSave(saveFolderPath: string, save: Save) {
    const saveFilePath = join(saveFolderPath, "save.json");

    try {
        writeFileSync(saveFilePath, JSON.stringify(save, null, 4), "utf-8");
    } catch (error) {
        logError("Error: Couldn't write save.json to the disk", "" + (<Error>error).stack);
    }
}
