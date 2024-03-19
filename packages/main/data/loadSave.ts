import { Save, exampleSave } from "common/schemas/v2";
import { app, dialog } from "electron";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { logError } from "../logger";
import { convert_save_v0_to_v1, is_save_v0 } from "common/schemas/v1/v0_to_v1";
import { convert_save_v1_to_v2, is_save_v1 } from "common/schemas/v2/v1_to_v2";
import isDev from "electron-is-dev";

export function loadSave(saveFolderPath: string): Save | null {
    const saveFilePath = join(saveFolderPath, "save.json");

    if (existsSync(saveFilePath)) {
        try {
            const saveText = readFileSync(saveFilePath, "utf-8").toString();
            const saveObj = JSON.parse(saveText);

            const save = convertSaveIfOld(saveObj, saveFolderPath);

            if (save != null) {
                writeFileSync(saveFilePath, JSON.stringify(save, null, 4), "utf-8");
                if (isDev) console.log(`Read save from disk successfully`);
            }

            return save;
        } catch (error) {
            logError("Error: Couldn't parse save.json", "" + (<Error>error).stack);
            return null;
        }
    } else {
        writeFileSync(saveFilePath, JSON.stringify(exampleSave, null, 4), "utf-8");
        if (isDev) console.log(`No save file found, creating empty save`);
        return structuredClone(exampleSave);
    }
}

function convertSaveIfOld(save: any, saveFolderPath: string): Save | null {
    if (is_save_v0(save)) {
        if (askToConvert(saveFolderPath) == "yes") {
            const v1 = convert_save_v0_to_v1(save, saveFolderPath);
            const v2 = convert_save_v1_to_v2(v1, saveFolderPath);

            if (isDev) console.log(`Converted save from schema v0 to v2`);
            return v2 as unknown as Save;
        } else return null;
    } else if (is_save_v1(save)) {
        if (askToConvert(saveFolderPath) == "yes") {
            const v2 = convert_save_v1_to_v2(save, saveFolderPath);

            if (isDev) console.log(`Converted save from schema v1 to v2`);
            return v2 as unknown as Save;
        } else return null;
    } else if (save.schema_version == 2) {
        return save as Save;
    } else {
        throw new Error("Failed to convert Save to a known format");
    }
}

function askToConvert(saveFilePath: string): "yes" | "no" {
    const result_1 = dialog.showMessageBoxSync({
        title: "Codex",
        message: "Please backup your save.json and notes folder.",
        detail:
            "Codex 3.0 has to convert your save.json to a new format, " +
            "and convert all individual pages to a new format.\n\n" +
            "Please back up your 'save.json' and 'notes' folder before converting\n\n" +
            `Your save.json location:\n${saveFilePath}\n\n` +
            "Don't forget to copy the 'notes' folder too.",
        type: "warning",
        buttons: ["Continue", "Exit"]
    });

    if (result_1 == 1) app.exit();

    const result_2 = dialog.showMessageBoxSync({
        title: "Codex",
        message:
            "Final warning to backup your save.json and notes folder in case anything goes wrong.",
        type: "warning",
        buttons: ["Yes, I have backed up my save.json and notes folder", "Exit"]
    });

    if (result_2 == 1) app.exit();

    return result_2 == 0 ? "yes" : "no";
}
