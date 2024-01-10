import { Sidebar } from "components/Sidebar";
import "./Shell.css";

export function Shell(props: { children?: React.ReactNode }) {
    return (
        <div id="viewport">
            <div id="sidebar">
                <Sidebar />
            </div>

            <div id="main">
                <div id="main-content">{props.children}</div>
            </div>
        </div>
    );
}
