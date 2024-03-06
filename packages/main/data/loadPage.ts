import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import isDev from "electron-is-dev";

export function loadPage(saveFolderPath: string, pageFileName: string): string {
    if (!existsSync(join(saveFolderPath, "/notes/"))) mkdirSync(join(saveFolderPath, "/notes/"));

    const filePath = join(saveFolderPath, "/notes/", pageFileName);

    if (existsSync(filePath)) {
        const data = readFileSync(filePath, "utf-8").toString();

        if (isDev) console.log(`Read page data from ${pageFileName} successfully`);

        return data;
    } else {
        const data = '{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"}}]}';
        writeFileSync(filePath, data, "utf-8");

        if (isDev) console.log(`Page file ${pageFileName} not found, new empty file`);

        return data;
    }
}
