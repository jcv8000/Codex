export * from "./Sidebar";

export function setSidebarWidth(width: number) {
    document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
}
