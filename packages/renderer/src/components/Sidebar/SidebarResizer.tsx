import { codexStore } from "src/state";
import classes from "./SidebarResizer.module.css";

const SIDEBAR_MIN_WIDTH = 200;
const SIDEBAR_MAX_WIDTH = 600;

export function SidebarResizer() {
    return (
        <div
            className={classes.outer}
            onMouseDown={() => {
                document.addEventListener("mousemove", resize);
                document.addEventListener(
                    "mouseup",
                    (e) => {
                        document.removeEventListener("mousemove", resize);

                        if (e.clientX >= SIDEBAR_MIN_WIDTH && e.clientX <= SIDEBAR_MAX_WIDTH)
                            codexStore.prefs.general.sidebarWidth = e.clientX;
                        else if (e.clientX < SIDEBAR_MIN_WIDTH)
                            codexStore.prefs.general.sidebarWidth = SIDEBAR_MIN_WIDTH;
                        else if (e.clientX > SIDEBAR_MAX_WIDTH)
                            codexStore.prefs.general.sidebarWidth = SIDEBAR_MAX_WIDTH;
                    },
                    { once: true }
                );
            }}
        >
            <div className={classes.inner} />
        </div>
    );
}

function resize(e: MouseEvent) {
    if (e.clientX >= SIDEBAR_MIN_WIDTH && e.clientX <= SIDEBAR_MAX_WIDTH)
        document.documentElement.style.setProperty("--sidebar-width", `${e.clientX}px`);
    else if (e.clientX < SIDEBAR_MIN_WIDTH)
        document.documentElement.style.setProperty("--sidebar-width", `${SIDEBAR_MIN_WIDTH}px`);
    else if (e.clientX > SIDEBAR_MAX_WIDTH)
        document.documentElement.style.setProperty("--sidebar-width", `${SIDEBAR_MAX_WIDTH}px`);
}
