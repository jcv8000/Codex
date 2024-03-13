import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Tooltip, ActionIcon, Box } from "@mantine/core";
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Icon } from "components/Icon";
import { locales } from "common/Locales";
import Color from "color";

export function CustomCodeBlockWrapper({ node, updateAttributes }: NodeViewProps) {
    // TODO re-implement
    return (
        <NodeViewWrapper>
            <NodeViewContent />
        </NodeViewWrapper>
    );
}

/*
export function CustomCodeBlockWrapper({ node, updateAttributes }: NodeViewProps) {
    const appContext = useContext(AppContext);
    const editorTexts = locales[appContext.prefs.general.locale].editor;

    const lineCount = useMemo(() => {
        let c = 1;
        const matches = node.textContent.match(/\n/gm);
        if (matches != undefined) c = matches.length + 1;

        return c;
    }, [node.textContent]);

    const [hovered, setHovered] = useState(false);

    const [scrollbarColor, setScrollbarColor] = useState("inherit");
    const [scrollbarHoverColor, setScrollbarHoverColor] = useState("inherit");

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current != null) {
            const bg = window.getComputedStyle(ref.current).backgroundColor;
            if (bg != "") {
                const lightBase = 0.2;
                const darkBase = 1.5;

                const sbColor = Color(bg).isLight()
                    ? Color(bg).darken(lightBase).hex()
                    : Color(bg).lighten(darkBase).hex();

                const sbHoverColor = Color(bg).isLight()
                    ? Color(bg)
                          .darken(lightBase * 1.5)
                          .hex()
                    : Color(bg)
                          .lighten(darkBase * 1.5)
                          .hex();

                setScrollbarColor(sbColor);
                setScrollbarHoverColor(sbHoverColor);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref.current]);

    return (
        <NodeViewWrapper>
            <Box
                sx={{
                    "pre.hljs::-webkit-scrollbar-thumb": {
                        backgroundColor: scrollbarColor
                    },
                    "pre.hljs::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: scrollbarHoverColor
                    }
                }}
            >
                <pre
                    className="hljs"
                    // Preact spellCheck workaround, must be a string not a boolean
                    spellCheck="false"
                    data-collapsed={node.attrs.collapsed}
                    onMouseOver={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {hovered && lineCount > 4 && (
                        <Tooltip
                            withArrow
                            withinPortal
                            label={editorTexts.code_block_collapse}
                            position="left"
                        >
                            <span
                                contentEditable={false}
                                className="code-collapser"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    updateAttributes({ collapsed: !node.attrs.collapsed });
                                }}
                            >
                                <ActionIcon variant="transparent">
                                    <Icon
                                        icon={node.attrs.collapsed ? "chevron-down" : "chevron-up"}
                                    />
                                </ActionIcon>
                            </span>
                        </Tooltip>
                    )}

                    {!hovered && node.attrs.language != undefined && (
                        <span contentEditable={false} className="code-language">
                            {node.attrs.language}
                        </span>
                    )}

                    <div
                        ref={ref}
                        style={{
                            background: "inherit",
                            cursor: "text",
                            display: "flex",
                            flex: 1
                        }}
                    >
                        <NodeViewContent
                            as="code"
                            className={
                                node.attrs.language ? "language-" + node.attrs.language : undefined
                            }
                            contentEditable={!node.attrs.collapsed}
                        />
                    </div>
                </pre>
            </Box>
        </NodeViewWrapper>
    );
}
*/
