import { useCodexStore } from "src/state/CodexStore";
import { HomeView } from "./HomeView";
import { SettingsView } from "./SettingsView";

export function View() {
    const view = useCodexStore((state) => state.view);
    let rendered = <></>;

    if (view.value == "home") rendered = <HomeView />;
    else if (view.value == "settings") rendered = <SettingsView />;
    else if (view.value == "editor") {
        rendered = <></>;
    }

    return rendered;
}
