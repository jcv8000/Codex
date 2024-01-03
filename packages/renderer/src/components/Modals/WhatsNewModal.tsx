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
            title={<Title order={3}>What&apos;s New in 2.0.4</Title>}
            size="lg"
        >
            <Tabs orientation="vertical" placement="right" defaultValue="v204">
                <Tabs.List>
                    <Tabs.Tab value="v204">2.0.4 Changelog</Tabs.Tab>
                    <Tabs.Tab value="bugs">Bug Reports</Tabs.Tab>
                    <Tabs.Tab value="v2release">2.0 Changelog</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="v204" px="xs">
                    <Title order={3}>Important</Title>
                    <ul>
                        <li>
                            Reworked saving system
                            <ul>
                                <li>Now only saves when there are changes made to a page</li>
                                <li>
                                    New &quot;Autosave when switching pages / exiting the
                                    editor&quot; setting
                                    <ul>
                                        <li>
                                            Enabled by default (same behavior as how it used to
                                            work)
                                        </li>
                                        <li>
                                            Disabling this setting will show a popup to save/discard
                                            unsaved changes when switching pages or exiting the
                                            editor
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <Title order={3}>Tech Stack Upgrades</Title>
                    <ul>
                        <li>Updated to Node.js 18 and Electron 26</li>
                        <li>Upgraded to Vite 5</li>
                        <li>72 new icons from Tabler</li>
                    </ul>
                    <Title order={3}>Bug Fixes / Improvements</Title>
                    <ul>
                        <li>
                            Fixed when deleting the active page, the editor doesn&apos;t go back to
                            Home
                        </li>
                        <li>
                            Fixed sidebar width not actually saving when dragging it all the way to
                            the left or right
                        </li>
                        <li>
                            When creating an item inside a folder the folder will open to show the
                            new item
                        </li>
                        <li>Fixed &quot;Toggle Developer Tools&quot; menu item not working</li>
                        <li>
                            Added a tip about alt+clicking folders to recursively close its
                            subfolders
                        </li>
                    </ul>
                </Tabs.Panel>

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

                <Tabs.Panel value="v2release" px="xs">
                    <Anchor onClick={() => window.api.openLink("changelogs")}>
                        Codex 2.0.0 Changelogs
                    </Anchor>
                </Tabs.Panel>
            </Tabs>
        </Modal>
    );
}
