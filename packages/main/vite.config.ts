import { builtinModules } from "module";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

process.env.VITE_APP_VERSION = process.env.npm_package_version;
export default defineConfig({
    plugins: [tsconfigPaths()],
    build: {
        target: "esnext",
        outDir: ".vite/",
        emptyOutDir: false,
        lib: {
            entry: "packages/main/index.ts",
            formats: ["cjs"]
        },
        rollupOptions: {
            output: {
                entryFileNames: "index.cjs"
            },
            external: ["electron", ...builtinModules, ...builtinModules.map((e) => `node:${e}`)]
        }
    }
});
