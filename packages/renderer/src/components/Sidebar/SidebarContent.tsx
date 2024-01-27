import { locales } from "common/Locales";
import { SidebarItem, SidebarNoteItem } from "src/components/SidebarItems";
import { codexStore, setView, useSnapshot } from "src/state";

export function SidebarContent() {
    // Have to access "save" snapshot to trigger re-renders, but I'm passing
    // down the actual proxy save object to the SidebarNoteItem tree
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { prefs, view, save } = useSnapshot(codexStore);

    const locale = locales[prefs.general.locale];
    return (
        <>
            <SidebarItem
                icon="home"
                text={locale.sidebar.homeTab}
                onClick={() => setView({ value: "home" })}
                shouldBeActive={view.value == "home"}
            />
            <SidebarItem
                icon="settings"
                text={locale.sidebar.settings}
                onClick={() => setView({ value: "settings" })}
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

            {codexStore.save.items.map((item) => (
                <SidebarNoteItem item={item} key={item.id} />
            ))}
        </>
    );
}
