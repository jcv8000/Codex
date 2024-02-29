import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

export function writePage(saveFolderPath: string, pageFileName: string, data: string) {
    if (!existsSync(join(saveFolderPath, "/notes/"))) mkdirSync(join(saveFolderPath, "/notes/"));

    const filePath = join(saveFolderPath, "/notes/", pageFileName);
    writeFileSync(filePath, data, "utf-8");
}
