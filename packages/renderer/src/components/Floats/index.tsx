import { Portal } from "@mantine/core";
import { px } from "common/Utils";

type FloatProps = {
    children?: React.ReactNode;
    pos: { top?: number; left?: number; right?: number; bottom?: number };
};

const defaultStyles: React.CSSProperties = {
    position: "fixed",
    pointerEvents: "all"
};

function FloatBase({ children, pos, overlayId }: FloatProps & { overlayId: string }) {
    const overlay = document.getElementById(overlayId);
    if (overlay == null) return <></>;

    const styles: React.CSSProperties = { ...defaultStyles };

    if (pos.top) styles.top = px(pos.top);
    if (pos.bottom) styles.bottom = px(pos.bottom);
    if (pos.left) styles.left = px(pos.left);
    if (pos.right) styles.right = px(pos.right);

    return (
        <Portal target={overlay}>
            <div style={styles}>{children}</div>
        </Portal>
    );
}

export function MainFloat({ children, pos }: FloatProps) {
    return (
        <FloatBase pos={pos} overlayId="main-overlay">
            {children}
        </FloatBase>
    );
}

export function SidebarFloat({ children, pos }: FloatProps) {
    return (
        <FloatBase pos={pos} overlayId="sidebar-overlay">
            {children}
        </FloatBase>
    );
}
