import { locales } from "common/Locales";
import { SidebarItem, SidebarNoteItem } from "src/components/SidebarItems";
import { codexStore, useSnapshot } from "src/state";

export function SidebarContent() {
    const { prefs, view, save } = useSnapshot(codexStore);

    const locale = locales[prefs.general.locale];
    return (
        <>
            <SidebarItem
                icon="home"
                text={locale.sidebar.homeTab}
                onClick={() => (codexStore.view = { value: "home" })}
                shouldBeActive={view.value == "home"}
            />
            <SidebarItem
                icon="settings"
                text={locale.sidebar.settings}
                onClick={() => (codexStore.view = { value: "settings" })}
                shouldBeActive={view.value == "settings"}
            />
            <SidebarItem icon="menu-2" text={locale.sidebar.moreTab}>
                <SidebarItem
                    icon="help"
                    text={locale.sidebar.more_help}
                    depth={1}
                    onClick={() => window.ipc.send("open-link", "help")}
                />
                <SidebarItem
                    icon="world-www"
                    text={locale.sidebar.more_website}
                    depth={1}
                    onClick={() => window.ipc.send("open-link", "website")}
                />
                <SidebarItem
                    icon="file-text"
                    text={locale.sidebar.more_changelogs}
                    depth={1}
                    onClick={() => window.ipc.send("open-link", "changelogs")}
                />
                <SidebarItem
                    icon="brand-github"
                    text={locale.sidebar.more_github_repo}
                    depth={1}
                    onClick={() => window.ipc.send("open-link", "github")}
                />
                <SidebarItem
                    icon="alert-circle"
                    text={locale.sidebar.more_issues}
                    depth={1}
                    onClick={() => window.ipc.send("open-link", "issues")}
                />
                <SidebarItem
                    icon="thumb-up"
                    text={locale.sidebar.more_give_feedback}
                    depth={1}
                    onClick={() => window.ipc.send("open-link", "feedback")}
                />
            </SidebarItem>

            {save.items.map((item) => (
                <SidebarNoteItem item={item} key={item.id} />
            ))}
        </>
    );
}
