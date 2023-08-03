import { contextBridge } from "electron";
import { TypedIpcRenderer } from "common/ipc";
import { Titlebar, Color } from "@treverix/custom-electron-titlebar";

declare global {
    interface Window {
        api: TypedIpcRenderer;
    }
}

// Only grab prefs and save from across the IPC bridge at the start
const typedIpcRenderer = new TypedIpcRenderer();

contextBridge.exposeInMainWorld("api", typedIpcRenderer);

if (
    JSON.parse(typedIpcRenderer.getPrefs()).general.titlebarStyle == "custom" &&
    process.platform !== "darwin"
) {
    window.addEventListener("DOMContentLoaded", () => {
        new Titlebar({
            backgroundColor: Color.fromHex("#343A40"),
            unfocusEffect: false,
            icon: "./icon.ico"
        });
    });
}
