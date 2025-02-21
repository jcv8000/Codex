import { Anchor, Box, Modal, Space, Tabs, Text, Title } from "@mantine/core";
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
            title={<Title order={3}>What&apos;s New in 2.0.5</Title>}
            size="lg"
        >
            <Tabs orientation="vertical" placement="right" defaultValue="v205">
                <Tabs.List>
                    <Tabs.Tab value="v205">2.0.5 Changelog</Tabs.Tab>
                    <Tabs.Tab value="bugs">Bug Reports</Tabs.Tab>
                    <Tabs.Tab value="v2release">2.0 Changelog</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="v205" px="xs">
                    <Title order={3}>New Survey</Title>
                    <Text>Please take this short survey about future versions of Codex:</Text>
                    <Anchor onClick={() => window.api.openLink("feedback")}>
                        https://forms.gle/r4HqxLb6Yh663LV28
                    </Anchor>

                    <Space h="lg" />

                    <Title order={3}>General</Title>
                    <ul>
                        <li>Updated to Electron 32 and Node.js 20</li>
                        <li>Added Russian localization (@wennerryle)</li>
                    </ul>

                    <Title order={3}>Bug Fixes</Title>
                    <ul>
                        <li>
                            Fixed an issue where favoriting / unfavoriting pages doesn&apos;t work.
                        </li>
                    </ul>

                    <Space h="lg" />

                    <Title order={3}>Other</Title>
                    <Text>
                        Codex v3 (full rewrite) is something that I want to do soon. Currently
                        waiting on TipTap v3 before I start again.{" "}
                        <Anchor onClick={() => window.api.openLink("feedback")}>
                            Take the new survey
                        </Anchor>{" "}
                        for suggestions and input. As always bug reports and issues go on the{" "}
                        <Anchor onClick={() => window.api.openLink("issues")}>GitHub</Anchor>.
                    </Text>
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
