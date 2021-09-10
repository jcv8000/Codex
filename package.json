{
    "name": "codex",
    "version": "1.4.0",
    "description": "Codex - Note-taking app for programmers and CS students",
    "homepage": "https://www.codexnotes.com/",
    "repository": "https://github.com/jcv8000/Codex",
    "main": "main.js",
    "scripts": {
        "start": "electron .",
        "dist": "electron-builder"
    },
    "build": {
        "appId": "io.github.jcv8000.codex",
        "productName": "Codex",
        "copyright": "CC BY-NC 4.0",
        "buildVersion": "1.4.0",
        "mac": {
            "target": "dmg",
            "icon": "./icons/icon.icns",
            "category": "public.app-category.productivity"
        },
        "win": {
            "target": [
                "nsis",
                "zip"
            ],
            "icon": "./icons/icon.ico",
            "signingHashAlgorithms": [
                "sha256",
                "sha1"
            ],
            "signAndEditExecutable": true,
            "publisherName": "Joshua Vickery"
        },
        "nsis": {
            "oneClick": "false",
            "allowToChangeInstallationDirectory": "true",
            "shortcutName": "Codex"
        },
        "linux": {
            "target": [
                "deb",
                "tar.xz"
            ],
            "icon": "./icons/icon.icns",
            "vendor": "Joshua Vickery",
            "category": "Utility",
            "executableName": "Codex",
            "description": "A free, simple, and customizable note-taking software for programmers and Computer Science students. Made by Joshua Vickery",
            "synopsis": "Note-taking program for programmers or CS students"
        }
    },
    "author": {
        "name": "Joshua Vickery",
        "email": "jcv8000@gmail.com"
    },
    "license": "CC BY-NC 4.0",
    "devDependencies": {
        "electron": "^12.1.0",
        "electron-builder": "latest"
    },
    "dependencies": {
        "@benrbray/prosemirror-math": "^0.2.2",
        "bootstrap": "4.5.0",
        "custom-electron-titlebar": "^3.2.6",
        "electron-context-menu": "^2.4.0",
        "feather-icons": "^4.28.0",
        "highlight.js": "^10.6.0",
        "jquery": "^3.5.1",
        "katex": "^0.13.18",
        "prosemirror-commands": "^1.1.7",
        "prosemirror-dropcursor": "^1.3.3",
        "prosemirror-gapcursor": "^1.1.5",
        "prosemirror-highlightjs": "^0.6.0",
        "prosemirror-history": "^1.1.3",
        "prosemirror-inputrules": "^1.1.3",
        "prosemirror-keymap": "^1.1.4",
        "prosemirror-markdown": "^1.5.2",
        "prosemirror-menu": "^1.1.4",
        "prosemirror-model": "^1.13.3",
        "prosemirror-schema-list": "^1.1.4",
        "prosemirror-state": "^1.3.4",
        "prosemirror-tables": "^1.1.1",
        "prosemirror-transform": "^1.2.11",
        "prosemirror-view": "^1.17.6",
        "validator": "^13.6.0"
    }
}
