import { contextBridge } from "electron";
import { Titlebar, Color } from "@treverix/custom-electron-titlebar";
import { TypedIpcRenderer } from "common/ipc";

declare global {
    interface Window {
        ipc: TypedIpcRenderer;
    }
}

// Only grab prefs and save from across the IPC bridge at the start
const typedIpcRenderer = new TypedIpcRenderer();

contextBridge.exposeInMainWorld("ipc", {
    on: typedIpcRenderer.on,
    invoke: typedIpcRenderer.invoke
});

async function titlebar() {
    const prefs = await typedIpcRenderer.invoke("get-prefs");
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
