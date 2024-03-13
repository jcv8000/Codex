import { v4 as NewUUID } from "@lukeed/uuid";
import sanitizeFileName from "sanitize-filename";

function pageNameToFileName(pageName: string) {
    let answer = sanitizeFileName(pageName.replaceAll(" ", "-"));

    if (answer.length > 30) answer = answer.substring(0, 29);

    return answer.replace(/[^a-zA-Z0-9-]/g, "").trim();
}

export class NoteItem {
    name: string;
    id: string;
    color = "#000000";
    icon = "book-2";

    parent: Folder | null = null;

    constructor(name: string, parent: Folder | null) {
        this.name = name;
        this.id = NewUUID();
        this.parent = parent;
        parent?.children.push(this);
    }
}

export class Page extends NoteItem {
    fileName: string;
    textContent = "";
    favorited = false;

    constructor(name: string, parent: Folder | null) {
        super(name, parent);
        this.color = "#999999";
        this.icon = "file-text";
        this.fileName = pageNameToFileName(name + "_" + this.id + ".json");
    }
}

export class Folder extends NoteItem {
    children: NoteItem[] = [];
    opened = false;
}

export class Save {
    schema_version = 1;

    static currentSaveSchema = 1;

    items: NoteItem[] = [];

    dragDropItem(item: NoteItem, target: NoteItem, where: "above" | "below" | "child") {
        const isItemTopLevel = item.parent === null;
        const isTargetTopLevel = target.parent === null;

        if (isItemTopLevel) this.items.splice(this.items.indexOf(item), 1);
        else {
            const parent = item.parent as Folder;
            parent.children.splice(parent.children.indexOf(item), 1);
        }

        if (isTargetTopLevel) {
            if (where == "above") {
                this.items.splice(this.items.indexOf(target), 0, item);
                item.parent = null;
            } else if (where == "below") {
                this.items.splice(this.items.indexOf(target) + 1, 0, item);
                item.parent = null;
            } else if (where == "child" && target instanceof Folder) {
                target.children.push(item);
                item.parent = target;
            }
        } else {
            const parent = target.parent as Folder;

            if (where == "above") {
                parent.children.splice(parent.children.indexOf(target), 0, item);
                item.parent = parent;
            } else if (where == "below") {
                parent.children.splice(parent.children.indexOf(target) + 1, 0, item);
                item.parent = parent;
            } else if (where == "child" && target instanceof Folder) {
                target.children.push(item);
                item.parent = target;
                target.opened = true;
            }
        }
    }

    static isDescendantOf(descendant: NoteItem, ancestor: NoteItem): boolean {
        let i = descendant;

        while (i.parent != null) {
            if (i.parent == ancestor) return true;
            else i = i.parent;
        }

        return false;
    }

    static stringify(s: Save): string {
        const obj = JSON.parse(
            JSON.stringify(s, (key, value) => {
                if (key == "parent") return undefined;
                else return value;
            })
        );

        return JSON.stringify(obj);
    }

    static parse(text: string): Save {
        const obj = JSON.parse(text);
        const save = new Save();

        save.schema_version = obj.schema_version;

        function addChild(obj: any, parent: Folder | null) {
            if (obj.children) {
                const f = new Folder(obj.name, parent);
                f.id = obj.id;
                f.color = obj.color;
                f.icon = obj.icon;
                f.opened = obj.opened;

                if (parent == null) save.items.push(f);

                obj.children.forEach((child: any) => {
                    addChild(child, f);
                });
            } else {
                const p = new Page(obj.name, parent);
                p.id = obj.id;
                p.color = obj.color;
                p.icon = obj.icon;
                p.fileName = obj.fileName;
                p.textContent = obj.textContent;

                if (parent == null) save.items.push(p);
            }
        }

        obj.items.forEach((item: any) => {
            addChild(item, null);
        });

        return save;
    }
}

// Example save

const f1 = new Folder("My Notes", null);
f1.opened = true;

new Page("Example Note", f1);

export const exampleSave = new Save();
exampleSave.items.push(f1);
