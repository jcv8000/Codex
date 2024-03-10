import { dialog, app } from "electron";
import log from "electron-log/main";

export function setupLogger() {
    log.errorHandler.startCatching({
        showDialog: false,
        onError({ createIssue, error, processType, versions }) {
            if (processType === "renderer") {
                return;
            }

            dialog
                .showMessageBox({
                    title: "An error occurred",
                    message: error.message,
                    detail: error.stack,
                    type: "error",
                    buttons: ["Ignore", "Report", "Exit"]
                })
                .then((result) => {
                    if (result.response === 1) {
                        createIssue("https://github.com/jcv8000/Codex/issues/new", {
                            title: `Error report for ${versions.app}`,
                            body: "Error:\n```" + error.stack + "\n```\n" + `OS: ${versions.os}`
                        });
                        return;
                    }

                    if (result.response === 2) {
                        app.quit();
                    }
                });
        }
    });
}

export function logError(message: string, detail: string) {
    log.error(message + "\n" + detail);
    dialog.showMessageBoxSync({
        title: "Codex",
        message: message,
        detail: detail,
        type: "error"
    });
}
