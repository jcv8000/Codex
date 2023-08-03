import React from "react";
import { Button, createStyles, Group, Menu, Tooltip } from "@mantine/core";
import { Icon } from "components/Icon";

type Props = {
    title: string;
    icon: string;
    onClick?: () => void;
    isActive?: () => boolean;
    children?: React.ReactNode;
};

const useStyles = createStyles((theme) => ({
    button: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    },

    menuControl: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderLeft: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white}`
    }
}));

export function ToolbarSplit(props: Props) {
    const { classes } = useStyles();
    const isActive = props.isActive == undefined ? () => false : props.isActive;

    return (
        <Group noWrap spacing={0}>
            <Tooltip label={props.title} withArrow>
                <Button
                    style={{ color: "inherit" }}
                    variant={isActive() ? "filled" : "default"}
                    className={classes.button}
                    px={6}
                    size="xs"
                    onClick={props.onClick}
                >
                    <Icon icon={props.icon} size={18} />
                </Button>
            </Tooltip>
            <Menu
                shadow="md"
                withinPortal
                withArrow
                transitionProps={{ transition: "pop-top-left" }}
                position="bottom-start"
                clickOutsideEvents={["pointerdown"]}
            >
                <Menu.Target>
                    <Button
                        style={{ color: "inherit" }}
                        variant={isActive() ? "filled" : "default"}
                        className={classes.menuControl}
                        px={6}
                        size="xs"
                    >
                        <Icon icon="chevron-down" />
                    </Button>
                </Menu.Target>
                <Menu.Dropdown>{props.children}</Menu.Dropdown>
            </Menu>
        </Group>
    );
}
