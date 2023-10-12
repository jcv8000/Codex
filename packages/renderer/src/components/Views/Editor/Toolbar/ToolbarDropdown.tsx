import React from "react";
import { Button, Popover, Tooltip } from "@mantine/core";
import { Icon } from "components/Icon";
import { BUTTON_WIDTH, BUTTON_HEIGHT } from "./Constants";

type Props = {
    title: string;
    icon: string;
    iconColor?: string;
    children?: React.ReactNode;
};

export function ToolbarDropdown(props: Props) {
    return (
        <Popover
            shadow="md"
            withinPortal
            withArrow
            transitionProps={{ transition: "pop" }}
            position="bottom"
        >
            <Popover.Target>
                <Tooltip label={props.title} withArrow>
                    <Button
                        style={{ color: "inherit" }}
                        variant="default"
                        w={BUTTON_WIDTH}
                        h={BUTTON_HEIGHT}
                        p={0}
                    >
                        <Icon
                            color={props.iconColor == undefined ? "inherit" : props.iconColor}
                            icon={props.icon}
                            size={18}
                        />
                    </Button>
                </Tooltip>
            </Popover.Target>
            <Popover.Dropdown>{props.children}</Popover.Dropdown>
        </Popover>
    );
}
