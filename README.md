<p align="center">
	<img src="./packages/renderer/public/logo.png#gh-light-mode-only" width="400" />
    <img src="./packages/renderer/public/logo-light.png#gh-dark-mode-only" width="400" />
    <br>
	<img alt="GitHub all releases" src="https://img.shields.io/github/downloads/jcv8000/Codex/total?label=Downloads">
	<img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/jcv8000/Codex?label=Release">
	<img alt="GitHub issues" src="https://img.shields.io/github/issues/jcv8000/Codex?label=Issues">
	<a href="https://ko-fi.com/jcv8000"><img src="https://img.shields.io/badge/Ko--Fi-Donate-red"></a><br><br>
	<span>A free note-taking software for programmers and Computer Science students</span><br><br>
	<small>Made by <a href="https://jvickery.dev">Josh Vickery</a></small>
</p>

## About

> _**Notice**: If you're upgrading from Codex v1, make sure to **back up your save data** (save.json and notes folder) for all of your saves before updating._

Codex is a note-taking app that allows you to save **styled and highlighted code snippets** in your notes.

Other features:

-   Support for highlighting 190+ programming languages
-   Over 240 code themes
-   Sort your notes into nestable notebooks/folders, customizable icons for notebooks and pages
-   KaTeX math expressions
-   PDF and Markdown exporting

## Screenshot

![Example screenshot](https://imgur.com/zpmi3kS.png)

## Other Distributions

**Arch Linux**: You can install Codex from the AUR with [codex-bin](https://aur.archlinux.org/packages/codex-bin)

## Building Locally

Requires Node.js 16 or higher

```sh
pnpm install

pnpm dev # Run the app in development mode with hot reloading
pnpm dir # Only generates folder(s) of the standalone executable, quicker
pnpm dist # Generates all installers/portable archives for your platform
```

## License

This work is licensed under a [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) license.
