import { app, session } from "electron";

export function electronSecurity() {
    app.on("web-contents-created", (_event, contents) => {
        contents.on("will-navigate", (event) => {
            event.preventDefault();
        });
    });

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                "Content-Security-Policy": [
                    "default-src 'self' 'unsafe-inline'; img-src 'self' https://* http://* data: 'unsafe-eval'; font-src 'self' 'unsafe-inline' data: 'unsafe-eval'"
                ]
            }
        });
    });
}
