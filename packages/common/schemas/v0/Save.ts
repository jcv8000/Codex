/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @see https://github.com/jcv8000/Codex/blob/v1.4.2/renderer.js
 */

export class Save {
    nextPageIndex = 0;
    notebooks: Notebook[] = [];
}

export class Notebook {
    name: string;
    color: string;
    icon = "book";
    pages: Page[] = [];
    constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
        this.pages = [];
    }
}

export class Page {
    title: string;
    fileName: string;
    favorite = false;
    constructor(title: string) {
        this.title = title;
        this.fileName = "";
    }
}
