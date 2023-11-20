import { Box } from "@mantine/core";
import { useContext } from "react";
import { AppContext } from "types/AppStore";

export function EditorStyles(props: { children: JSX.Element | JSX.Element[] }) {
    const { prefs } = useContext(AppContext);
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
                },
                ".ProseMirror pre code": {
                    "white-space": prefs.editor.codeWordWrap
                        ? "pre-wrap !important"
                        : "pre !important",
                    "word-break": prefs.editor.codeWordWrap ? "break-all !important" : "inherit"
                },
                ".ProseMirror hr": {
                    borderTop:
                        theme.colorScheme == "light"
                            ? "2px solid rgba(13, 13, 13, 0.1)"
                            : "2px solid rgba(256, 256, 256, 0.2)"
                }
            })}
            mx="md"
        >
            {props.children}
        </Box>
    );
}
