import { Box, Collapse, Flex, Text } from "@mantine/core";
import { Icon } from "components/Icon";
import React, { Children, MouseEventHandler, useState } from "react";

import classes from "./SidebarItem.module.css";

type Props = {
    icon: string;
    text: string;
    depth?: number;
    children?: React.ReactNode;
    onClick?: MouseEventHandler;
    shouldBeActive?: boolean;
};

export function SidebarItem({ icon, text, depth = 0, children, onClick, shouldBeActive }: Props) {
    const [open, setOpen] = useState(false);
    const active = false || shouldBeActive;

    const clickHandler: MouseEventHandler = (e) => {
        setOpen(!open);

        if (onClick != undefined) onClick(e);
    };

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
            <Box
                onClick={clickHandler}
                title={text}
                className={active ? [classes.item, classes.itemActive].join(" ") : classes.item}
                style={{ paddingLeft: `calc((${depth} + 1) * 0.75rem)` }}
            >
                <Flex h={34} align="center" gap="sm" pr="sm">
                    <Icon icon={icon} vAlign="-3px" />

                    <Text truncate>{text}</Text>

                    {renderedChildren != null && (
                        <span
                            className={
                                open ? [classes.caret, classes.caretOpen].join(" ") : classes.caret
                            }
                        ></span>
                    )}
                </Flex>
            </Box>

            {renderedChildren}
        </>
    );
}
