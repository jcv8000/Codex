import { SidebarContent } from "./SidebarContent";
import { SidebarResizer } from "./SidebarResizer";

export function Sidebar() {
    return (
        <>
            <div id="sidebar">
                <SidebarContent />
            </div>

            <SidebarResizer />
        </>
    );
}
