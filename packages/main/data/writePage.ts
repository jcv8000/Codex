import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import isDev from "electron-is-dev";

export function writePage(saveFolderPath: string, pageFileName: string, data: string) {
    if (!existsSync(join(saveFolderPath, "/notes/"))) mkdirSync(join(saveFolderPath, "/notes/"));

    const filePath = join(saveFolderPath, "/notes/", pageFileName);
    writeFileSync(filePath, data, "utf-8");

    if (isDev) console.log(`Wrote page data to ${pageFileName} successfully`);
}
