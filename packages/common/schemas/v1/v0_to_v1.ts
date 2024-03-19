import { Save as Save_v0, Notebook as Notebook_v0, Page as Page_v0 } from "common/schemas/v0/Save";
import { Save as Save_v1, Folder as Folder_v1, Page as Page_v1 } from "./Save";
import { UserPrefs as Prefs_v0 } from "common/schemas/v0/Prefs";
import { Prefs as Prefs_v1 } from "./Prefs";
import { v4 as uuid } from "@lukeed/uuid";
import { join } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

export function is_prefs_v0(prefs: any): prefs is Prefs_v0 {
    return prefs["dataDir"] != undefined;
}

export function is_save_v0(save: any): save is Save_v0 {
    return save["schema_version"] == undefined;
}

export function convert_prefs_v0_to_v1(old: Prefs_v0): Prefs_v1 {
    const prefs = new Prefs_v1();

    if (old.dataDir != undefined && old.dataDir != "") {
        prefs.general.saveFolder = old.dataDir;
    }
    if (old.accentColor != undefined && old.accentColor != "") {
        prefs.general.accentColor = old.accentColor;
    }

    return prefs;
}

export function convert_save_v0_to_v1(old: Save_v0, saveFolderPath: string): Save_v1 {
    const save = new Save_v1();
    save.schema_version = 1;
    const notebooks = old.notebooks;

    notebooks.forEach((nb: Notebook_v0) => {
        const f = new Folder_v1(nb.name, null);

        f.color = nb.color;
        f.icon = replaceFeatherWithTabler(nb.icon);
        f.id = uuid();

        nb.pages.forEach((child: Page_v0) => {
            const p = new Page_v1(child.title, f);
            p.fileName = child.fileName;
            p.favorited = child.favorite;

            const docFilePath = join(saveFolderPath, "/notes/", p.fileName);
            if (existsSync(docFilePath)) {
                // Convert old page to new format
                const doc = JSON.parse(
                    readFileSync(join(saveFolderPath, "/notes/", p.fileName), "utf-8")
                );
                convertOldPage(doc);

                writePage(saveFolderPath, p.fileName, JSON.stringify(doc));

                p.textContent = getText(doc);
            }
        });

        save.items.push(f);
    });

    return save;
}

function writePage(saveFolderPath: string, pageFileName: string, data: string) {
    if (!existsSync(join(saveFolderPath, "/notes/"))) mkdirSync(join(saveFolderPath, "/notes/"));

    const filePath = join(saveFolderPath, "/notes/", pageFileName);
    writeFileSync(filePath, data, "utf-8");
}

/**
 * Recursively traverses the entire Prosemirror doc object and converts old properties to the new version, in-place
 */
function convertOldPage(doc: any) {
    function recurseChildNodes(node: any) {
        if (node["type"] == "code_block") {
            node["type"] = "codeBlock";
            if (node["attrs"] !== undefined && node["attrs"]["params"] !== undefined) {
                node["attrs"] = { language: node["attrs"]["params"] };
            }
        } else if (node["type"] == "table_cell") {
            node["type"] = "tableCell";
        } else if (node["type"] == "table_row") {
            node["type"] = "tableRow";
        } else if (node["type"] == "list_item") {
            node["type"] = "listItem";
        } else if (node["type"] == "bullet_list") {
            node["type"] = "bulletList";
        } else if (node["type"] == "table_header") {
            node["type"] = "tableHeader";
        } else if (node["type"] == "ordered_list") {
            node["type"] = "orderedList";
        } else if (node["type"] == "horizontal_rule") {
            node["type"] = "horizontalRule";
        } else if (node["type"] == "math_inline") {
            node["type"] = "mathInline";
            node["attrs"] = {};
            node["attrs"]["text"] = node["content"][0]["text"];
            delete node["content"];
        } else if (node["type"] == "math_display") {
            node["type"] = "mathBlock";
            node["attrs"] = {};
            node["attrs"]["text"] = node["content"][0]["text"];
            delete node["content"];
        }

        if (node["attrs"] && node["attrs"]["class"]) {
            if (node["attrs"]["class"] == "pm-align--left") {
                delete node["attrs"]["class"];
                node["attrs"]["textAlign"] = "left";
            }
            if (node["attrs"]["class"] == "pm-align--center") {
                delete node["attrs"]["class"];
                node["attrs"]["textAlign"] = "center";
            }
            if (node["attrs"]["class"] == "pm-align--right") {
                delete node["attrs"]["class"];
                node["attrs"]["textAlign"] = "right";
            }
        }

        if (node["marks"] !== undefined) {
            node["marks"].forEach((mark: any) => {
                if (mark["type"] == "strong") mark["type"] = "bold";
                else if (mark["type"] == "em") mark["type"] = "italic";
            });
        }

        if (node["content"] !== undefined) {
            node["content"].forEach((node: any) => {
                recurseChildNodes(node);
            });
        }
    }

    doc["content"].forEach((node: any) => {
        recurseChildNodes(node);
    });
}

