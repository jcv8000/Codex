import { BrowserWindow, ipcMain, ipcRenderer } from "electron";
import { Prefs } from "./Prefs";
import { Page, Save } from "./Save";

export type Link =
    | "help"
    | "website"
    | "changelogs"
    | "download"
    | "github"
    | "issues"
    | "feedback"
    | "katex_commands"
    | "mathlive_commands";

export class TypedIpcMain {
    window: BrowserWindow;

    constructor(window: BrowserWindow) {
        this.window = window;
    }

    onGetPrefs = (callback: () => Prefs) => {
        ipcMain.on("GET_PREFS", (e) => {
            e.returnValue = JSON.stringify(callback());
        });
    };

    onWritePrefs = (callback: (newPrefs: Prefs) => void) => {
        ipcMain.on("WRITE_PREFS", (e, args) => {
            callback(JSON.parse(args[0]));
        });
    };

    onGetSave = (callback: () => Save) => {
        ipcMain.on("GET_SAVE", (e) => {
            e.returnValue = Save.stringify(callback());
        });
    };

    onWriteSave = (callback: (newSave: Save) => void) => {
        ipcMain.on("WRITE_SAVE", (e, args) => {
            callback(Save.parse(args[0]));
        });
    };

    onLoadPage = (callback: (fileName: string) => string) => {
        ipcMain.on("LOAD_PAGE", (e, args) => {
            e.returnValue = callback(args[0]);
        });
    };

    onWritePage = (callback: (fileName: string, data: string) => void) => {
        ipcMain.handle("WRITE_PAGE", (e, args: any[]) => {
            callback(args[0], args[1]);
        });
    };

    onExportPagePDF = (callback: (pageName: string) => void) => {
        ipcMain.handle("EXPORT_PAGE_PDF", (e, args: any[]) => callback(args[0]));
    };

    onExportOneOfManyPDF = (callback: (directory: string, page: Page) => void) => {
        ipcMain.handle("EXPORT_ONE_OF_MANY_PDF", (e, args) => callback(args[0], args[1]));
    };

    onExportPageMD = (callback: (pageName: string, md: string) => void) => {
        ipcMain.on("EXPORT_PAGE_MD", (e, args) => callback(args[0], args[1]));
    };

    onExportOneOfManyMD = (callback: (directory: string, page: Page, md: string) => void) => {
        ipcMain.on("EXPORT_ONE_OF_MANY_MD", (e, args) => callback(args[0], args[1], args[2]));
    };

    onGetDirectory = (callback: () => string | undefined) => {
        ipcMain.on("GET_DIRECTORY", (e) => (e.returnValue = callback()));
    };

    onGetDefaultSaveLocation = (callback: () => string) => {
        ipcMain.on("GET_DEFAULT_SAVE_LOCATION", (e) => {
            e.returnValue = callback();
        });
    };

    onChangeSaveDirectory = (callback: (newSaveLocation: string) => void) => {
        ipcMain.on("CHANGE_SAVE_LOCATION", (e, args) => callback(args[0]));
    };

    onExit = (callback: () => void) => {
        ipcMain.on("EXIT", callback);
    };

    onOpenLink = (callback: (link: Link) => void) => {
        ipcMain.on("OPEN_LINK", (e, args) => callback(args[0]));
    };

    onRestart = (callback: () => void) => {
        ipcMain.on("RESTART", callback);
    };

    isRunningUnderARM64Translation = (callback: () => boolean) => {
        ipcMain.handle("IS_RUNNING_UNDER_ARM64_TRANSLATION", callback);
    };
}

export class TypedIpcRenderer {
    private startPrefs: string;
    private startSave: string;

    constructor() {
        this.startPrefs = ipcRenderer.sendSync("GET_PREFS");
        this.startSave = ipcRenderer.sendSync("GET_SAVE");
    }

    getPrefs = (): string => {
        return this.startPrefs;
    };

    writePrefs = (prefs: Prefs): void => {
        ipcRenderer.send("WRITE_PREFS", [JSON.stringify(prefs)]);
    };

    getSave = (): string => {
        return this.startSave;
    };

    writeSave = (save: Save) => {
        ipcRenderer.send("WRITE_SAVE", [Save.stringify(save)]);
    };

