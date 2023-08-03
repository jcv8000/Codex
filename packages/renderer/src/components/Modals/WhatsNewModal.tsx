import { Anchor, Modal, Space, Tabs, Title } from "@mantine/core";
import { useContext, useEffect } from "react";
import { AppContext } from "types/AppStore";
import semver from "semver";
import { ModalContext } from "./ModalProvider";

/* Not translating the What's New page */
/* eslint-disable react/jsx-no-literals */

export function WhatsNewModal(props: { state: { opened: boolean }; onClose: () => void }) {
    const appContext = useContext(AppContext);
    const modalContext = useContext(ModalContext);

    useEffect(() => {
        if (semver.lt(appContext.prefs.misc.lastOpenedVersion, import.meta.env.VITE_APP_VERSION)) {
            setTimeout(() => {
                modalContext.openWhatsNewModal();

                appContext.modifyPrefs(
                    (p) => (p.misc.lastOpenedVersion = import.meta.env.VITE_APP_VERSION)
                );
            }, 1200);
        }
    });

    return (
        <Modal
            opened={props.state.opened}
            onClose={props.onClose}
            title={<Title order={3}>What&apos;s New in 2.0.0-beta.0</Title>}
            size="lg"
        >
            <Tabs orientation="vertical" placement="right" defaultValue="bugs">
                <Tabs.List>
                    <Tabs.Tab value="bugs">Bug Reports</Tabs.Tab>
                    <Tabs.Tab value="tech">Tech Stack</Tabs.Tab>
                    <Tabs.Tab value="search">Searching</Tabs.Tab>
                    <Tabs.Tab value="folders">Folders</Tabs.Tab>
                    <Tabs.Tab value="editor">Editor</Tabs.Tab>
                    <Tabs.Tab value="languages">Languages</Tabs.Tab>
                    <Tabs.Tab value="icons">Icons</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="bugs" px="xs">
                    If you find any bugs/issues with the new release of Codex, create an Issue on
                    the GitHub Repository{" "}
                    <Anchor onClick={() => window.api.openLink("issues")}>here</Anchor>.
                    <Space h="md" />
                    Please include your platform (Windows, Linux, macOS) and the version of Codex
                    that you&apos;re running.
                    <Space h="md" />
                    There&apos;s also a new feedback survey{" "}
                    <Anchor onClick={() => window.api.openLink("feedback")}>here</Anchor> for
                    suggestions, and a question about Windows 7/8/8.1 support.
                </Tabs.Panel>

                <Tabs.Panel value="tech" px="xs">
                    Codex has been completely rewritten in React/Preact and TypeScript. The entire
                    project is more clean and modular with a much better developer experience.
                    <Space h="md" />
                    Electron has also been upgraded to version 22, the last to support Windows 7 and
                    8, but will stop receiving support in October.
                </Tabs.Panel>

                <Tabs.Panel value="search" px="xs">
                    You can now use the Search bar on the sidebar to search for pages by name, or by
                    the page&apos;s contents.
                </Tabs.Panel>

                <Tabs.Panel value="folders" px="xs">
                    Folders can now be nested inside other folders for more organization
                </Tabs.Panel>

                <Tabs.Panel value="editor" px="xs">
                    The Editor has been overhauled and is now using TipTap, a wrapper for
                    Prosemirror. New features include changing font family, font color, and
                    highlighting text.
                    <Space h="md" />
                    There&apos;s a new custom popup for adding images to a document, and a new
                    custom popup for inserting/editing math expressions, which has a new visual math
                    editor.
                    <Space h="md" />
                    The editor&apos;s appearance can now be customized, such as removing the border
                    around the editor and changing its width. You can also disable the editor&apos;s
                    spellcheck in the Settings if it&apos;s not working correctly with your
                    language.
                </Tabs.Panel>

                <Tabs.Panel value="languages" px="xs">
                    Codex now supports multiple languages for the interface and menu bar (menu bar
                    requires a restart to see changes).
                    <Space h="md" />
                    If you would like to contribute a new translation, make a pull request on GitHub
                    with your language added (see CONTRIBUTING.md)
                </Tabs.Panel>

                <Tabs.Panel value="icons" px="xs">
                    Codex has switched to a new icon pack called Tabler Icons, which has over{" "}
                    <b>4,250</b> icons compared to Feather Icons&apos; 287.
                    <Space h="md" />
                    There&apos;s also a new <b>Icon Selector</b> popup which lets you view all of
                    the icons and search for icons by name or by category.
                    <Space h="md" />
                    Tabler Icons has many technology and programming-related icons which suits the
                    needs of this app better.
                    <Space h="md" />
                    When you convert your old save to the new version, Codex automatically replaces
                    any missing or mismatched icons to an icon from Tabler that looks similar to the
                    old one.
                </Tabs.Panel>
            </Tabs>
        </Modal>
    );
}
