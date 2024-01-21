import { locales } from "common/Locales";
import { SidebarItem } from "src/SidebarItems/SidebarItem";
import { useCodexContext } from "src/state/useCodexContext";

export function SidebarContent() {
    const appContext = useCodexContext();
    const locale = locales[appContext.prefs.general.locale];
    return (
        <>
            <SidebarItem
                icon="home"
                text={locale.sidebar.homeTab}
                onClick={() => appContext.setView({ value: "home" })}
                shouldBeActive={appContext.view.value == "home"}
            />
            <SidebarItem
                icon="settings"
                text={locale.sidebar.settings}
                onClick={() => appContext.setView({ value: "settings" })}
                shouldBeActive={appContext.view.value == "settings"}
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
