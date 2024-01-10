import { Portal } from "@mantine/core";

export function MainPortal(props: { children?: React.ReactNode }) {
    return <Portal target={document.getElementById("main")!}>{props.children}</Portal>;
}
