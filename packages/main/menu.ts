import { app, BrowserWindow, Menu, MenuItemConstructorOptions, shell } from "electron";
import isDev from "electron-is-dev";
import { openAboutWindow } from "./about";
import { Locale } from "common/Locales";

const isMac = process.platform === "darwin";

export const menu = (window: BrowserWindow, locale: Locale) =>
    Menu.buildFromTemplate([
        // { role: 'appMenu' }
        ...((isMac
            ? [
                  {
                      label: app.name,
                      submenu: [
                          {
                              label: locale.menus.about + " Codex",
                              click: () => openAboutWindow(window)
                          },
                          { type: "separator" },
                          { role: "services" },
                          { type: "separator" },
                          { role: "hide" },
                          { role: "hideothers" },
                          { role: "unhide" },
                          { type: "separator" },
                          { role: "quit" }
                      ]
                  }
              ]
            : []) as MenuItemConstructorOptions[]),
        // { role: 'fileMenu' }
        {
            label: "File",
            submenu: [
                isMac ? { role: "close" } : { role: "quit" },
                { type: "separator" },
                {
                    label: locale.menus.save_current_page,
                    accelerator: "CmdOrCtrl+S",
                    click: () => window.webContents.send("SAVE_ACTIVE_PAGE")
                },
                {
                    label: locale.menus.export_page_to_pdf,
                    accelerator: "CmdOrCtrl+P",
                    click: () => window.webContents.send("MENU_EXPORT_PAGE_PDF")
                }
            ] as MenuItemConstructorOptions[]
        },
        // { role: 'editMenu' }
        {
            label: "Edit",
            submenu: [
                { role: "undo" },
                { role: "redo" },
                { type: "separator" },
                { role: "cut" },
                { role: "copy" },
                { role: "paste" },
                ...((isMac
                    ? [
                          { role: "pasteAndMatchStyle" },
                          { role: "delete" },
                          { role: "selectAll" },
                          { type: "separator" },
                          {
                              label: "Speech",
                              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }]
                          }
                      ]
                    : [
                          { role: "delete" },
                          { type: "separator" },
                          { role: "selectAll" }
                      ]) as MenuItemConstructorOptions[])
            ]
        },
        // { role: 'viewMenu' }
        {
            label: "View",
            submenu: [
                ...((isDev
                    ? [{ role: "reload" }, { role: "forceReload" }]
                    : []) as MenuItemConstructorOptions[]),
                { role: "toggleDevTools" },
                { type: "separator" },
                {
                    label: locale.menus.zoom_in_editor,
                    accelerator: "CmdOrCtrl+=",
                    click: () => window.webContents.send("MENU_ZOOM_IN")
                },
                {
                    label: locale.menus.zoom_out_editor,
                    accelerator: "CmdOrCtrl+-",
                    click: () => window.webContents.send("MENU_ZOOM_OUT")
                },
                {
                    label: locale.menus.reset_editor_zoom,
                    accelerator: "CmdOrCtrl+R",
                    click: () => window.webContents.send("MENU_ZOOM_RESET")
                },
                {
                    label: locale.menus.toggle_editor_toolbar,
                    accelerator: "CmdOrCtrl+T",
                    click: () => window.webContents.send("MENU_TOGGLE_EDITOR_TOOLBAR")
                },
                { type: "separator" },
                {
                    label: locale.menus.toggle_sidebar,
                    accelerator: "CmdOrCtrl+D",
                    click: () => window.webContents.send("MENU_TOGGLE_SIDEBAR")
                },
                {
                    label: locale.menus.reset_sidebar_width,
                    click: () => window.webContents.send("MENU_RESET_SIDEBAR_WIDTH")
                },
                { type: "separator" },
                { role: "togglefullscreen" }
            ]
        },
        // { role: 'windowMenu' }
        {
            label: "Window",
            submenu: [
                { role: "minimize" },
                ...((isMac
                    ? [
                          { type: "separator" },
                          { role: "front" },
                          { type: "separator" },
                          { role: "window" }
                      ]
                    : [{ role: "close" }]) as MenuItemConstructorOptions[])
            ]
        },
        {
            role: "help",
            submenu: [
                {
                    label: locale.menus.help_docs,
                    accelerator: "F1",
                    click: () => shell.openExternal("https://codexnotes.com/docs/")
                },
                {
                    label: locale.menus.website,
                    click: () => shell.openExternal("https://codexnotes.com/")
                },
                {
                    label: locale.menus.changelogs,
                    click: () => shell.openExternal("https://codexnotes.com/updates/")
                },
                { type: "separator" },
                { label: locale.menus.about, click: () => openAboutWindow(window) }
            ]
        }
    ]);
