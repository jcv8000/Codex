import { SupportedLocales } from "common/Locales";

type GeneralPrefs = {
    saveFolder: string;
    accentColor: string;
    sidebarWidth: number;
    locale: SupportedLocales;
    theme: "light" | "dark";
    titlebarStyle: "custom" | "native";
    autoSaveOnPageSwitch: boolean;
};

type EditorPrefs = {
    codeBlockTheme: string;
    useTypographyExtension: boolean;
    border: boolean;
    width: "md" | "lg" | "xl";
    spellcheck: boolean;
    zoom: number;
    openPDFonExport: boolean;
    recentCodeLangs: string[];
    codeWordWrap: boolean;
    tabSize: number;
};

type MiscPrefs = {
    lastOpenedVersion: string;
};

export type Prefs = {
    general: GeneralPrefs;
    editor: EditorPrefs;
    misc: MiscPrefs;
};

export const defaultPrefs: Prefs = {
    general: {
        saveFolder: "",
        accentColor: "#ff7926",
        sidebarWidth: 300,
        locale: "en_US",
        theme: "light",
        titlebarStyle: "custom",
        autoSaveOnPageSwitch: true
    },
    editor: {
        codeBlockTheme: "github-dark-dimmed",
        useTypographyExtension: false,
        border: true,
        width: "md",
        spellcheck: true,
        zoom: 1.0,
        openPDFonExport: true,
        recentCodeLangs: [],
        codeWordWrap: false,
        tabSize: 4
    },
    misc: {
        lastOpenedVersion: "0.0.0"
    }
};
