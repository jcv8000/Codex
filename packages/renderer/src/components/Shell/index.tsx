import { SidebarContent } from "components/SidebarContent";
import "./Shell.css";

export function Shell(props: { children?: React.ReactNode }) {
    return (
        <div id="viewport">
            <div id="sidebar">
                <SidebarContent />
            </div>

            <div id="main">
                <div id="main-content">{props.children}</div>
            </div>
        </div>
    );
}
