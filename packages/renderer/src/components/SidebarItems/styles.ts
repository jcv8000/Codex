import { createStyles } from "@mantine/core";

export const sidebarItemStyles = createStyles(
    (theme, params: { active: boolean; depth: number; open?: boolean }) => ({
        root: {
            paddingLeft: `calc(${params.depth + 1} * ${theme.spacing.sm}) !important`,

            userSelect: "none",
            backgroundColor: params.active
                ? theme.fn.primaryColor()
                : theme.colorScheme[theme.fn.primaryShade(theme.colorScheme) + 1],
            color: params.active ? theme.colors["accentText"][0] : theme.colorScheme[0],
            transition: "background-color 0.1s",

            "&:hover": {
                backgroundColor: params.active
                    ? theme.fn.primaryColor()
                    : theme.colorScheme == "light"
                    ? theme.colors.gray[2]
                    : theme.colors.gray[8],
                cursor: "pointer"
            }
        },
        caret: {
            display: "inline-block",
            content: '""',
            borderTop: "0.3em solid",
            borderRight: "0.3em solid transparent",
            borderBottom: "0",
            borderLeft: "0.3em solid transparent",
            verticalAlign: "2px",
            transform: params.open ? "rotate(-180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            marginLeft: "auto"
        }
    })
);
