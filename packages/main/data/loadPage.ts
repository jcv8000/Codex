import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

export function loadPage(saveFolderPath: string, pageFileName: string): string {
    if (!existsSync(join(saveFolderPath, "/notes/"))) mkdirSync(join(saveFolderPath, "/notes/"));

    const filePath = join(saveFolderPath, "/notes/", pageFileName);

    if (existsSync(filePath)) {
        return readFileSync(filePath, "utf-8").toString();
    } else {
        const data = '{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"}}]}';
        writeFileSync(filePath, data, "utf-8");
        return data;
    }
}
