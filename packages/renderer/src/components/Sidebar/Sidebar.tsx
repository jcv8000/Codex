import { ActionIcon, Navbar, TextInput, Tooltip, useMantineTheme } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { Icon } from "components/Icon";
import { SidebarItem, SidebarNoteItem, SidebarSearchResult } from "components/SidebarItems";
import { useContext, useState } from "react";
import { locales } from "common/Locales";
import { Folder, NoteItem, Page } from "common/Save";
import { AppContext } from "types/AppStore";
import { SidebarResizer } from "./SidebarResizer";
import { ModalContext } from "components/Modals";
import { setSidebarWidth } from ".";

export function Sidebar() {
    const appContext = useContext(AppContext);
    const modalContext = useContext(ModalContext);
    const locale = locales[appContext.prefs.general.locale];
    const theme = useMantineTheme();

    setSidebarWidth(appContext.prefs.general.sidebarWidth);

    const [open, setOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 200, { leading: true });

    const noteItems = new Array<JSX.Element>();

    if (debouncedSearchQuery == "") {
        appContext.save.items.forEach((i) => {
            noteItems.push(<SidebarNoteItem item={i} key={i.id} />);
        });
    } else {
        const recurse = (item: NoteItem) => {
            if (item instanceof Folder)
                item.children.forEach((child) => {
                    recurse(child);
                });
            else if (item instanceof Page) {
                if (item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) {
                    noteItems.push(
                        <SidebarSearchResult
                            page={item}
                            key={item.id}
                            nameMatch={debouncedSearchQuery}
                        />
                    );
                } else if (
                    item.textContent.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
                ) {
                    noteItems.push(
                        <SidebarSearchResult
                            page={item}
                            key={item.id}
                            textMatch={debouncedSearchQuery}
                        />
                    );
                }
            }
        };

        appContext.save.items.forEach((item) => {
            recurse(item);
        });
    }

    window.api.onToggleSidebar(() => setOpen(!open));
    window.api.onResetSidebarWidth(() => {
        setSidebarWidth(300);
        appContext.modifyPrefs((p) => (p.general.sidebarWidth = 300));
    });

    return (
        <>
            <Navbar
                px={0}
                py="md"
                display={open ? "block" : "none"}
                width={{ base: open ? "var(--sidebar-width)" : "0px" }}
                sx={(theme) => ({
                    overflow: "auto",
                    backgroundColor:
                        theme.colorScheme == "light" ? theme.colors.gray[0] : theme.colors.gray[9],
                    boxShadow: "rgba(0, 0, 0, 0.07) 2px 4px 7px"
                })}
            >
                <SidebarItem
                    icon="home"
                    text={locale.sidebar.homeTab}
                    onClick={() => appContext.setView("home")}
                    shouldBeActive={() => appContext.view == "home"}
                />
                <SidebarItem
                    icon="settings"
                    text={locale.sidebar.settings}
                    onClick={() => appContext.setView("settings")}
                    shouldBeActive={() => appContext.view == "settings"}
                />
                <SidebarItem icon="menu-2" text={locale.sidebar.moreTab}>
                    <SidebarItem
                        icon="help"
                        text={locale.sidebar.more_help}
                        depth={1}
                        onClick={() => window.api.openLink("help")}
                    />
                    <SidebarItem
                        icon="world-www"
                        text={locale.sidebar.more_website}
                        depth={1}
                        onClick={() => window.api.openLink("website")}
                    />
                    <SidebarItem
                        icon="file-text"
                        text={locale.sidebar.more_changelogs}
                        depth={1}
                        onClick={() => window.api.openLink("changelogs")}
                    />
                    <SidebarItem
                        icon="brand-github"
                        text={locale.sidebar.more_github_repo}
                        depth={1}
                        onClick={() => window.api.openLink("github")}
                    />
                    <SidebarItem
                        icon="alert-circle"
                        text={locale.sidebar.more_issues}
                        depth={1}
                        onClick={() => window.api.openLink("issues")}
                    />
                    <SidebarItem
                        icon="thumb-up"
                        text={locale.sidebar.more_give_feedback}
                        depth={1}
                        onClick={() => window.api.openLink("feedback")}
                    />
                </SidebarItem>

                <TextInput
                    placeholder={locale.sidebar.search_bar_text}
                    size="xs"
                    px="sm"
                    my="xs"
                    icon={<Icon icon="search" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    rightSection={
                        debouncedSearchQuery != "" && (
                            <ActionIcon onClick={() => setSearchQuery("")}>
                                <Icon icon="x" />
                            </ActionIcon>
                        )
                    }
                />

                <Tooltip label={locale.sidebar.new_folder} withArrow position="left">
                    <ActionIcon
                        variant="default"
                        sx={() => ({
                            display: open ? "flex" : "none",
                            position: "fixed",
                            bottom: "16px",
                            left: "calc(var(--sidebar-width) - 48px)"
                        })}
                        onClick={() => {
                            modalContext.openNewModal({ parent: null, type: "folder" });
                        }}
                    >
                        <Icon icon="plus" />
                    </ActionIcon>
                </Tooltip>

                {noteItems}
            </Navbar>

            <SidebarResizer open={open} />
            <ActionIcon
                color={theme.colorScheme == "light" ? "gray.7" : "gray.4"}
                onClick={() => setOpen(!open)}
                sx={() => ({
                    position: "fixed",
                    bottom: "16px",
                    left: open ? "calc(var(--sidebar-width) + 16px)" : "16px",
                    transition: "transform 0.2s cubic-bezier(0.22, 0.61, 0.36, 1)",
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    zIndex: 200
                })}
            >
                <Icon icon="chevrons-right" size={24} />
            </ActionIcon>
        </>
    );
}
