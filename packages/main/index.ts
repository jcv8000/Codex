import { BrowserWindow, app, dialog, shell } from "electron";
import { loadPrefs, loadSave, writePrefs, writeSave, loadPage, writePage } from "./data";
import { createWindow } from "./createWindow";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { sanitizeStringForFileName } from "common/Utils";
import { join } from "path";
import isDev from "electron-is-dev";
import { electronSecurity } from "./security";
import { logError, setupLogger } from "./logger";
import { saveWindowState } from "./windowState";
import { locales } from "common/locales";
import { TypedIpcMain, linkMap } from "common/ipc";

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

        const ipc = new TypedIpcMain();

        app.on("activate", () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) createWindow(prefs, ipc);
        });

        ipc.handle("get-prefs", () => {
            return prefs;
        });

        ipc.handle("write-prefs", (e, [newPrefs]) => {
            try {
                prefs = newPrefs;
                writePrefs(prefs);
                return true;
            } catch (e) {
                return false;
            }
        });

        ipc.handle("get-save", () => {
            return save;
        });

        ipc.handle("write-save", (e, [newSave]) => {
            try {
                save = newSave;
                writeSave(prefs.general.saveFolder, save);
                return true;
            } catch (e) {
                return false;
            }
        });

        ipc.handle("load-page", (e, [fileName]) => {
            try {
                return loadPage(prefs.general.saveFolder, fileName);
            } catch (e) {
                return null;
            }
        });

        ipc.handle("write-page", (e, [fileName, data]) => {
            try {
                writePage(prefs.general.saveFolder, fileName, data);
                return true;
            } catch (e) {
                return false;
            }
        });

        ipc.handle("export-single-pdf", async (e, [page]) => {
            const sanitizedName = sanitizeStringForFileName(page.name);

            const saveResult = await dialog.showSaveDialog(window, {
                filters: [{ extensions: ["pdf"], name: "PDF" }],
                defaultPath: `${sanitizedName}.pdf`
            });

            if (saveResult.canceled || saveResult.filePath == undefined) {
                return undefined;
            }

            try {
                const data = await window.webContents.printToPDF({
                    pageSize: "A4",
                    printBackground: true
                });

                writeFileSync(saveResult.filePath, data, { flag: "w" });

                if (prefs.editor.openPDFonExport) shell.openPath(saveResult.filePath);
                return true;
            } catch (e) {
                return false;
            }
        });

        ipc.handle("export-single-md", async (e, [page, md]) => {
            const sanitizedName = sanitizeStringForFileName(page.name);

            const saveResult = await dialog.showSaveDialog(window, {
                filters: [{ extensions: ["md"], name: "Markdown" }],
                defaultPath: `${sanitizedName}.md`
            });

            if (saveResult.canceled || saveResult.filePath == undefined) {
                return undefined;
            }

            try {
                writeFileSync(saveResult.filePath, md, { flag: "w" });
                return true;
            } catch (e) {
                return false;
            }
        });

        ipc.handle("export-multiple-pdf", async (e, [page, directory]) => {
            // TODO make folders for parent folders somehow
            const sanitizedName = sanitizeStringForFileName(page.name) + "_" + page.id + ".pdf";

            try {
                const data = await window.webContents.printToPDF({
                    pageSize: "A4",
                    printBackground: true
                });

                writeFileSync(join(directory, sanitizedName), data, { flag: "w" });
                return true;
            } catch (e) {
                return false;
            }
        });

        ipc.handle("export-multiple-md", (e, [page, md, directory]) => {
            // TODO make folders for parent folders somehow
            const sanitizedName = sanitizeStringForFileName(page.name) + "_" + page.id + ".md";

            try {
                writeFileSync(join(directory, sanitizedName), md, { flag: "w" });
                return true;
            } catch (e) {
                return false;
            }
        });

        ipc.handle("get-directory", () => {
            const results = dialog.showOpenDialogSync(window, { properties: ["openDirectory"] });

            if (results == undefined) return undefined;

            return results[0];
        });

        ipc.handle("get-default-save-location", () => {
            return app.getPath("userData");
        });

        ipc.handle("change-save-location", (e, [newSaveLocation]) => {
            if (prefs == undefined) return;

            prefs.general.saveFolder = newSaveLocation;
            writePrefs(prefs);

            saveWindowState(window);
            if (!isDev) app.relaunch();
            app.exit();
        });

        ipc.handle("reset-to-default-save-location", () => {
            if (prefs == undefined) return;

            prefs.general.saveFolder = app.getPath("userData");
            writePrefs(prefs);

            saveWindowState(window);
            if (!isDev) app.relaunch();
            app.exit();
        });

        ipc.handle("exit", () => app.exit());

        ipc.handle("open-link", (e, [link]) => {
            shell.openExternal(linkMap[link]);
        });

        ipc.handle("restart", () => {
            saveWindowState(window);
            if (!isDev) app.relaunch();
            app.exit();
        });

        ipc.handle("is-under-arm64-translator", () => {
            return app.runningUnderARM64Translation;
        });

        ipc.handle("open-external-link", (e, [href]) => {
            try {
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
            } catch (e) {
                logError(
                    "Error",
                    "Error occurred either while loading or saving the trusted domains file, or opening the link"
                );
            }
        });

        const window = createWindow(prefs, ipc);
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
