import { Anchor, AppShell, Box, Button, Group, MantineProvider, Portal, Text } from "@mantine/core";
import { ModalsProvider as MantineModalsProvider, modals } from "@mantine/modals";
import { Sidebar } from "components/Sidebar";
import { EditorView, HomeView, SettingsView } from "components/Views";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppTheme } from "types/AppTheme";
import { ModalProvider } from "components/Modals";
import { Folder, NoteItem, Page, Save } from "common/Save";
import { AppContext } from "types/AppStore";
import { View } from "types/View";
import { useForceUpdate } from "@mantine/hooks";
import { Prefs } from "common/Prefs";
import { Editor } from "@tiptap/react";
import { extensions } from "components/Views/Editor/EditorExtensions";
import { EditorContent } from "@tiptap/react";
import { Notifications, notifications } from "@mantine/notifications";
import { Icon } from "components/Icon";
import { locales } from "common/Locales";
import { EditorStyles } from "components/Views/Editor/EditorStyles";

export function App() {
    const forceUpdate = useForceUpdate();

    const startPrefs = useMemo(() => JSON.parse(window.api.getPrefs()) as Prefs, []);
    const startSave = useMemo(() => Save.parse(window.api.getSave()), []);

    const prefs = useRef<Prefs>(JSON.parse(JSON.stringify(startPrefs)));
    const save = useRef<Save>(Save.parse(Save.stringify(startSave)));

    const [view, setView] = useState<View>("home");
    const [activePage, setActivePage] = useState<Page | null>(null);
    const unsavedChanges = useRef(false);

    const editorRef = useRef<Editor | null>(null);
    const fakeEditor = useRef<Editor>(
        new Editor({
            editable: false,
            extensions: extensions({ useTypography: false, tabSize: 4 })
        })
    );

    const locale = locales[prefs.current.general.locale];

    let renderedView = <></>;

    if (view == "home") {
        renderedView = <HomeView />;
    } else if (view == "settings") {
        renderedView = <SettingsView startPrefs={startPrefs} />;
    } else if (view == "editor" && activePage != null) {
        renderedView = (
            <EditorView page={activePage} setEditorRef={(e) => (editorRef.current = e)} />
        );
    }

    //#region CONTEXT FUNCTIONS

    const saveActivePage = async () => {
        if (activePage == null || editorRef.current == null) return;

        await window.api.writePage(
            activePage.fileName,
            JSON.stringify(editorRef.current.getJSON())
        );

        const text = editorRef.current.getText();
        if (activePage.textContent != text) {
            modifySave(() => {
                activePage.textContent = text;
            });
        }

        unsavedChanges.current = false;
    };

    const modifyPrefs = (callback: (p: Prefs) => void) => {
        callback(prefs.current);
        forceUpdate();
        window.api.writePrefs(prefs.current);
    };

    const SetView = async (newView: View, newActivePage?: Page | undefined) => {
        const finish = () => {
            if (newActivePage != undefined) {
                // Open parent folders (if the page was opened from a search for example)
                let i: NoteItem | null = newActivePage;
                while (i != null) {
                    if (i.parent instanceof Folder) i.parent.opened = true;
                    i = i.parent;
                }

                setView(newView);
                setActivePage(newActivePage);
            } else {
                setView(newView);
            }
        };

        if (
            view == "editor" &&
            activePage != null &&
            editorRef.current != null &&
            unsavedChanges.current == true
        ) {
            // Editor open WITH unsaved changes
            if (prefs.current.general.autoSaveOnPageSwitch) {
                await saveActivePage();
                notifications.show({
                    id: activePage.id,
                    message: (
                        <Text truncate>
                            {locale.notifications.saved} {activePage.name}
                        </Text>
                    ),
                    color: "green",
                    icon: <Icon icon="file-check" />,
                    autoClose: 2000,
                    withBorder: true
                });
                finish();
            } else {
                modals.open({
                    title: (
                        <Text truncate>{locale.unsavedChangesDialog.title(activePage.name)}</Text>
                    ),
                    children: (
                        <>
                            <Group position="right">
                                <Button variant="default" onClick={() => modals.closeAll()}>
                                    {locale.unsavedChangesDialog.cancel}
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        modals.closeAll();
                                        unsavedChanges.current = false;
                                        finish();
                                    }}
                                >
                                    <Text c="red">{locale.unsavedChangesDialog.forget}</Text>
                                </Button>
                                <Button
                                    onClick={async () => {
                                        modals.closeAll();
                                        await saveActivePage();

                                        notifications.show({
                                            id: activePage.id,
                                            message: (
                                                <Text truncate>
                                                    {locale.notifications.saved} {activePage.name}
                                                </Text>
                                            ),
                                            color: "green",
                                            icon: <Icon icon="file-check" />,
                                            autoClose: 2000,
                                            withBorder: true
                                        });

                                        finish();
                                    }}
                                >
                                    {locale.unsavedChangesDialog.save}
                                </Button>
                            </Group>
                        </>
                    )
                });
            }
        } else {
            finish();
        }
    };

    const modifySave = (callback: (save: Save) => void) => {
        callback(save.current);
        forceUpdate();
        window.api.writeSave(save.current);
    };

    const exportPage = async (page: Page, type: "pdf" | "md") => {
        // Save page if it's the open page
        if (activePage != null && page.id == activePage.id) {
            await saveActivePage();
        }

        fakeEditor.current.commands.setContent(JSON.parse(window.api.loadPage(page.fileName)));
        if (type == "pdf") {
            await window.api.exportPagePDF(page);
        } else {
            window.api.exportPageMD(page, fakeEditor.current.storage.markdown.getMarkdown());
        }

        fakeEditor.current.commands.setContent("");

        notifications.show({
            message: (
                <Text truncate>
                    {locale.notifications.exported} {page.name}
                </Text>
            ),
            color: "orange",
            icon: <Icon icon="file-check" />,
            autoClose: 2000,
            withBorder: true
        });
    };

    const exportAllPagesIn = async (folder: Folder, type: "pdf" | "md") => {
        const pages: Page[] = [];

        const dir = window.api.getDirectory();

        if (dir == undefined) return;

        function recurseAdd(item: NoteItem) {
            if (item instanceof Page) {
                pages.push(item);
            } else if (item instanceof Folder) {
                item.children.forEach((child) => {
                    recurseAdd(child);
                });
            }
        }

        folder.children.forEach((child) => {
            recurseAdd(child);
        });

        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];

            // Save page if it's the open page
            if (activePage != null && page.id == activePage.id) {
                await saveActivePage();
            }

            fakeEditor.current.commands.setContent(JSON.parse(window.api.loadPage(page.fileName)));

            if (type == "pdf") {
                await window.api.exportOneOfManyPDF(dir, page);
            } else {
                window.api.exportOneOfManyMD(
                    dir,
                    page,
                    fakeEditor.current.storage.markdown.getMarkdown()
                );
            }
        }

        fakeEditor.current.commands.setContent("");

        notifications.show({
            message: (
                <Text truncate>
                    {locale.notifications.exported_all_pages_in} {folder.name}
                </Text>
            ),
            color: "orange",
            icon: <Icon icon="file-check" />,
            autoClose: 2000,
            withBorder: true
        });
    };

    //#endregion CONTEXT FUNCTIONS

    window.api.onBeforeExit(async () => {
        if (
            view == "editor" &&
            editorRef.current != null &&
            activePage != null &&
            unsavedChanges.current == true
        ) {
            if (prefs.current.general.autoSaveOnPageSwitch) {
                await saveActivePage();
                window.api.exit();
            } else {
                modals.open({
                    title: (
                        <Text truncate>{locale.unsavedChangesDialog.title(activePage.name)}</Text>
                    ),
                    children: (
                        <>
                            <Group position="right">
                                <Button variant="default" onClick={() => modals.closeAll()}>
                                    {locale.unsavedChangesDialog.cancel}
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        window.api.exit();
                                    }}
                                >
                                    <Text c="red">{locale.unsavedChangesDialog.forget}</Text>
                                </Button>
                                <Button
                                    onClick={async () => {
                                        await saveActivePage();

                                        notifications.show({
                                            id: activePage.id,
                                            message: (
                                                <Text truncate>
                                                    {locale.notifications.saved} {activePage.name}
                                                </Text>
                                            ),
                                            color: "green",
                                            icon: <Icon icon="file-check" />,
                                            autoClose: 2000,
                                            withBorder: true
                                        });

                                        window.api.exit();
                                    }}
                                >
                                    {locale.unsavedChangesDialog.save}
                                </Button>
                            </Group>
                        </>
                    )
                });
            }
        } else {
            window.api.exit();
        }
    });
    window.api.onSaveCurrentPage(() => {
        saveActivePage();
        if (activePage != null) {
            notifications.show({
                id: activePage.id,
                message: (
                    <Text truncate>
                        {locale.notifications.saved} {activePage.name}
                    </Text>
                ),
                color: "green",
                icon: <Icon icon="file-check" />,
                autoClose: 2000,
                withBorder: true
            });
        }
    });

    window.api.onExportPagePdf(() => {
        if (activePage != null) exportPage(activePage, "pdf");
    });

    window.api.onUpdateAvailable((newVersion) => {
        notifications.show({
            id: "update_available",
            message: (
                <Anchor onClick={() => window.api.openLink("download")}>
                    {/* eslint-disable-next-line react/jsx-no-literals */}
                    {locale.notifications.update_available} ({newVersion})
                </Anchor>
            ),
            color: "green",
            autoClose: false,
            icon: <Icon icon="download" />,
            withBorder: true
        });
    });

    useEffect(() => {
        async function check() {
            if (await window.api.isRunningUnderARM64Translation()) {
                notifications.show({
                    id: "arm64_translation",
                    title: locale.notifications.running_under_arm_translation_title,
                    message: locale.notifications.running_under_arm_translation_desc,
                    color: "red",
                    autoClose: false,
                    icon: <Icon icon="radioactive" />,
                    withBorder: true
                });
            }
        }
        check();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AppContext.Provider
            value={{
                prefs: prefs.current,
                modifyPrefs: modifyPrefs,
                view: view,
                setView: SetView,
                activePage: activePage,
                unsavedChanges: unsavedChanges.current,
                setUnsavedChanges: (v) => (unsavedChanges.current = v),
                save: save.current,
                modifySave: modifySave,
                draggedItem: null,
                exportPage: exportPage,
                exportAllPagesIn: exportAllPagesIn
            }}
        >
            <link
                rel="stylesheet"
                href={`assets/hljs/${prefs.current.editor.codeBlockTheme}.css`}
            />

            <MantineProvider
                withNormalizeCSS
                withGlobalStyles
                theme={AppTheme({
                    prefs: prefs.current,
                    titlebarStyle: startPrefs.general.titlebarStyle
                })}
            >
                <Notifications id="notifications-container" />
                <MantineModalsProvider>
                    <ModalProvider>
                        <AppShell navbar={<Sidebar />}>{renderedView}</AppShell>
                    </ModalProvider>
                </MantineModalsProvider>
            </MantineProvider>

            <Portal>
                <MantineProvider theme={{ colorScheme: "light" }}>
                    <Box
                        sx={(theme) => ({
                            color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black
                        })}
                    >
                        <EditorStyles>
                            <EditorContent id="fake-editor" editor={fakeEditor.current} />
                        </EditorStyles>
                    </Box>
                </MantineProvider>
            </Portal>
        </AppContext.Provider>
    );
}
