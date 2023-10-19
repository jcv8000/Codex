import { SupportedLocales } from "./Locales";

class GeneralPrefs {
    saveFolder = "";
    accentColor = "#ff7926";
    sidebarWidth = 300;
    locale: SupportedLocales = "en_US";
    theme: "light" | "dark" = "light";
    titlebarStyle: "custom" | "native" = "custom";
    showSaveNotifOnPageSwitch = false;
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
}

class MiscPrefs {
    lastOpenedVersion = "0.0.0";
}

export class Prefs {
    general = new GeneralPrefs();
    editor = new EditorPrefs();
    misc = new MiscPrefs();
}
