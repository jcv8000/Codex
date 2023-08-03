import { app, dialog } from "electron";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { Prefs } from "common/Prefs";
import { exampleSave, Save } from "common/Save";
import { logError } from "./logger";
import { convertOldPrefs, convertOldSave } from "./convertOld";

export function loadPrefs(): Prefs | null {
    const prefsPath = path.join(app.getPath("userData"), "/prefs.json");

    if (existsSync(prefsPath)) {
        try {
            const readPrefs = JSON.parse(readFileSync(prefsPath, "utf-8").toString());

            if (readPrefs["dataDir"] !== undefined) {
                // 1.X Save
                const prefs = convertOldPrefs(readPrefs);
                writePrefs(prefs);

                return prefs;
            } else {
                // Add any missing properties
                const prefs = new Prefs();
                Object.assign(prefs.general, readPrefs.general);
                Object.assign(prefs.editor, readPrefs.editor);
                Object.assign(prefs.misc, readPrefs.misc);

                if (prefs.general.saveFolder == "") {
                    prefs.general.saveFolder = app.getPath("userData");
                }

                if (process.platform === "darwin") {
                    prefs.general.titlebarStyle = "native";
                }

                return prefs;
            }
        } catch (error) {
            logError(
                "Couldn't parse prefs.json",
                "Try deleting the file so Codex can generate a new one.\n\n" + (<Error>error).stack
            );
            return null;
        }
    } else {
        const prefs = new Prefs();
        prefs.general.saveFolder = app.getPath("userData");
        if (process.platform === "darwin") {
            prefs.general.titlebarStyle = "native";
        }

        writePrefs(prefs);
        return prefs;
    }
}

export function writePrefs(prefs: Prefs) {
    const prefsPath = path.join(app.getPath("userData"), "/prefs.json");

    try {
        writeFileSync(prefsPath, JSON.stringify(prefs, null, 4), "utf-8");
    } catch (error) {
        logError("Couldn't write prefs.json to the disk", "" + (<Error>error).stack);
    }
}

export function loadSave(saveFolderPath: string): Save | null {
    const saveFilePath = path.join(saveFolderPath, "save.json");

    if (existsSync(saveFilePath)) {
        try {
            const saveText = readFileSync(saveFilePath, "utf-8").toString();
            const saveObj = JSON.parse(saveText);

            if (saveObj["schema_version"] === undefined) {
                const result_1 = dialog.showMessageBoxSync({
                    title: "Codex",
                    message: "Please backup your save.json and notes folder.",
                    detail:
                        "Codex 2.0 has to convert your save.json to a new format, " +
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

                // 1.X.X save
                console.log(
                    `Converting Save with schema version ${saveObj["schema_version"]} to ${Save.currentSaveSchema}`
                );

                const save = convertOldSave(saveObj, saveFolderPath);
                writeSave(saveFolderPath, save);

                return save;
            } else if (parseInt(saveObj["schema_version"]) < Save.currentSaveSchema) {
                // 2.0.0 - X.X.X conversion
                return null;
            } else {
                return Save.parse(saveText);
            }
        } catch (error) {
            logError("Couldn't parse save.json", "" + (<Error>error).stack);
            return null;
        }
    } else {
        writeSave(saveFolderPath, exampleSave);

        return exampleSave;
    }
}

export function writeSave(saveFolderPath: string, save: Save) {
    const saveFilePath = path.join(saveFolderPath, "save.json");

    try {
        writeFileSync(saveFilePath, Save.stringify(save), "utf-8");
    } catch (error) {
        logError("Couldn't write save.json to the disk", "" + (<Error>error).stack);
    }
}

export function loadPage(saveFolderPath: string, pageFileName: string): string {
    if (!existsSync(path.join(saveFolderPath, "/notes/")))
        mkdirSync(path.join(saveFolderPath, "/notes/"));

    const filePath = path.join(saveFolderPath, "/notes/", pageFileName);

    if (existsSync(filePath)) {
        return readFileSync(filePath, "utf-8").toString();
    } else {
        const data = '{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"}}]}';
        writeFileSync(filePath, data, "utf-8");
        return data;
    }
}

export function writePage(saveFolderPath: string, pageFileName: string, data: string) {
    if (!existsSync(path.join(saveFolderPath, "/notes/")))
        mkdirSync(path.join(saveFolderPath, "/notes/"));

    const filePath = path.join(saveFolderPath, "/notes/", pageFileName);
    writeFileSync(filePath, data, "utf-8");
}
