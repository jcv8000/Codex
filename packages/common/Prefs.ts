import { SupportedLocales } from "./Locales";

class GeneralPrefs {
    saveFolder = "";
    accentColor = "#ff7926";
    sidebarWidth = 300;
    locale: SupportedLocales = "en_US";
    theme: "light" | "dark" = "light";
    titlebarStyle: "custom" | "native" = "custom";
    autoSaveOnPageSwitch = true;
    autoSave = false;
    autoSaveInterval = 5;
}

class EditorPrefs {
    codeBlockTheme = "github-dark-dimmed";
    useTypographyExtension = false;
    border = true;
    width: "md" | "lg" | "xl" = "md";
    spellcheck = true;
    zoom = 1.0;
    openPDFonExport = true;
    recentCodeLangs: string[] = [];
    codeWordWrap = false;
    tabSize = 4;
    toolbarSize: "sm" | "md" | "lg" = "md";
    customTextStyles: Record<string, Record<string, string>> = {
        Normal: {
            "tag": "p",
            "font-size": "default",
            "font-weight": "normal",
            "font-style": "normal",
            "color": "inherit"
        },
        "Heading 1": {
            "tag": "h1",
            "font-size": "32px",
            "font-weight": "bold",
        },
        "Heading 2": {
            "tag": "h2",
            "font-size": "24px",
            "font-weight": "bold",
        },
        Subtitle: {
            "tag": "p",
            "font-size": "18px",
            "color": "gray",
            "font-style": "italic",
        },
        Quote: {
            "tag": "blockquote",
            "font-size": "16px",
            "font-style": "italic",
            "background-color": "#f0f0f0",
            "padding": "4px 8px",
            "border-left": "4px solid #ccc"
        },
        Highlight: {
            "background-color": "#ffff00",
            "color": "#000000"
        }
    };
    revisionNoteStyle: Record<string, string> = {
        "background-color": "rgba(255, 235, 59, 0.3)",
        "color": "inherit",
        "border-bottom": "2px dashed #fbc02d"
    };
}

class MiscPrefs {
    lastOpenedVersion = "0.0.0";
}

export class Prefs {
    general = new GeneralPrefs();
    editor = new EditorPrefs();
    misc = new MiscPrefs();
}
