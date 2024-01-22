import { locales } from "common/Locales";
import { SidebarItem } from "src/components/SidebarItems";
import { codexStore, setView, useSnapshot } from "src/state";

export function SidebarContent() {
    const { prefs, view } = useSnapshot(codexStore);

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
        </>
    );
}
