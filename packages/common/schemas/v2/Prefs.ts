import { SupportedLocales } from "common/Locales";

export type Prefs = {
    schema_version: number;
    general: {
        saveFolder: string;
        accentColor: string;
        sidebarWidth: number;
        locale: SupportedLocales;
        theme: "light" | "dark";
        titlebarStyle: "custom" | "native";
        autoSaveOnPageSwitch: boolean;
    };
    editor: {
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
    misc: {
        lastOpenedVersion: string;
    };
};

export const defaultPrefs: Prefs = {
    schema_version: 2,
    general: {
        saveFolder: "",
        accentColor: "#FF7926",
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
