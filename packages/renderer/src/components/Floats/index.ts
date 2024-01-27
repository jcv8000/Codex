export * from "./MainFloat";
export * from "./SidebarFloat";

export type FloatProps = {
    children?: React.ReactNode;
    pos: { top?: number; left?: number; right?: number; bottom?: number };
};

export const defaultStyles: React.CSSProperties = {
    position: "fixed",
    zIndex: "var(--mantine-z-index-popover)"
};
