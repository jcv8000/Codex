import { BrowserWindow, app, screen } from "electron";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const filePath = join(app.getPath("userData"), "window-state.json");

type WindowState = {
    x: number;
    y: number;
    width: number;
    height: number;
    maximized: boolean;
};

function isVisibleOnSomeDisplay(windowState: WindowState) {
    const visible = screen.getAllDisplays().some((display) => {
        return windowWithinBounds(windowState, display.bounds);
    });

    return visible;
}

function windowWithinBounds(windowState: WindowState, bounds: Electron.Rectangle) {
    return (
        windowState.x >= bounds.x &&
        windowState.y >= bounds.y &&
        windowState.x + windowState.width <= bounds.x + bounds.width &&
        windowState.y + windowState.height <= bounds.y + bounds.height
    );
}

export function loadWindowState() {
    const DEFAULT_WIDTH = 1280;
    const DEFAULT_X = screen.getPrimaryDisplay().bounds.width / 2 - DEFAULT_WIDTH / 2;
    const DEFAULT_HEIGHT = 720;
    const DEFAULT_Y = screen.getPrimaryDisplay().bounds.height / 2 - DEFAULT_HEIGHT / 2;

    const state: WindowState = {
        x: DEFAULT_X,
        y: DEFAULT_Y,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        maximized: false
    };

    try {
        const read = JSON.parse(readFileSync(filePath, "utf-8").toString());

        // TODO just use the spread operator and merge the objects
        if (
            read.x != undefined &&
            read.y != undefined &&
            read.width != undefined &&
            read.height != undefined &&
            read.maximized != undefined
        ) {
            state.x = read.x;
            state.y = read.y;
            state.width = read.width;
            state.height = read.height;
            state.maximized = read.maximized;
        }
    } catch (e) {
        state.x = DEFAULT_X;
        state.y = DEFAULT_Y;
        state.width = DEFAULT_WIDTH;
        state.height = DEFAULT_HEIGHT;
        state.maximized = false;
    }

    if (!isVisibleOnSomeDisplay(state)) {
        state.x = DEFAULT_X;
        state.y = DEFAULT_Y;
        state.width = DEFAULT_WIDTH;
        state.height = DEFAULT_HEIGHT;
        state.maximized = false;
    }

    return state;
}

export function saveWindowState(window: BrowserWindow) {
    const bounds = window.getContentBounds();
    const newState: WindowState = {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        maximized: window.isMaximized()
    };
    writeFileSync(filePath, JSON.stringify(newState), "utf-8");
}
