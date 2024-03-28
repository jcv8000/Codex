import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { visualizer } from "rollup-plugin-visualizer";
import pkg from "../../package.json";
import { UserConfig } from "vite";

const PROJECT_ROOT = resolve(__dirname, "../../");

const getVersions = async () => {
    const resp = await fetch("https://releases.electronjs.org/releases.json");
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

export default defineConfig(async () => {
    process.env.VITE_APP_VERSION = process.env.npm_package_version;

    const versions = await getVersions();
    process.env.VITE_ELECTRON_VERSION = versions.electron;
    process.env.VITE_NODE_VERSION = versions.node;
    process.env.VITE_CHROMIUM_VERSION = versions.chromium;

    console.log("Building app with \x1b[96mReact\x1b[0m");

    const config: UserConfig = {
        root: __dirname,
        clearScreen: false,
        server: {
            host: "127.0.0.1",
            port: 5173
        },
        base: "./",
        build: {
            target: "esnext",
            outDir: resolve(PROJECT_ROOT, ".vite/renderer/"),
            emptyOutDir: true,
            rollupOptions: {
                input: {
                    main: resolve(__dirname, "index.html"),
                    about: resolve(__dirname, "about/about.html")
                }
            }
        },
        plugins: [
            visualizer({
                template: "treemap",
                open: true,
                gzipSize: true,
                brotliSize: true,
                filename: "bundle-analysis.html" // Will be saved in project's root
            }),
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
            }),
            react()
        ]
    };

    return config;
});
