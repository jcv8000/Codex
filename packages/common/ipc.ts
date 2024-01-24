import { Page } from "./Save";

// export type RendererCommands = {
//     "get-prefs": () => Prefs;
//     "write-prefs": (p: Prefs) => boolean;
//     "get-save": () => Save;
//     "write-save": (s: Save) => boolean;

//     "load-page": (fileName: string) => string;
//     "write-page": (fileName: string, content: string) => boolean;

//     "export-single-pdf": (page: Page) => boolean;
//     "export-multiple-pdf": (page: Page, directory: string) => boolean;
//     "export-single-md": (page: Page, md: string) => boolean;
//     "export-multiple-md": (page: Page, md: string, directory: string) => boolean;

//     "get-directory": () => string | undefined;
//     "get-default-save-location": () => string;
//     "change-save-location": (location: string) => void;

//     "open-link": (link: Link) => void;
//     "open-external-link": (url: string) => void;
//     "is-under-arm64-translator": () => boolean;

//     restart: () => void;
//     exit: () => void;
// };
// export type MainEvents = RendererCommands;

// export type MainCommands = {
//     "save-current-page": () => void;
//     "editor-zoom-in": () => void;
//     "editor-zoom-out": () => void;
//     "editor-reset-zoom": () => void;
//     "export-current-page-pdf": () => void;
//     "toggle-sidebar": () => void;
//     "reset-sidebar-width": () => void;
//     "toggle-editor-toolbar": () => void;
//     "update-available": (version: string) => void;
//     "pre-exit": () => void;
// };
// export type RendererEvents = MainCommands;

export type Commands = {
    "get-prefs": () => string;
    "write-prefs": (prefsString: string) => boolean;
    "get-save": () => string;
    "write-save": (saveString: string) => boolean;

    "load-page": (fileName: string) => string;
    "write-page": (fileName: string, content: string) => boolean;

    "export-single-pdf": (page: Page) => boolean | undefined;
    "export-multiple-pdf": (page: Page, directory: string) => boolean;
    "export-single-md": (page: Page, md: string) => boolean | undefined;
    "export-multiple-md": (page: Page, md: string, directory: string) => boolean;

    "get-directory": () => string | undefined;
    "get-default-save-location": () => string;

    "is-under-arm64-translator": () => boolean;
};

export type Events = {
    "change-save-location": (location: string) => void;

    "open-link": (link: Link) => void;
    "open-external-link": (url: string) => void;

    "menu-save-current-page": () => void;
    "menu-editor-zoom-in": () => void;
    "menu-editor-zoom-out": () => void;
    "menu-editor-reset-zoom": () => void;
    "menu-export-current-page-pdf": () => void;
    "menu-toggle-sidebar": () => void;
    "menu-reset-sidebar-width": () => void;
    "menu-toggle-editor-toolbar": () => void;

    "update-available": (version: string) => void;
    "pre-exit": () => void;

    restart: () => void;
    exit: () => void;
};

type Link =
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

export type { TypedIpcMain, TypedIpcRenderer, TypedWebContents } from "./TypedIpc";
