import { Box, Collapse, Flex, Text, rem } from "@mantine/core";
import { Icon } from "components/Icon";
import React, { Children, MouseEventHandler, useState } from "react";

import classes from "./SidebarItem.module.css";
import clsx from "clsx";

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

    const renderedChildren =
        Children.toArray(children).length > 0 ? (
            <Collapse in={open}>
                <div>{children}</div>
            </Collapse>
        ) : null;

    const padding = rem((depth + 1) * 12);

    return (
        <>
            <Box
                onClick={clickHandler}
                title={text}
                className={clsx(classes.noteItem, active && classes.noteItemActive)}
                style={{ paddingLeft: padding }}
            >
                <Flex h={34} align="center" gap="sm" pr="sm">
                    <Icon icon={icon} />

                    <Text fz="sm" truncate>
                        {text}
                    </Text>

                    {renderedChildren != null && (
                        <span className={clsx(classes.caret, open && classes.caretOpen)}></span>
                    )}
                </Flex>
            </Box>

            {renderedChildren}
        </>
    );
}
