import { modifyPrefs } from "src/state";
import classes from "./SidebarResizer.module.css";

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

                        modifyPrefs((p) => {
                            p.general.sidebarWidth = e.clientX;
                        });
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
    document.documentElement.style.setProperty("--sidebar-width", `${e.clientX}px`);
}
