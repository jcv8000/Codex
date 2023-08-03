import { BrowserWindow, Menu, app } from "electron";
import isDev from "electron-is-dev";
import { resolve } from "path";
import { menu } from "./menu";
import * as remote from "@electron/remote/main";
import { loadWindowState, saveWindowState } from "./windowState";
import contextMenu from "electron-context-menu";
import { Prefs } from "common/Prefs";
import { locales } from "common/Locales";
import nodeFetch from "node-fetch";
import { compare } from "semver";
import escape from "validator/lib/escape";

async function checkForUpdates(window: BrowserWindow) {
    app.commandLine.appendSwitch("disable-http-cache");

    const resp = await nodeFetch("https://jcv8000.github.io/codex/latestversion.txt");
    const onlineVersion = await resp.text();

    if (onlineVersion != undefined && import.meta.env.VITE_APP_VERSION != undefined)
        if (compare(onlineVersion, import.meta.env.VITE_APP_VERSION) != 0) {
            window.webContents.send("UPDATE_AVAILABLE", [escape(onlineVersion)]);

            // if (process.platform === "win32") {
            //     window.once("focus", () => window.flashFrame(false));
            //     window.flashFrame(true);
            // }

            // if (process.platform === "darwin") {
            //     app.dock.bounce("critical");
            // }
        }
}

export function createWindow(prefs: Prefs) {
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
        // if (process.env.VITE_DEV_SERVER_URL) mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
        // else {
        //     console.error("Vite dev server URL not defined");
        //     app.exit();
        // }
        window.loadURL("http://localhost:5173");
    } else {
        window.loadFile(".vite/renderer/index.html");
    }

    //mainWindow.webContents.openDevTools();

    window.webContents.on("did-finish-load", () => {
        if (windowState.maximized) window.maximize();
        else window.show();

        setTimeout(() => checkForUpdates(window), 2000);
    });

    window.on("close", (e) => {
        e.preventDefault();
        window.webContents.send("EXIT");
        saveWindowState(window);
    });

    remote.enable(window.webContents);
    remote.initialize();

    contextMenu({ showInspectElement: false });

    //mainWindow.removeMenu();
    Menu.setApplicationMenu(menu(window, locales[prefs.general.locale]));

    return window;
}
