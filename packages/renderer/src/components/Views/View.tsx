import { codexStore, useSnapshot } from "src/state";
import { HomeView } from "./HomeView";
import { SettingsView } from "./SettingsView";

export function View() {
    const { view } = useSnapshot(codexStore);
    let rendered = <></>;

    if (view.value == "home") rendered = <HomeView />;
    else if (view.value == "settings") rendered = <SettingsView />;
    else if (view.value == "editor") {
        rendered = <></>;
    }

    return rendered;
}
