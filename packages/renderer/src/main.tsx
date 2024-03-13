import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { writePrefs, writeSave } from "./state";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

window.ipc.on("pre-exit", () => {
    writeSave();
    writePrefs();
    window.ipc.invoke("exit");
});
