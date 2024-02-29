import { SidebarFloat } from "components/Floats";
import { SidebarContent } from "./SidebarContent";
import { SidebarResizer } from "./SidebarResizer";
import { ActionIcon, Tooltip } from "@mantine/core";
import { Icon } from "components/Icon";
import { modalStore, useLocale } from "src/state";

export function Sidebar() {
    const locale = useLocale();
    return (
        <>
            <div id="sidebar">
                <SidebarContent />
            </div>

            <SidebarResizer />

            <SidebarFloat pos={{ bottom: 16, right: 16 }}>
                <Tooltip label={locale.sidebar.new_folder} withArrow position="left">
                    <ActionIcon
                        variant="default"
                        onClick={() => {
                            modalStore.newModalState = {
                                opened: true,
                                parent: null,
                                type: "folder"
                            };
                        }}
                    >
                        <Icon icon="plus" />
                    </ActionIcon>
                </Tooltip>
            </SidebarFloat>
        </>
    );
}