function getText(doc: any) {
    let text = "";
    function recurseChildNodes(node: any) {
        if (node.type == "text") {
            text += node.text + " ";
        }

        if (node.content != undefined) {
            node.content.forEach((child: any) => {
                recurseChildNodes(child);
            });
        }
    }

    doc.content.forEach((node: any) => {
        recurseChildNodes(node);
    });

    return text;
}

function replaceFeatherWithTabler(featherIcon: string) {
    const s = featherIcon;

    // Common
    if (s == "arrow-down-circle") return "circle-arrow-down";
    else if (s == "arrow-left-circle") return "circle-arrow-left";
    else if (s == "arrow-right-circle") return "circle-arrow-right";
    else if (s == "arrow-up-circle") return "circle-arrow-up";
    else if (s == "book") return "book-2";
    else if (s == "columns") return "columns-2";
    else if (s == "compass") return "brand-safari";
    else if (s == "crosshair")
        return "crosshair"; // eh
    else if (s == "disc")
        return "disc"; // maybe "vinyl" or "playstation-circle"
    else if (s == "globe") return "world";
    else if (s == "layout") return "table";
    else if (s == "menu") return "menu-2";
    else if (s == "navigation") return "location";
    else if (s == "radio") return "broadcast";
    else if (s == "share-2") return "share";
    else if (s == "share") return "share-2";
    else if (s == "slash") return "circle-off";
    else if (s == "thermometer") return "temperature";
    else if (s == "volume-2") return "volume";
    else if (s == "volume") return "volume-2";

    // Missing
    if (s == "airplay") return "cast";
    else if (s == "align-justify") return "align-justified";
    else if (s == "at-sign") return "at";
    else if (s == "bar-chart-2") return "chart-bar";
    else if (s == "bar-chart") return "chart-bar";
    else if (s == "book-open") return "book";
    else if (s == "check-circle") return "circle-check";
    else if (s == "check-square") return "checkbox";
    else if (s == "chrome") return "brand-chrome";
    else if (s == "cloud-drizzle") return "cloud-rain";
    else if (s == "cloud-lightning") return "cloud-storm";
    else if (s == "codepen") return "brand-codepen";
    else if (s == "codesandbox") return "brand-codesandbox";
    else if (s == "delete") return "backspace";
    else if (s == "divide-circle") return "divide";
    else if (s == "divide-square") return "divide";
    else if (s == "dollar-sign") return "currency-dollar";
    else if (s == "download-cloud") return "cloud-download";
    else if (s == "dribble") return "ball-basketball";
    else if (s == "edit-2") return "pencil";
    else if (s == "edit-3") return "pencil-minus";
    else if (s == "facebook") return "brand-facebook";
    else if (s == "fast-forward") return "player-track-next";
    else if (s == "figma") return "brand-figma";
    else if (s == "film") return "movie";
    else if (s == "framer") return "brand-framer";
    else if (s == "frown") return "mood-sad";
    else if (s == "github") return "brand-github";
    else if (s == "gitlab") return "brand-gitlab";
    else if (s == "grid") return "layout-grid";
    else if (s == "hard-drive")
        return "server"; // this one sucks
    else if (s == "image") return "photo";
    else if (s == "info") return "info-circle";
    else if (s == "instagram") return "brand-instagram";
    else if (s == "layers") return "stack-2";
    else if (s == "life-buoy") return "lifebuoy";
    else if (s == "link-2") return "link";
    else if (s == "linkedin") return "brand-linkedin";
    else if (s == "log-in") return "login";
    else if (s == "log-out") return "logout";
    else if (s == "maximize-2") return "arrows-diagonal";
    else if (s == "meh") return "mood-empty";
    else if (s == "message-square") return "message-dots";
    else if (s == "mic-off") return "microphone-off";
    else if (s == "mic") return "microphone";
    else if (s == "minimize-2") return "arrows-diagonal-minimize-2";
    else if (s == "minus-circle") return "circle-minus";
    else if (s == "minus-square") return "square-minus";
    else if (s == "monitor") return "device-desktop";
    else if (s == "more-horizontal") return "dots";
    else if (s == "more-vertical") return "dots-vertical";
    else if (s == "mouse-pointer") return "pointer";
    else if (s == "move") return "arrows-move";
    else if (s == "navigation-2") return "navigation";
    else if (s == "pause-circle")
        return "clock-pause"; // sucks
    else if (s == "pause") return "player-pause";
    else if (s == "pen-tool") return "ballpen";
    else if (s == "percent") return "percentage";
    else if (s == "phone-forwarded") return "phone-outgoing";
    else if (s == "phone-missed") return "phone-x";
    else if (s == "pie-chart") return "chart-pie";
    else if (s == "play-circle")
        return "clock-play"; // sucks
    else if (s == "play") return "player-play";
    else if (s == "plus-circle") return "circle-plus";
    else if (s == "plus-square") return "square-plus";
    else if (s == "pocket") return "brand-pocket";
    else if (s == "refresh-ccw") return "refresh";
    else if (s == "refresh-cw")
        return "rotate-clockwise"; // sucks
    else if (s == "rewind") return "player-track-prev";
    else if (s == "rotate-ccw") return "rotate";
    else if (s == "rotate-cw") return "rotate-clockwise";
    else if (s == "save") return "device-floppy";
    else if (s == "shuffle") return "arrows-cross";
    else if (s == "sidebar") return "layout-sidebar";
    else if (s == "skip-back") return "player-skip-back";
    else if (s == "skip-forward") return "player-skip-forward";
    else if (s == "slack") return "brand-slack";
    else if (s == "sliders") return "adjustments";
    else if (s == "smartphone") return "device-mobile";
    else if (s == "smile") return "mood-smile";
    else if (s == "speaker") return "device-speaker";
    else if (s == "stop-circle") return "clock-stop";
    else if (s == "tablet") return "device-tablet";
    else if (s == "thumbs-down") return "thumb-down";
    else if (s == "thumbs-up") return "thumb-up";
    else if (s == "trash-2") return "trash";
    else if (s == "trello") return "brand-trello";
    else if (s == "tv") return "device-tv";
    else if (s == "twitch") return "brand-twitch";
    else if (s == "twitter") return "brand-twitter";
    else if (s == "type") return "text-size";
    else if (s == "unlock") return "lock-open";
    else if (s == "upload-cloud") return "cloud-upload";
    else if (s == "voicemail") return "record-mail";
    else if (s == "volume-1") return "volume-2";
    else if (s == "volume-x") return "volume-3";
    else if (s == "watch") return "device-watch";
    else if (s == "x-circle") return "circle-x";
    else if (s == "x-octagon")
        return "circle-x"; // sucks
    else if (s == "x-square") return "square-x";
    else if (s == "youtube") return "brand-youtube";
    else if (s == "zap-off") return "bolt-off";
    else if (s == "zap") return "bolt";

    return s;
}
