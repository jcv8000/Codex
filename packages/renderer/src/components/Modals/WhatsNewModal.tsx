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
            title={<Title order={3}>What&apos;s New in 2.0.3</Title>}
            size="lg"
        >
            <Tabs orientation="vertical" placement="right" defaultValue="v203">
                <Tabs.List>
                    <Tabs.Tab value="v203">2.0.3 Changelog</Tabs.Tab>
                    <Tabs.Tab value="bugs">Bug Reports</Tabs.Tab>
                    <Tabs.Tab value="v2release">2.0 Changelog</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="v203" px="xs">
                    <ul style={{ paddingLeft: "16px" }}>
                        <li>18 new icons from Tabler Icons 2.41</li>
                        <li>Fixed horizontal rules being difficult to see in dark mode</li>
                        <li>Fixed block quote borders being difficult to see in dark mode</li>
                        <li>
                            Fixed copying and pasting text with a custom font-size not working
                            correctly
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
