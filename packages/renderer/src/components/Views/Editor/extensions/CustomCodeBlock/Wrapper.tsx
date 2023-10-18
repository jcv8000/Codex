import { useState } from "react";
import { Tooltip, ActionIcon } from "@mantine/core";
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Icon } from "components/Icon";

export function CustomCodeBlockWrapper({ node, updateAttributes }: NodeViewProps) {
    let lineCount = 1;

    const matches = node.textContent.match(/\n/gm);
    if (matches != undefined) lineCount = matches.length + 1;

    //if (lineCount <= 4) props.updateAttributes({ collapsed: false });

    const [hovered, setHovered] = useState(false);

    return (
        <NodeViewWrapper
            as="pre"
            className="hljs"
            // Preact spellCheck workaround, must be a string not a boolean
            spellCheck="false"
            data-collapsed={node.attrs.collapsed}
            onMouseOver={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {hovered && lineCount > 4 && (
                <Tooltip withArrow withinPortal label="Collapse" position="left">
                    <span
                        contentEditable={false}
                        className="code-collapser"
                        onClick={(e) => {
                            e.stopPropagation();
                            updateAttributes({ collapsed: !node.attrs.collapsed });
                        }}
                    >
                        <ActionIcon variant="transparent">
                            <Icon icon={node.attrs.collapsed ? "chevron-down" : "chevron-up"} />
                        </ActionIcon>
                    </span>
                </Tooltip>
            )}

            {!hovered && node.attrs.language != undefined && (
                <span contentEditable={false} className="code-language">
                    {node.attrs.language}
                </span>
            )}

            <NodeViewContent
                as="code"
                className={node.attrs.language ? "language-" + node.attrs.language : undefined}
                contentEditable={!node.attrs.collapsed}
            />
        </NodeViewWrapper>
    );
}
