import { BrowserWindow } from "electron";
import { resolve } from "path";
import isDev from "electron-is-dev";

export function openAboutWindow(parent: BrowserWindow) {
    const about = new BrowserWindow({
        width: 680,
        height: 380,
        resizable: false,
        icon: resolve(__dirname, "../assets/icon.ico"),
        title: "About Codex",
        modal: process.platform === "darwin" ? false : true,
        parent: parent,
        show: false
    });

    about.removeMenu();

    about.webContents.once("dom-ready", () => {
        about.show();
    });

    if (isDev) {
        about.loadURL("http://localhost:5173/about/about.html");
    } else {
        about.loadFile(".vite/renderer/about/about.html");
    }
}
