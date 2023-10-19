import { BrowserWindow, app, dialog, shell } from "electron";
import { loadPrefs, loadSave, writePrefs, writeSave, loadPage, writePage } from "./data";
import { createWindow } from "./createWindow";
import { TypedIpcMain } from "common/ipc";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { sanitizeStringForFileName } from "common/Utils";
import { join } from "path";
import isDev from "electron-is-dev";
import { electronSecurity } from "./security";
import { setupLogger } from "./logger";
import { saveWindowState } from "./windowState";
import { locales } from "common/Locales";

if (app.requestSingleInstanceLock()) {
    app.whenReady().then(() => {
        electronSecurity();
        setupLogger();

        const _prefs = loadPrefs();
        if (_prefs == null) {
            app.exit();
            return;
        }
        let prefs = _prefs;

        const _save = loadSave(prefs.general.saveFolder);
        if (_save == null) {
            app.exit();
            return;
        }
        let save = _save;

        const window = createWindow(prefs);

        app.on("activate", () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) createWindow(prefs);
        });

        const typedIpcMain = new TypedIpcMain(window);

        typedIpcMain.onGetPrefs(() => {
            return prefs;
        });

        typedIpcMain.onWritePrefs((newPrefs) => {
            prefs = newPrefs;
            writePrefs(newPrefs);
        });

        typedIpcMain.onGetSave(() => {
            return save;
        });

        typedIpcMain.onWriteSave((newSave) => {
            save = newSave;
            writeSave(prefs.general.saveFolder, newSave);
        });

        typedIpcMain.onLoadPage((fileName) => {
            return loadPage(prefs.general.saveFolder, fileName);
        });

        typedIpcMain.onWritePage((fileName, data) => {
            writePage(prefs.general.saveFolder, fileName, data);
        });

        typedIpcMain.onExportPagePDF(async (pageName) => {
            const sanitizedName = sanitizeStringForFileName(pageName);

            const saveResult = await dialog.showSaveDialog(window, {
                filters: [{ extensions: ["pdf"], name: "PDF" }],
                defaultPath: `${sanitizedName}.pdf`
            });

            if (saveResult.canceled || saveResult.filePath == undefined) {
                return;
            }

            const data = await window.webContents.printToPDF({
                pageSize: "A4",
                printBackground: true
            });

            writeFileSync(saveResult.filePath, data, { flag: "w" });

            if (prefs.editor.openPDFonExport) shell.openPath(saveResult.filePath);
        });

        typedIpcMain.onExportPageMD(async (pageName, md) => {
            const sanitizedName = sanitizeStringForFileName(pageName);

            const saveResult = await dialog.showSaveDialog(window, {
                filters: [{ extensions: ["md"], name: "Markdown" }],
                defaultPath: `${sanitizedName}.md`
            });

            if (saveResult.canceled || saveResult.filePath == undefined) {
                return;
            }

            writeFileSync(saveResult.filePath, md, { flag: "w" });
        });

        typedIpcMain.onExportOneOfManyPDF(async (directory, page) => {
            // TODO make folders for parent folders somehow
            const sanitizedName = sanitizeStringForFileName(page.name) + "_" + page.id + ".pdf";

            const data = await window.webContents.printToPDF({
                pageSize: "A4",
                printBackground: true
            });

            writeFileSync(join(directory, sanitizedName), data, { flag: "w" });
        });

        typedIpcMain.onExportOneOfManyMD((directory, page, md) => {
            // TODO make folders for parent folders somehow
            const sanitizedName = sanitizeStringForFileName(page.name) + "_" + page.id + ".md";

            writeFileSync(join(directory, sanitizedName), md, { flag: "w" });
        });

        typedIpcMain.onGetDirectory(() => {
            const results = dialog.showOpenDialogSync(window, { properties: ["openDirectory"] });

            if (results == undefined) return undefined;

            return results[0];
        });

        typedIpcMain.onGetDefaultSaveLocation(() => {
            return app.getPath("userData");
        });

        typedIpcMain.onChangeSaveDirectory((newSaveLocation) => {
            if (prefs == undefined) return;

            prefs.general.saveFolder = newSaveLocation;
            writePrefs(prefs);

            saveWindowState(window);
            if (!isDev) app.relaunch();
            app.exit();
        });

        typedIpcMain.onExit(() => app.exit());

        typedIpcMain.onOpenLink((link) => {
            if (link == "help") shell.openExternal("https://codexnotes.com/docs");
            if (link == "website") shell.openExternal("https://codexnotes.com/");
            if (link == "changelogs")
                shell.openExternal("https://github.com/jcv8000/Codex/releases");
            if (link == "download") shell.openExternal("https://github.com/jcv8000/Codex/releases");
            if (link == "github") shell.openExternal("https://github.com/jcv8000/Codex");
            if (link == "issues") shell.openExternal("https://github.com/jcv8000/Codex/issues");
            if (link == "feedback") shell.openExternal("https://forms.gle/MgVtcPtcytTYZgxJ7");
            if (link == "mathlive_commands")
                shell.openExternal("https://cortexjs.io/mathlive/reference/commands/");
            if (link == "katex_commands")
                shell.openExternal("https://katex.org/docs/supported.html");
        });

        typedIpcMain.onRestart(() => {
            saveWindowState(window);
            if (!isDev) app.relaunch();
            app.exit();
        });

        typedIpcMain.isRunningUnderARM64Translation(() => {
            return app.runningUnderARM64Translation;
        });

        typedIpcMain.onOpenExternalLink((href) => {
            const filePath = join(app.getPath("userData"), "trusted-link-domains.json");
            if (!existsSync(filePath)) {
                writeFileSync(filePath, JSON.stringify([]), "utf-8");
            }
            const trusted: string[] = JSON.parse(readFileSync(filePath).toString());

            const url = new URL(href);
            const origin = url.origin;

            if (trusted.includes(origin)) {
                shell.openExternal(href);
                return;
            }

            const result = dialog.showMessageBoxSync(window, {
                type: "question",
                noLink: true,
                message: locales[prefs.general.locale].shellDialogs.open_external_link.title,
                detail: href + "\n\nTrusted domains are stored here:\n" + filePath,
                buttons: [
                    locales[prefs.general.locale].shellDialogs.open_external_link.yes,
                    locales[prefs.general.locale].shellDialogs.open_external_link.trust_domain,
                    locales[prefs.general.locale].shellDialogs.open_external_link.cancel
                ]
            });

            if (result == 0) {
                // Yes
                shell.openExternal(href);
            } else if (result == 1) {
                // Trust domain
                shell.openExternal(href);
                trusted.push(origin);
                writeFileSync(filePath, JSON.stringify(trusted), "utf-8");
            }
        });
    });

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });
} else {
    app.quit();
}
