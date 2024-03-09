import { BrowserWindow, Menu, app } from "electron";
import isDev from "electron-is-dev";
import { resolve } from "path";
import { menu } from "./menu";
import * as remote from "@electron/remote/main";
import { loadWindowState, saveWindowState } from "./windowState";
import contextMenu from "electron-context-menu";
import { Prefs } from "common/schemas/v1";
import { locales } from "common/Locales";
import { lt as lessThan } from "semver";
import escape from "validator/lib/escape";
import log from "electron-log";
import { TypedIpcMain } from "common/ipc";

async function checkForUpdates(ipc: TypedIpcMain) {
    app.commandLine.appendSwitch("disable-http-cache");

    try {
        const resp = await fetch("https://api.github.com/repos/jcv8000/Codex/releases");
        const body = (await resp.json()) as any[];

        const latest = body[0].tag_name as string | undefined;

        if (latest && import.meta.env.VITE_APP_VERSION) {
            if (lessThan(import.meta.env.VITE_APP_VERSION, latest)) {
                const escapedVersion = escape(latest);
                ipc.send("update-available", escapedVersion);
            }
        }
    } catch (e) {
        log.info("Unable to check for updates");
    }
}

export function createWindow(prefs: Prefs, ipc: TypedIpcMain) {
    const windowState = loadWindowState();

    let icon = "icon.ico";
    if (process.platform == "linux") icon = "64x64.png";
    else if (process.platform == "darwin") icon = "icon.icns";

    const window = new BrowserWindow({
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
        minWidth: 480,
        minHeight: 320,
        frame: prefs.general.titlebarStyle == "native",
        show: false,
        icon: resolve(__dirname, "../assets/" + icon),
        webPreferences: {
            preload: resolve(__dirname, "preload.cjs")
        }
    });

    if (isDev) {
        if (process.env.VITE_DEV_SERVER_URL) window.loadURL(process.env.VITE_DEV_SERVER_URL);
        else {
            console.error("Vite dev server URL not defined");
            app.exit();
        }
    } else {
        window.loadFile(".vite/renderer/index.html");
    }

    //mainWindow.webContents.openDevTools();

    window.webContents.on("did-finish-load", () => {
        if (windowState.maximized) window.maximize();
        else window.show();

        setTimeout(() => checkForUpdates(ipc), 2000);
    });

    window.on("close", (e) => {
        e.preventDefault();
        ipc.send("pre-exit");
        saveWindowState(window);
    });

    remote.enable(window.webContents);
    remote.initialize();

    contextMenu({ showInspectElement: false });

    //mainWindow.removeMenu();
    Menu.setApplicationMenu(menu(window, locales[prefs.general.locale]));

    return window;
}
