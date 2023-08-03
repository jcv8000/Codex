import sanitizeFileName from "sanitize-filename";

export function truncate(input: string, maxLength: number): string {
    if (input.length > maxLength) {
        const result = input.substring(0, maxLength - 3) + "...";

        return result;
    }

    return input;
}

export function pageNameToFileName(pageName: string) {
    let answer = sanitizeFileName(pageName.replaceAll(" ", "-"));

    if (answer.length > 30) answer = answer.substring(0, 29);

    return answer.replace(/[^a-zA-Z0-9-]/g, "").trim();
}

export function sanitizeStringForFileName(input: string): string {
    const answer = sanitizeFileName(input);

    return answer.replace(/[^a-zA-Z0-9- ]/g, "").trim();
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return { r, g, b };
}

export function rgbToHex(rgb: { r: number; g: number; b: number }): string {
    let _r = rgb.r.toString(16);
    let _g = rgb.g.toString(16);
    let _b = rgb.b.toString(16);

    if (_r.length == 1) _r = "0" + _r;

    if (_g.length == 1) _g = "0" + _g;

    if (_b.length == 1) _b = "0" + _b;
    return "#" + _r + _g + _b;
}
