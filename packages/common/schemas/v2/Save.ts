import { v4 as uuid } from "@lukeed/uuid";
import { generatePageFileName } from "../../Utils";

type NoteItemBase = {
    name: string;
    id: string;
    icon: string;
    color: string;
};

export type Page = NoteItemBase & {
    fileName: string;
    // TODO move textContent to a separate text file Map
    textContent: string;
    favorited: boolean;
    tags: string[];
    lastModified: number;
};

export type Folder = NoteItemBase & {
    opened: boolean;
    children: NoteItem[];
};

export type NoteItem = Page | Folder;

export type Tag = { id: string; name: string; color: string };

export type Save = { schema_version: number; tags: Tag[]; items: NoteItem[] };

export function isPage(item: Readonly<NoteItem>): item is Readonly<Page> {
    return (item as Page).fileName !== undefined;
}

export function isFolder(item: Readonly<NoteItem>): item is Readonly<Folder> {
    return (item as Folder).opened !== undefined;
}

function bfs(save: Save, predicate: (item: NoteItem) => boolean): NoteItem | undefined {
    const queue: NoteItem[] = [];

    save.items.forEach((item) => {
        queue.push(item);
    });

    while (queue.length > 0) {
        const i = queue.shift();
        if (i == undefined) return undefined;

        if (predicate(i)) return i;

        if (isFolder(i)) {
            i.children.forEach((c) => {
                queue.push(c);
            });
        }
    }

    return undefined;
}

export function getParent(save: Save, id: string): Folder | undefined {
    const parent = bfs(save, (i) => {
        if (isFolder(i)) {
            for (let x = 0; x < i.children.length; x++) {
                if (i.children[x].id == id) {
                    return true;
                }
            }
        }
        return false;
    });

    if (parent == undefined) return undefined;
    else if (isFolder(parent)) return parent;
}

export function getItemFromID(save: Save, id: string) {
    return bfs(save, (i) => i.id == id);
}

export function isDescendantOf(descendant: NoteItem, ancestor: NoteItem) {
    if (isPage(ancestor)) return false;

    const queue: NoteItem[] = [];

    ancestor.children.forEach((item) => {
        queue.push(item);
    });

    while (queue.length > 0) {
        const i = queue.shift();
        if (i == undefined) return false;

        if (i.id == descendant.id) return true;

        if (isFolder(i)) {
            i.children.forEach((c) => {
                queue.push(c);
            });
        }
    }

    return false;
}

// vvvvvvvvvvvv
//
// EXAMPLE SAVE
//
// vvvvvvvvvvvv

const _pageId = uuid();
const _tagId = uuid();
const _page: Page = {
    name: "intro",
    id: _pageId,
    icon: "file-text",
    color: "#999999",
    favorited: false,
    textContent: "",
    fileName: generatePageFileName("intro", _pageId),
    tags: [_tagId],
    lastModified: Date.now()
};

const _folder: Folder = {
    name: "CS 432",
    id: uuid(),
    icon: "book-2",
    color: "#000000",
    opened: true,
    children: [_page]
};

export const exampleSave: Save = {
    schema_version: 2,
    tags: [
        { id: _tagId, name: "OOP", color: "#800080" },
        { id: uuid(), name: "Networking", color: "#FF0000" }
    ],
    items: [_folder]
};
