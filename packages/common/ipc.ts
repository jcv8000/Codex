import { IpcMainInvokeEvent, IpcRendererEvent, ipcMain, ipcRenderer, webContents } from "electron";
import { Page, Prefs, Save } from "./schemas/v2";

type OptionalPromise<T> = T | Promise<T>;

type RendererCommands = {
    "get-prefs": () => Prefs;
    "write-prefs": (prefs: Prefs) => boolean;
    "get-save": () => Save;
    "write-save": (save: Save) => boolean;

    "load-page": (fileName: string) => string | null;
    "write-page": (fileName: string, content: string) => boolean;

    "export-single-pdf": (page: Page) => boolean | undefined;
    "export-multiple-pdf": (page: Page, directory: string) => boolean;
    "export-single-md": (page: Page, md: string) => boolean | undefined;
    "export-multiple-md": (page: Page, md: string, directory: string) => boolean;

    "get-directory": () => string | undefined;
    "get-default-save-location": () => string;

    "is-under-arm64-translator": () => boolean;

    "change-save-location": (location: string) => void;

    "open-link": (link: Link) => void;
    "open-external-link": (url: string) => void;

    restart: () => void;
    exit: () => void;
};

type MainCommands = {
    "pre-exit": () => void;
    "update-available": (version: string) => void;
};

export class TypedIpcRenderer {
    invoke<K extends keyof RendererCommands>(
        channel: K,
        ...args: Parameters<RendererCommands[K]>
    ): Promise<ReturnType<RendererCommands[K]>> {
        // TODO add channel whitelist
        return ipcRenderer.invoke(channel, args);
    }

    // send<K extends keyof RendererCommands>(channel: K, ...args: Parameters<RendererCommands[K]>) {
    //     ipcRenderer.send(channel, args);
    // }

    on<K extends keyof MainCommands>(
        channel: K,
        listener: (event: IpcRendererEvent, args: Parameters<MainCommands[K]>) => void
    ) {
        // TODO add channel whitelist
        ipcRenderer.on(channel, listener);
    }
}

export class TypedIpcMain {
    send<K extends keyof MainCommands>(channel: K, ...args: Parameters<MainCommands[K]>): void {
        webContents.getAllWebContents().forEach((wc) => wc.send(channel, args));
    }

    // on<K extends keyof RendererCommands>(
    //     channel: K,
    //     listener: (event: IpcMainEvent, args: Parameters<RendererCommands[K]>) => void
    // ) {
    //     ipcMain.on(channel, listener);
    // }

    handle<K extends keyof RendererCommands>(
        channel: K,
        listener: (
            event: IpcMainInvokeEvent,
            args: Parameters<RendererCommands[K]>
        ) => OptionalPromise<ReturnType<RendererCommands[K]>>
    ) {
        // TODO add channel whitelist
        ipcMain.handle(channel, listener);
    }
}

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

export const linkMap: { [Property in Link]: string } = {
    help: "https://codexnotes.com/docs",
    website: "https://codexnotes.com/",
    changelogs: "https://github.com/jcv8000/Codex/releases",
    download: "https://github.com/jcv8000/Codex/releases",
    github: "https://github.com/jcv8000/Codex",
    issues: "https://github.com/jcv8000/Codex/issues",
    feedback: "https://forms.gle/MgVtcPtcytTYZgxJ7",
    mathlive_commands: "https://cortexjs.io/mathlive/reference/commands/",
    katex_commands: "https://katex.org/docs/supported.html"
};
