import { createStyles, getStylesRef } from "@mantine/core";

export const canvasStyles = createStyles((theme, params: { editing: boolean }) => ({
    root: {
        position: "relative",

        [`&:hover .${getStylesRef("editIcon")}`]: {
            display: "flex"
        }
    },
    editIcon: {
        ref: getStylesRef("editIcon"),
        display: "none",
        position: "absolute",
        float: "right",
        top: "8px",
        right: "8px"
    },
    svg: {
        cursor: params.editing ? "crosshair" : "pointer",
        backgroundColor: theme.colorScheme == "light" ? theme.colors.gray[1] : theme.colors.dark[6],

        "& path": {
            fill: "none",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }
    }
}));
