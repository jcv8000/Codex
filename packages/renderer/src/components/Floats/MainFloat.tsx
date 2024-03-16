import { Portal } from "@mantine/core";
import { useEffect, useState } from "react";
import { FloatProps, defaultStyles } from ".";
import { px } from "common/Utils";

export function MainFloat({ children, pos }: FloatProps) {
    const [styles, setStyles] = useState<React.CSSProperties>({ ...defaultStyles });

    useEffect(() => {
        function set() {
            const main = document.getElementById("main");
            if (main == null) return;

            const newStyles: React.CSSProperties = { ...defaultStyles };

            if (pos.top) newStyles.top = px(pos.top);
            if (pos.bottom) newStyles.bottom = px(pos.bottom);

            if (pos.left) {
                const left = pos.left + main.getBoundingClientRect().left;
                newStyles.left = px(left);
            }
            if (pos.right) {
                const right = pos.right + (main.offsetWidth - main.clientWidth);
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
