import { builtinModules } from "module";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths()],
    build: {
        target: "esnext",
        outDir: ".vite/",
        emptyOutDir: false,
        lib: {
            entry: "packages/preload/preload.ts",
            formats: ["cjs"]
        },
        rollupOptions: {
            output: {
                entryFileNames: "preload.cjs"
            },
            external: ["electron", ...builtinModules, ...builtinModules.map((e) => `node:${e}`)]
        }
    }
});
