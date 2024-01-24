import { contextBridge, ipcRenderer } from "electron";
import { Commands, Events, TypedIpcRenderer } from "common/ipc";
import { Titlebar, Color } from "@treverix/custom-electron-titlebar";
import { Prefs } from "common/Prefs";

declare global {
    interface Window {
        ipc: TypedIpcRenderer<Events, Commands>;
    }
}

// Only grab prefs and save from across the IPC bridge at the start
const typedIpcRenderer = ipcRenderer as TypedIpcRenderer<Events, Commands>;

contextBridge.exposeInMainWorld("ipc", typedIpcRenderer);

async function titlebar() {
    const prefs = JSON.parse(await typedIpcRenderer.invoke("get-prefs")) as Prefs;
    if (prefs.general.titlebarStyle == "custom" && process.platform !== "darwin") {
        window.addEventListener("DOMContentLoaded", () => {
            new Titlebar({
                backgroundColor: Color.fromHex("#343A40"),
                unfocusEffect: false,
                icon: "./icon.ico"
            });
        });
    }
}
titlebar();
