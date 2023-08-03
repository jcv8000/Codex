import { dialog, app } from "electron";
import log from "electron-log";

export function setupLogger() {
    log.catchErrors({
        showDialog: false,
        onError(error, versions, submitIssue) {
            dialog
                .showMessageBox({
                    title: "An error occurred",
                    message: error.message,
                    detail: error.stack,
                    type: "error",
                    buttons: ["Report", "Exit"]
                })
                .then((result) => {
                    if (result.response === 0) {
                        if (submitIssue && versions)
                            submitIssue("https://github.com/jcv8000/Codex/issues/new", {
                                title: `Error report for ${versions.app}`,
                                body: "Error:\n```" + error.stack + "\n```\n" + `OS: ${versions.os}`
                            });
                        return;
                    }

                    if (result.response === 1) {
                        app.quit();
                    }
                });
        }
    });
}

export function logError(message: string, detail: string) {
    log.error(message + "\n" + detail);
    dialog.showMessageBoxSync({
        title: "Error",
        message: message,
        detail: detail,
        type: "error"
    });
}
