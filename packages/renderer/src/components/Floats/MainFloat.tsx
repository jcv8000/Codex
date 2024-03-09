import { Portal } from "@mantine/core";
import { useEffect, useState } from "react";
import { FloatProps, defaultStyles } from ".";

export function MainFloat({ children, pos }: FloatProps) {
    const [styles, setStyles] = useState<React.CSSProperties>({ ...defaultStyles });

    useEffect(() => {
        const set = () => {
            const main = document.getElementById("main");
            if (main == null) return;

            const newStyles: React.CSSProperties = { ...defaultStyles };

            if (pos.top && pos.left) {
                const left = pos.left + main.getBoundingClientRect().left;
                newStyles.top = `${pos.top}px`;
                newStyles.left = `${left}px`;

                setStyles(newStyles);
            } else if (pos.top && pos.right) {
                const right = pos.right + (main.offsetWidth - main.clientWidth);
                newStyles.top = `${pos.top}px`;
                newStyles.right = `${right}px`;

                setStyles(newStyles);
            } else if (pos.bottom && pos.left) {
                const left = pos.left + main.getBoundingClientRect().left;
                newStyles.bottom = `${pos.bottom}px`;
                newStyles.left = `${left}px`;

                setStyles(newStyles);
            } else if (pos.bottom && pos.right) {
                const right = pos.right + (main.offsetWidth - main.clientWidth);
                newStyles.bottom = `${pos.bottom}px`;
                newStyles.right = `${right}px`;

                setStyles(newStyles);
            }
        };

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
