import { Portal } from "@mantine/core";
import { useEffect, useState } from "react";
import { FloatProps, defaultStyles } from ".";

export function SidebarFloat({ children, pos }: FloatProps) {
    const [styles, setStyles] = useState<React.CSSProperties>({ ...defaultStyles });

    useEffect(() => {
        const set = () => {
            const sidebar = document.getElementById("sidebar");
            const main = document.getElementById("main");
            if (sidebar == null || main == null) return;

            const newStyles: React.CSSProperties = { ...defaultStyles };

            if (pos.top && pos.left) {
                newStyles.top = `${pos.top}px`;
                newStyles.left = `${pos.left}px`;

                setStyles(newStyles);
            } else if (pos.top && pos.right) {
                const right =
                    main.offsetWidth + pos.right + (sidebar.offsetWidth - sidebar.clientWidth);
                newStyles.top = `${pos.top}px`;
                newStyles.right = `${right}px`;

                setStyles(newStyles);
            } else if (pos.bottom && pos.left) {
                newStyles.bottom = `${pos.bottom}px`;
                newStyles.left = `${pos.left}px`;

                setStyles(newStyles);
            } else if (pos.bottom && pos.right) {
                const right =
                    main.offsetWidth + pos.right + (sidebar.offsetWidth - sidebar.clientWidth);
                newStyles.bottom = `${pos.bottom}px`;
                newStyles.right = `${right}px`;

                setStyles(newStyles);
            }
        };

        set();
        window.addEventListener("resize", set);

        return () => {
            window.removeEventListener("resize", set);
        };
    }, [pos.top, pos.right, pos.bottom, pos.left]);

    return (
        <Portal target={document.getElementById("root")!}>
            <div style={styles}>{children}</div>
        </Portal>
    );
}
