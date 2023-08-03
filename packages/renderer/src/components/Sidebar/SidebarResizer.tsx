import { Box } from "@mantine/core";
import { MouseEventHandler, useContext, useRef } from "react";
import { AppContext } from "types/AppStore";
import { setSidebarWidth } from ".";

export function SidebarResizer(props: { open: boolean }) {
    const appContext = useContext(AppContext);
    const SIDEBAR_MIN_WIDTH = 200;
    const SIDEBAR_MAX_WIDTH = 600;

    const resizerRef = useRef<HTMLDivElement>(null);

    const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (e.clientX >= SIDEBAR_MIN_WIDTH && e.clientX <= SIDEBAR_MAX_WIDTH)
            setSidebarWidth(e.clientX);
    };

    const onMouseUp = (e: MouseEvent) => {
        if (e.clientX >= SIDEBAR_MIN_WIDTH && e.clientX <= SIDEBAR_MAX_WIDTH) {
            setSidebarWidth(e.clientX);
            appContext.modifyPrefs((p) => (p.general.sidebarWidth = e.clientX));
        }

        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    };

    return (
        <Box
            display={props.open ? "block" : "none"}
            ref={resizerRef}
            onMouseDown={onMouseDown}
            sx={(theme) => ({
                width: "4px",
                position: "absolute",
                top: 0,
                left: "calc(var(--sidebar-width) - 3px)",
                bottom: 0,
                cursor: "col-resize",
                zIndex: 100,

                "&:hover": {
                    backgroundColor: theme.colors.gray[theme.colorScheme == "light" ? 3 : 8]
                },

                "&:active": {
                    backgroundColor: theme.colors.gray[theme.colorScheme == "light" ? 4 : 7]
                }
            })}
        ></Box>
    );
}
