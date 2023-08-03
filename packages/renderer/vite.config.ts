import { resolve } from "path";
import { defineConfig, PluginOption, UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import preact from "@preact/preset-vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import nodeFetch from "node-fetch";
import pkg from "../../package.json";

const PROJECT_ROOT = resolve(__dirname, "../../");

const getVersions = async () => {
    const resp = await nodeFetch("https://releases.electronjs.org/releases.json");
    const data = (await resp.json()) as any[];

    const electron = pkg.devDependencies.electron.substring(1);

    let match: any | undefined = undefined;
    data.forEach((entry) => {
        if (entry.version == electron) {
            match = entry;
        }
    });

    if (match == undefined) {
        return {
            electron: electron,
            node: "X.X.X.X",
            chromium: "X.X.X.X"
        };
    } else {
        return {
            electron: electron,
            node: match.node,
            chromium: match.chrome
        };
    }
};

const common: Partial<UserConfig> = {
    root: __dirname,
    clearScreen: false,
    base: "./",
    build: {
        outDir: resolve(PROJECT_ROOT, ".vite/renderer/"),
        emptyOutDir: false,
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                about: resolve(__dirname, "about/about.html")
            }
        }
    },
    appType: "mpa"
};

const plugins: PluginOption[] = [
    tsconfigPaths({ root: __dirname }),
    viteStaticCopy({
        targets: [
            {
                src: "../../node_modules/highlight.js/styles/*.css",
                dest: "assets/hljs"
            },
            {
                src: "../../node_modules/highlight.js/styles/base16/*.css",
                dest: "assets/hljs/base16"
            }
        ]
    })
];

export default defineConfig(async (mode) => {
    process.env.VITE_APP_VERSION = process.env.npm_package_version;

    const versions = await getVersions();
    process.env.VITE_ELECTRON_VERSION = versions.electron;
    process.env.VITE_NODE_VERSION = versions.node;
    process.env.VITE_CHROMIUM_VERSION = versions.chromium;

    if (mode.command == "serve") {
        console.log("Serving app with \x1b[96mReact\x1b[0m");
        return {
            ...common,
            server: {
                host: "127.0.0.1",
                port: 5173
            },
            build: {
                minify: false,
                sourcemap: "inline"
            },
            plugins: [...plugins, react()]
        };
    } else {
        console.log("Building app with \x1b[35mPreact\x1b[0m");
        return {
            ...common,
            plugins: [
                ...plugins,
                preact({
                    babel: {
                        cwd: __dirname
                    }
                })
            ]
        };
    }
});
