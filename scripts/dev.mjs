import { spawn } from "child_process";
import { build } from "vite";
import electron from "electron";
import waitOn from "wait-on";
import { rimraf } from "rimraf";

function startElectron() {
    electronApp = spawn(electron, ["."], { stdio: "pipe" });
    electronApp.addListener("exit", () =>
        console.log(
            "Electron process has exited. Press Enter to restart the app, or Ctrl+C to kill the dev process."
        )
    );

    // Blocks electron's stderr because it just spams the console
    electronApp.stdout.setEncoding("utf8");
    electronApp.stdout.on("data", (data) => {
        const text = data.toString().trim();
        if (text != "" && text != "\n") {
            console.log(text);
        }
    });

    electronApp.stderr.setEncoding("utf8");
    electronApp.stderr.on("data", (data) => {
        const text = data.toString();
        if (!text.includes("Attempting to call a function in a renderer")) {
            console.log(text.trim());
        }
    });
}

function restartElectron() {
    if (electronApp !== null && killable) {
        electronApp.removeListener("exit", process.exit);
        electronApp.kill("SIGINT");

        startElectron();

        console.log("Restarting app...");
    }
}

rimraf(".vite/");

// Start renderer dev server
const server = spawn("pnpm exec vite dev -c packages/renderer/vite.config.ts", {
    shell: true
});
server.stdout.setEncoding("utf8");
server.stdout.on("data", (data) => {
    console.log(data.toString().trim());
});
server.stderr.setEncoding("utf8");
server.stderr.on("data", (data) => {
    console.log(data.toString().trim());
});

/** @type {import('node:child_process').ChildProcess} */
let electronApp = null;
let killable = false;

// Preload
console.log("Building preload...");
await build({
    configFile: "packages/preload/vite.config.ts",
    mode: "development",
    clearScreen: false,
    plugins: [
        {
            name: "electron-preload-watcher",
            closeBundle() {
                restartElectron();
            }
        }
    ],
    build: {
        watch: {},
        sourcemap: "inline",
        minify: false
    }
});

// Main
console.log("Building main...");
await build({
    configFile: "packages/main/vite.config.ts",
    mode: "development",
    clearScreen: false,
    plugins: [
        {
            name: "electron-main-watcher",
            closeBundle() {
                restartElectron();
            }
        }
    ],
    build: {
        watch: {},
        sourcemap: "inline",
        minify: false
    }
});

// Wait for everything to be ready
await waitOn({
    resources: ["http-get://127.0.0.1:5173/", ".vite/index.cjs", ".vite/preload.cjs"],
    headers: {
        Accept: "text/x-vite-ping"
    }
});

startElectron();
killable = true;

console.log("Press enter to restart application.");
process.stdin.addListener("data", () => {
    restartElectron();
});
