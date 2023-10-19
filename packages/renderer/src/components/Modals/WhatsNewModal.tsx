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
            title={<Title order={3}>What&apos;s New in 2.0.1</Title>}
            size="lg"
        >
            <Tabs orientation="vertical" placement="right" defaultValue="improvements">
                <Tabs.List>
                    <Tabs.Tab value="improvements">Improvements</Tabs.Tab>
                    <Tabs.Tab value="bugfixes">Bug Fixes</Tabs.Tab>
                    <Tabs.Tab value="bugs">Bug Reports</Tabs.Tab>
                    <Tabs.Tab value="v2release">2.0 Changelog</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="improvements" px="xs">
                    <ul style={{ paddingLeft: "16px" }}>
                        <li>
                            Added <b>single-line and multi-line indenting and un-indenting</b> (Tab
                            / Shift-Tab) in code blocks
                        </li>
                        <li>
                            <b>Added a Tab Size setting</b> for how many spaces to add/remove when
                            pressing Tab/Shift-Tab in code blocks
                        </li>
                        <li>Added a setting for word-wrap in code blocks (disabled by default)</li>
                        <li>Icon Selector:</li>
                        <ul>
                            <li>
                                Now shows the name of the selected icon below the icon in Edit menus
                            </li>
                            <li>The Icon Selector popup highlights the currently-selected icon</li>
                            <li>
                                Improved how icons are searched for, finding them by name should be
                                easier
                            </li>
                        </ul>
                        <li>Custom scrollbars for code blocks</li>
                    </ul>
                </Tabs.Panel>

                <Tabs.Panel value="bugfixes" px="xs">
                    <ul style={{ paddingLeft: "16px" }}>
                        <li>
                            Fixed not being able to tab/shift-tab in code blocks that are inside a
                            table
                        </li>
                        <li>Fixed tab/shift-tab not working to sink/lift list items</li>
                        <li>Localized the &quot;Collapse&quot; tooltip in code blocks</li>
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
