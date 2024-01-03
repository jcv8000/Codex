/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
    appId: "io.github.jcv8000.codex",
    productName: "Codex",
    copyright: "CC-BY-NC-4.0",
    files: [".vite/**/*", "!node_modules"],
    mac: {
        target: [
            { target: "dmg", arch: ["arm64", "x64"] },
            { target: "zip", arch: ["arm64", "x64"] }
        ],
        icon: "./assets/icon.icns",
        extendInfo: {
            CFBundleDisplayName: "Codex"
        },
        category: "public.app-category.productivity",
        notarize: {
            teamId: process.env.APPLE_TEAM_ID || ""
        }
    },
    win: {
        target: ["nsis", "zip"],
        icon: "./assets/icon.ico",
        signingHashAlgorithms: ["sha256", "sha1"],
        signAndEditExecutable: true,
        publisherName: "Joshua Vickery"
    },
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true,
        shortcutName: "Codex"
    },
    linux: {
        target: ["deb", "tar.xz"],
        icon: "./assets/icon.icns",
        vendor: "Joshua Vickery",
        category: "Education",
        executableName: "Codex",
        description:
            "A free, simple, and customizable note-taking software for programmers and Computer Science students. Made by Joshua Vickery",
        synopsis: "Note-taking program for programmers or CS students"
    }
};

module.exports = config;
