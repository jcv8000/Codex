import { Box } from "@mantine/core";

export function EditorStyles(props: { children: JSX.Element | JSX.Element[] }) {
    return (
        <Box
            sx={(theme) => ({
                ".node-mathBlock.has-focus, .node-mathInline.has-focus, .node-canvas.has-focus": {
                    outline: `2px solid ${theme.fn.primaryColor()}`
                },
                ".node-image.has-focus img": {
                    outline: `2px solid ${theme.fn.primaryColor()}`
                },
                "th, td": {
                    border: `1px solid ${theme.colorScheme == "light" ? "#d0d7de" : "#373A40"}`
                },
                "tr:nth-child(even)": {
                    backgroundColor: theme.colorScheme == "light" ? "#f6f8fa" : "#25262b"
                }
            })}
            mx="md"
        >
            {props.children}
        </Box>
    );
}
