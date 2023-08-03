import { Box, Collapse, Flex, Text } from "@mantine/core";
import { Icon } from "components/Icon";
import React, { Children, MouseEventHandler, useState } from "react";
import { sidebarItemStyles } from "./styles";

type Props = {
    icon: string;
    text: string;
    depth?: number;
    children?: React.ReactNode;
    onClick?: MouseEventHandler;
    shouldBeActive?: () => boolean;
};

export function SidebarItem({ icon, text, depth = 0, children, onClick, shouldBeActive }: Props) {
    const [open, setOpen] = useState(false);

    const clickHandler: MouseEventHandler = (e) => {
        setOpen(!open);

        if (onClick != undefined) onClick(e);
    };

    const active = shouldBeActive == undefined ? false : shouldBeActive();

    const { classes } = sidebarItemStyles({ active: active, depth: depth, open: open });

    let renderedChildren: JSX.Element | null = null;

    if (Children.toArray(children).length > 0) {
        renderedChildren = (
            <Collapse in={open}>
                <div>{children}</div>
            </Collapse>
        );
    }

    return (
        <>
            <Box onClick={clickHandler} title={text} className={classes.root}>
                <Flex h={34} align="center" gap="sm" pr="sm">
                    <Icon icon={icon} vAlign="-3px" />

                    <Text truncate>{text}</Text>

                    {renderedChildren != null && <span className={classes.caret}></span>}
                </Flex>
            </Box>

            {renderedChildren}
        </>
    );
}
