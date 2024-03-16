import { Portal } from "@mantine/core";
import { useEffect, useState } from "react";
import { FloatProps, defaultStyles } from ".";
import { px } from "common/Utils";

export function SidebarFloat({ children, pos }: FloatProps) {
    const [styles, setStyles] = useState<React.CSSProperties>({ ...defaultStyles });

    useEffect(() => {
        function set() {
            const sidebar = document.getElementById("sidebar");
            const main = document.getElementById("main");
            if (sidebar == null || main == null) return;

            const newStyles: React.CSSProperties = { ...defaultStyles };

            if (pos.top) newStyles.top = px(pos.top);
            if (pos.bottom) newStyles.bottom = px(pos.bottom);

            if (pos.left) newStyles.left = px(pos.left);
            if (pos.right) {
                const right =
                    main.offsetWidth + pos.right + (sidebar.offsetWidth - sidebar.clientWidth);
                newStyles.right = px(right);
            }

            setStyles(newStyles);
        }

        set();
        window.addEventListener("resize", set);
        window.addEventListener("sidebar-resize", set);

        return () => {
            window.removeEventListener("resize", set);
            window.removeEventListener("sidebar-resize", set);
        };
    }, [pos.top, pos.right, pos.bottom, pos.left]);

    return (
        <Portal target={document.getElementById("root")!}>
            <div style={styles}>{children}</div>
        </Portal>
    );
}
