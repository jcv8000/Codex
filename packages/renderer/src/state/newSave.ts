import { v4 as uuid } from "@lukeed/uuid";

type NoteItemBase = {
    name: string;
    id: string;
    color: string;
    icon: string;
};

export type Page = NoteItemBase & {
    fileName: string;
    textContent: string;
    favorited: boolean;
};

export type Folder = NoteItemBase & {
    children: NoteItem[];
    opened: boolean;
};

export type NoteItem = Folder | Page;

export type Save = {
    schema_version: number;
    items: NoteItem[];
};

export function getParent(save: Save, item: NoteItem): Folder | null {
    const recurse = (i: NoteItem) => {
        if ("children" in i) {
            if (i.children.includes(item)) return i;
            i.children.forEach((c) => recurse(c));
        }
    };

    save.items.forEach((i) => recurse(i));
    return null;
}

export function deleteItem(save: Save, item: NoteItem): boolean {
    const parent = getParent(save, item);
    if (parent == null) return false;

    const i = parent.children.indexOf(item);
    if (i == -1) return false;

    parent.children.splice(i, 1);
    return true;
}

export const defaultSave: Save = {
    schema_version: 1,
    items: [
        {
            name: "CS 324",
            id: uuid(),
            color: "#000000",
            icon: "book-2",
            children: [
                {
                    name: "Intro",
                    id: uuid(),
                    color: "#ff0000",
                    icon: "brand-windows",
                    fileName: "",
                    textContent: "",
                    favorited: false
                }
            ],
            opened: false
        }
    ]
};
