/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @see https://github.com/jcv8000/Codex/blob/v1.4.2/renderer.js
 */

export class UserPrefs {
    theme = "0";
    codeStyle = "atom-one-dark";
    accentColor = "#FF7A27";
    defaultZoom = 1.0;
    defaultMaximized = false;
    dataDir = ""; // defaultDataDir
    pdfBreakOnH1 = false;
    pdfDarkMode = false;
    openPDFonExport = true;
    openedNotebooks: number[] = []; // number?
    tabSize = 4;
    sidebarWidth = 275;
    showCodeOverlay = true;
    codeWordWrap = false;
    firstUse = true;
    showMenuBar = true;
}
