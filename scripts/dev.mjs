import { spawn } from "child_process";
import { build, createServer } from "vite";
import electron from "electron";

/** @type {import('node:child_process').ChildProcess} */
let electronApp = null;
let killable = false;

process.env.NODE_ENV = "DEVELOPMENT";

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

// Preload
console.log("Building preload...");
await build({
    configFile: "packages/preload/vite.config.ts",
    clearScreen: false,
    build: {
        sourcemap: "inline",
        minify: false
    }
});

// Main
console.log("Building main...");
await build({
    configFile: "packages/main/vite.config.ts",
    clearScreen: false,
    build: {
        sourcemap: "inline",
        minify: false
    }
});

// Renderer
const server = await createServer({
    configFile: "packages/renderer/vite.config.ts"
});
await server.listen();

const address = server.httpServer.address();
Object.assign(process.env, {
    VITE_DEV_SERVER_HOSTNAME: address.address,
    VITE_DEV_SERVER_PORT: address.port,
    VITE_DEV_SERVER_URL: `http://${address.address}:${address.port}`
});

startElectron();
killable = true;

console.log("Press enter to restart application.");
process.stdin.addListener("data", () => {
    restartElectron();
});