    loadPage = (fileName: string): string => {
        return ipcRenderer.sendSync("LOAD_PAGE", [fileName]);
    };

    writePage = async (fileName: string, data: string) => {
        await ipcRenderer.invoke("WRITE_PAGE", [fileName, data]);
    };

    exportPagePDF = async (page: Page) => {
        await ipcRenderer.invoke("EXPORT_PAGE_PDF", [page.name]);
    };

    exportOneOfManyPDF = async (directory: string, page: Page) => {
        await ipcRenderer.invoke("EXPORT_ONE_OF_MANY_PDF", [directory, page]);
    };

    exportPageMD = (page: Page, md: string) => {
        ipcRenderer.send("EXPORT_PAGE_MD", [page.name, md]);
    };

    exportOneOfManyMD = (directory: string, page: Page, md: string) => {
        ipcRenderer.send("EXPORT_ONE_OF_MANY_MD", [directory, page, md]);
    };

    getDirectory = (): string | undefined => {
        return ipcRenderer.sendSync("GET_DIRECTORY");
    };

    getDefaultSaveLocation = (): string => {
        return ipcRenderer.sendSync("GET_DEFAULT_SAVE_LOCATION");
    };

    changeSaveLocation = (newSaveLocation: string) => {
        ipcRenderer.send("CHANGE_SAVE_LOCATION", [newSaveLocation]);
    };

    onBeforeExit = (callback: () => void) => {
        ipcRenderer.removeAllListeners("EXIT");
        ipcRenderer.on("EXIT", callback);
    };

    exit = () => {
        ipcRenderer.send("EXIT");
    };

    onSaveCurrentPage = (callback: () => void) => {
        ipcRenderer.removeAllListeners("SAVE_ACTIVE_PAGE");
        ipcRenderer.on("SAVE_ACTIVE_PAGE", () => callback());
    };

    onEditorZoomIn = (callback: () => void) => {
        ipcRenderer.removeAllListeners("MENU_ZOOM_IN");
        ipcRenderer.on("MENU_ZOOM_IN", () => callback());
    };

    onEditorZoomOut = (callback: () => void) => {
        ipcRenderer.removeAllListeners("MENU_ZOOM_OUT");
        ipcRenderer.on("MENU_ZOOM_OUT", () => callback());
    };

    onEditorResetZoom = (callback: () => void) => {
        ipcRenderer.removeAllListeners("MENU_ZOOM_RESET");
        ipcRenderer.on("MENU_ZOOM_RESET", () => callback());
    };

    onExportPagePdf = (callback: () => void) => {
        ipcRenderer.removeAllListeners("MENU_EXPORT_PAGE_PDF");
        ipcRenderer.on("MENU_EXPORT_PAGE_PDF", () => callback());
    };

    onToggleSidebar = (callback: () => void) => {
        ipcRenderer.removeAllListeners("MENU_TOGGLE_SIDEBAR");
        ipcRenderer.on("MENU_TOGGLE_SIDEBAR", () => callback());
    };

    onResetSidebarWidth = (callback: () => void) => {
        ipcRenderer.removeAllListeners("MENU_RESET_SIDEBAR_WIDTH");
        ipcRenderer.on("MENU_RESET_SIDEBAR_WIDTH", () => callback());
    };

    onToggleEditorToolbar = (callback: () => void) => {
        ipcRenderer.removeAllListeners("MENU_TOGGLE_EDITOR_TOOLBAR");
        ipcRenderer.on("MENU_TOGGLE_EDITOR_TOOLBAR", () => callback());
    };

    openLink = (link: Link) => {
        ipcRenderer.send("OPEN_LINK", [link]);
    };

    restart = () => {
        ipcRenderer.send("RESTART");
    };

    onUpdateAvailable = (callback: (newVersion: string) => void) => {
        ipcRenderer.removeAllListeners("UPDATE_AVAILABLE");
        ipcRenderer.on("UPDATE_AVAILABLE", (e, args) => callback(args[0]));
    };

    isMac = () => process.platform === "darwin";

    isRunningUnderARM64Translation = () => {
        return ipcRenderer.invoke("IS_RUNNING_UNDER_ARM64_TRANSLATION");
    };
}
